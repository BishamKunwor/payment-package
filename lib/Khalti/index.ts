export class KhaltiPayment {
  private _runtimeMode: RuntimeMode = 'Development';
  private _apiUrl = 'https://a.khalti.com/api/v2';
  private _khaltiSecretKey = 'live_secret_key_c29bff9015674b939338370b7ea9f7f2';
  private _websiteUrl = 'https://example.com';
  private _redirectUrl = 'https://example.com/redirectUrl';

  constructor(params?: KhaltiPaymentConstructor) {
    if (typeof params === 'undefined') {
      this._logConfig();
      return;
    }
    const {
      runtimeMode = 'Development',
      khaltiSecretKey,
      websiteUrl,
      redirectUrl,
    } = params;
    this._runtimeMode = runtimeMode;
    this._setKhaltiSecret(khaltiSecretKey);
    this._setApiUrl();
    this._setRedirectsAndWebsiteUrl(websiteUrl, redirectUrl);
    if (this._runtimeMode === 'Development') {
      this._logConfig();
    }
  }

  private _logConfig() {
    console.log('Runtime Mode set to Development.');
    console.log(`Setting Development API URL: ${this._apiUrl}`);
    console.log(`Setting Development Key To: ${this._khaltiSecretKey}`);
    console.log(`Website Url: ${this._websiteUrl}`);
    console.log(`Redirect Url: ${this._redirectUrl}`);
  }

  private _setApiUrl() {
    if (this._runtimeMode === 'Production') {
      this._apiUrl = 'https://khalti.com/api/v2';
    }
  }

  /**
   * Sets the secret key provided by Khalti
   * @param khaltiSecretKey - This is the secret key provided by Khalti
   */
  private _setKhaltiSecret(
    khaltiSecretKey: KhaltiPaymentConstructor['khaltiSecretKey'],
  ) {
    if (
      this._runtimeMode === 'Production' &&
      typeof khaltiSecretKey === 'undefined'
    ) {
      throw new Error('KahltiSecret Key Cannot Be Empty.');
    }
    if (typeof khaltiSecretKey === 'string') {
      this._khaltiSecretKey = khaltiSecretKey;
    }
  }

  /**
   * Sets The Redirect Url for the App
   * @param websiteUrl - Website Url where Khalti is being Integrated
   * @param redirectUrl - Redirect Url after Payment By Khalti
   */
  private _setRedirectsAndWebsiteUrl(
    websiteUrl: KhaltiPaymentConstructor['websiteUrl'],
    redirectUrl: KhaltiPaymentConstructor['redirectUrl'],
  ) {
    if (
      this._runtimeMode === 'Production' &&
      typeof websiteUrl === 'undefined'
    ) {
      throw new Error('Website URL Cannot Be Empty.');
    }
    if (
      this._runtimeMode === 'Production' &&
      typeof redirectUrl === 'undefined'
    ) {
      throw new Error('Redirect Url Cannot Be Empty.');
    }
    if (typeof websiteUrl === 'string') {
      this._websiteUrl = websiteUrl;
    }
    if (typeof redirectUrl === 'string') {
      this._redirectUrl = redirectUrl;
    }
  }

  public getPidx(params: GetPidxProps) {
    if (Object.keys(params || {}).length === 0) {
      throw new Error('Cannot Initiate Request without Valid Parameters.');
    }
    if (typeof window !== 'undefined') {
      throw new Error(
        'Pidx Can Only Be Generated On Server Side i.e. Node.js due to CORS error set on frontend. Implement This Function in Backend and send Its response to the Frontend to Overcome this Issue.',
      );
    }
    const getPidxUrl = this._apiUrl + '/epayment/initiate/';
    const finalPostData: any = {
      website_url: this._websiteUrl || params.websiteUrl,
      return_url: this._redirectUrl || params.redirectUrl,
      ...params,
    };
    let checkForNullParams = [
      'return_url',
      'website_url',
      'amount',
      'purchase_order_id',
      'purchase_order_name',
    ];
    for (let key of checkForNullParams) {
      if (typeof finalPostData[key] === 'undefined') {
        throw new Error(`${key} cannot be Empty while Initiating Payment.`);
      }
    }
    return this._makeGetPidxRequest(getPidxUrl, finalPostData);
  }

  private async _makeGetPidxRequest(path: string, data: any) {
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this._khaltiSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Verify Payment From Khalti
   * @param {string} pidx - Product ID (pid) used on payment request
   * @example
   * ```ts
   * await khaltiPayment.verifyPayment("3owTGDFzmWrRPEsF3wFF7B")
   * ```
   */
  public verifyPayment(pidx: string) {
    const verificationUrl = this._apiUrl + '/epayment/lookup/';
    if (typeof pidx === 'undefined') {
      throw new Error('Pidx Cannot be undefined While Verifying Payment.');
    }
    return this._makeVerficationRequest(verificationUrl, pidx);
  }

  private async _makeVerficationRequest(path: string, pidx: string) {
    try {
      const response = await fetch(path, {
        method: 'POST',
        body: JSON.stringify({ pidx }),
        headers: {
          Authorization: `Key ${this._khaltiSecretKey}`,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}
