import axios from "axios";
import postForm, { convertObjectDataToString } from "../postForm";

type RuntimeMode = "Development" | "Production";
interface EsewaPaymentConstructor {
  /**
   * @param {RuntimeMode} runtimeMode
   *
   * Set Runtime to `Development` for Testing usage.
   *
   * Set to `Production` for Live Usage.
   */
  runtimeMode?: RuntimeMode;
  /**
   * @param {string | undefined} merchantId - A unique Id used to identify merchant by esewa.
   *
   * This would Be Provided By eSewa.
   *
   * Ommit this Field for `Development` runtime as `EPAYTES` is set by Default.
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
  amt: number;
  txAmt: number;
  psc: number;
  pdc: number;
  tAmt: number;
  pid: string;
  su?: string;
  fu?: string;
}

interface PaymentVerificationRequest {
  amt: number;
  pid: string;
  rid: string;
}

/**
 * An Esewa Wrapper for Making and Validating Transaction.
 *
 * @param runtimeMode - Development | Production
 * @param merchantId - The Merchant Code Provided by Esewa
 * @param successRedirectUrl -  Redirect Url For Successful Payment
 * @param failureRedirectUrl -  Redirect Url For Payment Failure
 *
 * @example 
 * - Initializing the Package
 * ```ts
 * const eswaPayment = new EsewaPayment({
  runtimeMode: "Development",
  merchantId: "EPAYTEST",
  successRedirectUrl: "http://localhost:3000/success",
  failureRedirectUrl: "http://localhost:3000/failure",
  });
 * ```
 */

export class EsewaPayment {
  private _runtimeMode: RuntimeMode;
  private _apiUrl = "";
  private _scd = "";
  private _successRedirectUrl = "";
  private _failureRedirectUrl = "";

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

  private setApiUrl() {
    if (this._runtimeMode === "Production") {
      this._apiUrl = "https://esewa.com.np";
    } else {
      this._apiUrl = "https://uat.esewa.com.np";
    }
  }

  private setMerchantId(merchantId: EsewaPaymentConstructor["merchantId"]) {
    if (typeof merchantId === "string" && merchantId.length > 2) {
      this._scd = merchantId;
    } else {
      throw new Error("MerchantId cannot Be empty.");
    }
  }

  private setRedirectUrls(
    successRedirectUrl: EsewaPaymentConstructor["successRedirectUrl"],
    failureRedirectUrl: EsewaPaymentConstructor["failureRedirectUrl"]
  ) {
    if (
      typeof successRedirectUrl === "string" &&
      successRedirectUrl.length > 5 &&
      typeof failureRedirectUrl === "string" &&
      failureRedirectUrl.length > 5
    ) {
      this._successRedirectUrl = successRedirectUrl;
      this._failureRedirectUrl = failureRedirectUrl;
    }
  }

  public initiate(params: EsewaPaymentRequest) {
    const paymentInitiateUrl = this._apiUrl + "/epay/main";
    const finalPostData = {
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
