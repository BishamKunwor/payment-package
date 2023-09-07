import postForm, { convertObjectDataToString } from '../postForm';

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
    const form = new URLSearchParams();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    try {
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
