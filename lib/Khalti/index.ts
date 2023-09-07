import axios from "axios";

type RuntimeMode = "Development" | "Production";
interface WebsiteUrls {
  /**
   * Landing page after the transaction
   *
   * Field must contain a URL.
   */
  redirectUrl?: string;
  /**
   * The URL of the website.
   *
   * Field must contain a URL.
   */
  websiteUrl?: string;
}
interface KhaltiPaymentConstructor extends WebsiteUrls {
  /** Set this to Development if You want to test the payment System. Set it to Production if you are actually using it in live application. */
  runtimeMode?: RuntimeMode;
  /** This is the secret key provided by khalti.
   *
   * Ommit this field for development/testing usage.
   *
   * Provide Live key for live application usage.
   */
  khaltiSecretKey: string;
}

interface GetPidxProps extends WebsiteUrls {
  /**
   * Total payable amount excluding the service charge.
   */
  amount: number;
  /**
   * Unique identifier for the transaction generated by merchant
   */
  purchase_order_id: string;
  /**
   * This is the name of the product.
   */
  purchase_order_name: string;
  /**
   * This field represents to whom the txn is going to be billed to.
   */
  customer_info?: any;
  /**
   * Any number of labels and amounts can be passed.
   */
  amount_breakdown?: any[];
  /**
   * No of set is unlimited
   */
  product_details?: any[];
}

export class KhaltiPayment {
  private _runtimeMode: RuntimeMode = "Development";
  private _apiUrl = "https://a.khalti.com/api/v2";
  private _khaltiSecretKey = "live_secret_key_c29bff9015674b939338370b7ea9f7f2";
  private _websiteUrl = "https://example.com";
  private _redirectUrl = "https://example.com/redirectUrl";

  constructor(params?: KhaltiPaymentConstructor) {
    if (typeof params === "undefined") {
      console.log("Runtime Mode set to Development.");
      console.log(`Setting Development API URL: ${this._apiUrl}`);
      console.log(`Setting Development Key To: ${this._khaltiSecretKey}`);
      console.log(`Website Url: ${this._websiteUrl}`);
      console.log(`Redirect Url: ${this._redirectUrl}`);
      return;
    }
    const {
      runtimeMode = "Development",
      khaltiSecretKey,
      websiteUrl,
      redirectUrl,
    } = params;
    this._runtimeMode = runtimeMode;
    this.setKhaltiSecret(khaltiSecretKey);
    this.setApiUrl();
    this.setRedirectsAndWebsiteUrl(websiteUrl, redirectUrl);
  }

  private setApiUrl() {
    if (this._runtimeMode === "Production") {
      this._apiUrl = "https://khalti.com/api/v2";
    } else if (this._runtimeMode === "Development") {
      console.log(`Setting Development API URL: ${this._apiUrl}`);
    }
  }

  /**
   * Sets the secret key provided by Khalti
   * @param khaltiSecretKey - This is the secret key provided by Khalti
   */
  private setKhaltiSecret(
    khaltiSecretKey: KhaltiPaymentConstructor["khaltiSecretKey"]
  ) {
    if (
      this._runtimeMode === "Production" &&
      typeof khaltiSecretKey === "undefined"
    ) {
      throw new Error("KahltiSecret Key Cannot Be Empty.");
    }
    if (typeof khaltiSecretKey === "string") {
      this._khaltiSecretKey = khaltiSecretKey;
    }
    if (this._runtimeMode === "Development") {
      console.log("Runtime Mode set to Development.");
      console.log(`Setting Development Key To: ${this._khaltiSecretKey}`);
    }
  }

  /**
   * Sets The Redirect Url for the App
   * @param websiteUrl - Website Url where Khalti is being Integrated
   * @param redirectUrl - Redirect Url
   */
  private setRedirectsAndWebsiteUrl(
    websiteUrl: KhaltiPaymentConstructor["websiteUrl"],
    redirectUrl: KhaltiPaymentConstructor["redirectUrl"]
  ) {
    if (
      this._runtimeMode === "Production" &&
      typeof websiteUrl === "undefined"
    ) {
      throw new Error("Website URL Cannot Be Empty.");
    }
    if (
      this._runtimeMode === "Production" &&
      typeof redirectUrl === "undefined"
    ) {
      throw new Error("Redirect Url Cannot Be Empty.");
    }
    if (typeof websiteUrl === "string") {
      this._websiteUrl = websiteUrl;
    }
    if (typeof redirectUrl === "string") {
      this._redirectUrl = redirectUrl;
    }
    if (this._runtimeMode === "Development") {
      console.log(`Website Url: ${this._websiteUrl}`);
      console.log(`Redirect Url: ${this._redirectUrl}`);
    }
  }

  public getPidx(params: GetPidxProps) {
    if (Object.keys(params || {}).length === 0) {
      throw new Error("Cannot Initiate Request without Valid Parameters.");
    }
    if (typeof window !== "undefined") {
      throw new Error(
        "Pidx Can Only Be Generated On Server Side i.e. Node.js due to CORS error set on frontend. Implement This Function in Backend and send Its response to the Frontend to Overcome this Issue."
      );
    }
    const getPidxUrl = this._apiUrl + "/epayment/initiate/";
    const finalPostData: any = {
      website_url: this._websiteUrl || params.websiteUrl,
      return_url: this._redirectUrl || params.redirectUrl,
      ...params,
    };
    let checkForNullParams = [
      "return_url",
      "website_url",
      "amount",
      "purchase_order_id",
      "purchase_order_name",
    ];
    for (let key of checkForNullParams) {
      if (typeof finalPostData[key] === "undefined") {
        throw new Error(`${key} cannot be Empty while Initiating Payment.`);
      }
    }
    return this.makeGetPidxRequest(getPidxUrl, finalPostData);
  }

  private async makeGetPidxRequest(path: string, data: any) {
    try {
      const response = await axios({
        method: "POST",
        url: path,
        headers: {
          Authorization: `Key ${this._khaltiSecretKey}`,
        },
        data,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Verify Payment From Khalti
   * @param {string} pidx - Product ID (pid) used on payment request
   */
  public verifyPayment(pidx: string) {
    const verificationUrl = this._apiUrl + "/epayment/lookup/";
    if (typeof pidx === "undefined") {
      throw new Error("Pidx Cannot While Verifying Payment.");
    }
    return this.makeVerficationRequest(verificationUrl, pidx);
  }

  private async makeVerficationRequest(path: string, pidx: string) {
    try {
      const response = await axios({
        method: "POST",
        url: path,
        headers: {
          Authorization: `Key ${this._khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ pidx }),
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
