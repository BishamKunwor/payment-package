import postForm, { convertObjectDataToString } from '../postForm';

type RuntimeMode = 'Development' | 'Production';

interface EsewaPaymentConstructor {
  /**
   * @param {RuntimeMode} runtimeMode - `Development` or `Production` Mode to Perform Transaction
   *
   *@default Development
   *
   * Set to `Production` for Live Usage.
   */
  runtimeMode?: RuntimeMode;

  /**
   * @param {string | undefined} merchantId - A unique Id provided by `eSewa` to identify the merchant.
   *
   * Ommit this Field for `Development` runtime as `EPAYTEST` is set by Default.
   */
  merchantId?: string;

  /**
   * @param {string | undefined} successRedirectUrl - Redirects to this link After Successful Payment.
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

interface EsewaPaymentRequestInit {
  /**
   * @param {number} amount - Amount of product or item or ticket etc in Rs.
   */
  amount: number;
  /**
   * @param {number} taxAmount - Tax amount on product or item or ticket etc
   */
  taxAmount?: number;
  /**
   * @param {number} serviceCharge - Service charge by merchant on product or item or ticket etc
   */
  serviceCharge?: number;
  /**
   * @param {number} deliveryCharge -Delivery charge by merchant on product or item or ticket etc
   */
  deliveryCharge?: number;
  /**
   * @param {number} totalAmount - Total payment amount including tax, service and deliver charge. `[i.e totalAmount = amount + taxAmount + serviceCharge + deliveryCharge]`
   */
  totalAmount: number;
  /**
   * @param {string} processId - A unique ID of product or item or ticket etc
   */
  processId: string;
  /**
   * @param {string} successRedirectUrl - Success URL: a redirect URL of merchant application where customer will be redirected after SUCCESSFUL transaction
   */
  successRedirectUrl?: string;
  /**
   * @param {string} failureRedirectUrl - Failure URL: a redirect URL of merchant application where customer will be redirected after FAILURE or PENDING transaction
   */
  failureRedirectUrl?: string;
}

interface EsewaPaymentFinalRequest extends EsewaPaymentRequest {
  /**
   * @param {string} scd - Merchant code provided by eSewa
   */
  scd: string;
}

interface PaymentVerificationRequestInit {
  /**
   * @param {number} amount - Total payment amount (tAmt)
   */
  amount: number;
  /**
   * @param {string} processId - Product ID (pid) used on payment request
   */
  processId: string;
  /**
   * @param {string} referenceId - A unique payment reference code generated by eSewa
   */
  referenceId: string;
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
 * 
 *  * - Initializing the Package Without Global Redirect Urls
 * ```ts
 * const eswaPayment = new EsewaPayment();
  ```
 * 
 * - Initializing the Package With Global Redirect Urls
 * ```ts
 * const eswaPayment = new EsewaPayment({
  successRedirectUrl: "https://example.com/success",
  failureRedirectUrl: "https://example.com/failure",
  });
  ```
 * 
 */
export class EsewaPayment {
  private _runtimeMode: RuntimeMode = 'Development';
  private _apiUrl = 'https://uat.esewa.com.np';
  private _scd = 'EPAYTEST';
  private _successRedirectUrl = 'https://example.com/esewaSuccessRedirect';
  private _failureRedirectUrl = 'https://example.com/esewaFailureRedirect';

  constructor(params?: EsewaPaymentConstructor) {
    if (typeof params === 'undefined') {
      console.log(`Runtime Mode set to Development.`);
      console.log(`MerchantId set to ${this._scd}`);
      console.log(`Redirect url Set to ${this._apiUrl}`);
      console.log(`Success Redirect Url: ${this._successRedirectUrl}`);
      console.log(`Failure Redirect Url: ${this._failureRedirectUrl}`);
      return;
    }
    const {
      runtimeMode = 'Development',
      merchantId,
      successRedirectUrl,
      failureRedirectUrl,
    } = params;
    this._runtimeMode = runtimeMode;
    this._setMerchantId(merchantId);
    this._setApiUrl();
    this._setRedirectUrls(successRedirectUrl, failureRedirectUrl);
  }

  /**
   * Sets the scd provided by eSewa
   * @param merchantId - This is the merchand code provided by eSewa and is known by scd
   */
  private _setMerchantId(merchantId: EsewaPaymentConstructor['merchantId']) {
    if (
      this._runtimeMode === 'Production' &&
      typeof merchantId === 'undefined'
    ) {
      throw new Error('MerchantId cannot Be Empty.');
    }
    if (typeof merchantId === 'string') {
      this._scd = merchantId;
    }
    if (this._runtimeMode === 'Development') {
      console.log(`Runtime Mode set to Development.`);
      console.log(`MerchantId set to ${this._scd}`);
    }
  }

  /**
   * Sets the base API Url
   */
  private _setApiUrl() {
    if (this._runtimeMode === 'Production') {
      this._apiUrl = 'https://esewa.com.np';
    } else if (this._runtimeMode === 'Development') {
      console.log(`Redirect url Set to ${this._apiUrl}`);
    }
  }

  /**
   * Sets The Redirect Url for the App
   * @param successRedirectUrl - Redirect Url For Successful Payment.
   * @param failureRedirectUrl - Redirect Url For Payment Failure.
   */
  private _setRedirectUrls(
    successRedirectUrl: EsewaPaymentConstructor['successRedirectUrl'],
    failureRedirectUrl: EsewaPaymentConstructor['failureRedirectUrl'],
  ) {
    if (typeof successRedirectUrl === 'string') {
      this._successRedirectUrl = successRedirectUrl;
    }
    if (typeof failureRedirectUrl === 'string') {
      this._failureRedirectUrl = failureRedirectUrl;
    }
    if (this._runtimeMode === 'Development') {
      console.log(`Success Redirect Url: ${this._successRedirectUrl}`);
      console.log(`Failure Redirect Url: ${this._failureRedirectUrl}`);
    }
  }

  /**
   * Initiate Esewa Payment Request
   */
  public initiate(params: EsewaPaymentRequestInit) {
    if (Object.keys(params || {}).length === 0) {
      console.log('Cannot Initiate Payment without Valid Request Parameters.');
      return;
    }
    const paymentInitiateUrl = this._apiUrl + '/epay/main';
    const finalPostData: EsewaPaymentFinalRequest = {
      su: params.successRedirectUrl || this._successRedirectUrl,
      fu: params.failureRedirectUrl || this._failureRedirectUrl,
      scd: this._scd,
      amt: params.amount,
      pdc: params.deliveryCharge || 0,
      pid: params.processId,
      psc: params.serviceCharge || 0,
      tAmt: params.totalAmount,
      txAmt: params.taxAmount || 0,
    };
    let checkForNullParams = {
      amt: 'amount',
      txAmt: 'taxAmount',
      psc: 'serviceCharge',
      pdc: 'deliveryCharge',
      scd: 'merchantId',
      tAmt: 'totalAmount',
      pid: 'processId',
      su: 'successRedirectUrl',
      fu: 'failureRedirectUrl',
    } as const;
    for (let key in checkForNullParams) {
      if (
        typeof finalPostData[key as keyof typeof checkForNullParams] ===
        'undefined'
      ) {
        throw new Error(
          `${
            checkForNullParams[key as keyof typeof checkForNullParams]
          } cannot be Empty while Initiating Payment.`,
        );
      }
    }
    postForm(
      paymentInitiateUrl,
      convertObjectDataToString<typeof finalPostData>(finalPostData),
    );
  }

  /**
   * Verify Payment From eSewa
   * @param {number} amount - Total payment amount (tAmt)
   * @param {string} processId - Product ID (pid) used on payment request
   * @param {string} referenceId - Reference ID recieved from esewa
   * @returns {Object} - Returns {success: boolean}
   */
  public verifyPayment(params: PaymentVerificationRequestInit) {
    const verificationUrl = this._apiUrl + '/epay/transrec';
    if (Object.keys(params || {}).length === 0) {
      console.log('Cannot Verify Payment without Valid Request Parameters.');
      return;
    }
    let finalPostData: PaymentVerificationRequest = {
      amt: params.amount,
      pid: params.processId,
      rid: params.referenceId,
    };
    let checkForNullParams = {
      amt: 'amount',
      pid: 'processId',
      rid: 'referenceId',
    };
    for (let key in checkForNullParams) {
      if (
        typeof finalPostData[key as keyof typeof checkForNullParams] ===
        'undefined'
      ) {
        throw new Error(
          `${
            checkForNullParams[key as keyof typeof checkForNullParams]
          } cannot be Empty while Verifying Payment.`,
        );
      }
    }
    return this.makeVerficationRequest(verificationUrl, finalPostData);
  }

  private async makeVerficationRequest(
    path: string,
    params: PaymentVerificationRequest,
  ) {
    const finalPostData = {
      scd: this._scd,
      ...params,
    };
    let formData: { [key: string]: string } =
      convertObjectDataToString<typeof finalPostData>(finalPostData);
    for (let key in formData) {
      if (typeof formData[key] === 'undefined') {
        throw new Error(`${key} cannot be Empty while Verifing Payment.`);
      }
    }
    // const form = new FormData();
    const form = new URLSearchParams();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    try {
      // const response = await axios({
      //   method: "POST",
      //   url: path,
      //   data: form,
      // });
      let response = await fetch(path, {
        method: 'POST',
        body: form,
      });
      let responseData = await response.text();
      if (responseData.includes('Success')) {
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    }
  }
}
