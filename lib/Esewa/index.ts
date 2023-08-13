import axios from "axios";
import postForm, { convertObjectDataToString } from "../postForm";

type RuntimeMode = "Development" | "Production";

interface EsewaPaymentConstructor {
  /**
   * @param {RuntimeMode} runtimeMode - `Development` or `Production` Mode to Perform Transaction
   *
   * Set Runtime to `Development` for Testing usage.
   *
   * Set to `Production` for Live Usage.
   */
  runtimeMode?: RuntimeMode;

  /**
   * @param {string | undefined} merchantId - A unique Id provided by `eSewa` to identify merchant by esewa.
   *
   * Ommit this Field for `Development` runtime as `EPAYTEST` is set by Default.
   */
  merchantId?: string;

  /**
   * @param {string | undefined} successRedirectUrl - Redirects to this link After successful Payment.
   */
  successRedirectUrl?: string;

  /**
   * @param {string | undefined} failureRedirectUrl - Redirects to this link After Payment Failure.
   */
  failureRedirectUrl?: string;
}

interface EsewaPaymentRequest {
  /**
   * @param {number} amt - Amount of product or item or ticket etc
   */
  amt: number;
  /**
   * @param {number} txAmt - Tax amount on product or item or ticket etc
   */
  txAmt: number;
  /**
   * @param {number} psc - Service charge by merchant on product or item or ticket etc
   */
  psc: number;
  /**
   * @param {number} pdc -Delivery charge by merchant on product or item or ticket etc
   */
  pdc: number;
  /**
   * @param {number} tAmt - Total payment amount including tax, service and deliver charge. `[i.e tAmt = amt + txAmt + psc + tAmt]`
   */
  tAmt: number;
  /**
   * @param {string} pid - A unique ID of product or item or ticket etc
   */
  pid: string;
  /**
   * @param {string} su - Success URL: a redirect URL of merchant application where customer will be redirected after SUCCESSFUL transaction
   */
  su?: string;
  /**
   * @param {string} fu - Failure URL: a redirect URL of merchant application where customer will be redirected after FAILURE or PENDING transaction
   */
  fu?: string;
}

interface EsewaPaymentFinalRequest extends EsewaPaymentRequest {
  /**
   * @param {string} scd - Merchant code provided by eSewa
   */
  scd: string;
}

interface PaymentVerificationRequest {
  /**
   * @param {number} amt - Total payment amount (tAmt)
   */
  amt: number;
  /**
   * @param {string} pid - Product ID (pid) used on payment request
   */
  pid: string;
  /**
   * @param {string} rid - A unique payment reference code generated by eSewa
   */
  rid: string;
}

/**
 * An Esewa Wrapper for Making and Validating Transaction.
 *
 * @param {string} runtimeMode - Development | Production
 * @param merchantId - The Merchant Code Provided by Esewa
 * @param successRedirectUrl -  Redirect Url For Successful Payment
 * @param failureRedirectUrl -  Redirect Url For Payment Failure
 *
 * @example 
 * - Initializing the Package
 * ```ts
 * const eswaPayment = new EsewaPayment({
  runtimeMode: "Development",
  successRedirectUrl: "http://localhost:3000/success",
  failureRedirectUrl: "http://localhost:3000/failure",
  });
 * ```
 */
export class EsewaPayment {
  private _runtimeMode: RuntimeMode;
  private _apiUrl = "https://uat.esewa.com.np";
  private _scd = "EPAYTEST";
  private _successRedirectUrl = "http://localhost:3000/esewaSuccessRedirect";
  private _failureRedirectUrl = "http://localhost:3000/esewaFailureRedirect";

  constructor({
    runtimeMode = "Development",
    merchantId,
    successRedirectUrl,
    failureRedirectUrl,
  }: EsewaPaymentConstructor) {
    this._runtimeMode = runtimeMode;
    this.setApiUrl();
    this.setMerchantId(merchantId);
    this.setRedirectUrls(successRedirectUrl, failureRedirectUrl);
  }

  /**
   * Sets the base API Url
   */
  private setApiUrl() {
    if (this._runtimeMode === "Production") {
      this._apiUrl = "https://esewa.com.np";
    } else if (this._runtimeMode === "Development") {
      console.log(
        `Runtime Mode set to Development.\nRedirect url Set to ${this._apiUrl}`
      );
    }
  }

  /**
   * Sets the scd provided by eSewa
   * @param merchantId - eSewa scd
   */
  private setMerchantId(merchantId: EsewaPaymentConstructor["merchantId"]) {
    if (typeof merchantId === "string") {
      this._scd = merchantId;
    }
    if (this._runtimeMode === "Development") {
      console.log(`MerchantId set to ${this._scd}`);
    }
  }

  /**
   * Sets The Redirect Url for the App
   * @param successRedirectUrl - Redirect Url For Successful Payment.
   * @param failureRedirectUrl - Redirect Url For Payment Failure.
   */
  private setRedirectUrls(
    successRedirectUrl: EsewaPaymentConstructor["successRedirectUrl"],
    failureRedirectUrl: EsewaPaymentConstructor["failureRedirectUrl"]
  ) {
    if (typeof successRedirectUrl === "string") {
      this._successRedirectUrl = successRedirectUrl;
    }
    if (typeof failureRedirectUrl === "string") {
      this._failureRedirectUrl = failureRedirectUrl;
    }
    if (this._runtimeMode === "Development") {
      console.log(`Success Redirect Url: ${this._successRedirectUrl}`);
      console.log(`Failure Redirect Url: ${this._failureRedirectUrl}`);
    }
  }

  /**
   * Initiate Esewa Payment Request
   */
  public initiate(params: EsewaPaymentRequest) {
    const paymentInitiateUrl = this._apiUrl + "/epay/main";
    const finalPostData: EsewaPaymentFinalRequest = {
      su: this._successRedirectUrl,
      fu: this._failureRedirectUrl,
      scd: this._scd,
      ...params,
    };
    postForm(
      paymentInitiateUrl,
      convertObjectDataToString<typeof finalPostData>(finalPostData)
    );
  }

  public verifyPayment(params: PaymentVerificationRequest) {
    const verificationUrl = this._apiUrl + "/epay/transrec";
    return this.makeVerficationRequest(verificationUrl, params);
  }

  private async makeVerficationRequest(
    path: string,
    params: PaymentVerificationRequest
  ) {
    const finalPostData = {
      scd: this._scd,
      ...params,
    };
    let formData: { [key: string]: string } =
      convertObjectDataToString<typeof finalPostData>(finalPostData);
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    try {
      const response = await axios({
        method: "POST",
        url: path,
        data: form,
      });
      if (response.data.includes("Success")) {
        return {
          success: true,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    }
  }
}
