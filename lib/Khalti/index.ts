import axios from "axios";
import postForm, { convertObjectDataToString } from "../postForm";

type RuntimeMode = "Development" | "Production";
interface KhaltiPaymentConstructor {
  /** Set this to Development if You want to test the payment System. Set it to Production if you are actually using it in live application. */
  runtimeMode?: RuntimeMode;
  /** This is the secret key provided by khalti.
   *
   * Ommit this field for development/testing usage.
   *
   * Provide Live key for live application usage.
   */
  khaltiSecretKey?: string;
  redirectUrl?: string;
  websiteUrl?: string;
}

interface KhaltiPaymentInitiateProps {
  /** Khalti Redirects to this page after transaction */
  return_url: string;
}

export class KhaltiPayment {
  private _runtimeMode: RuntimeMode;
  private _apiUrl = "https://a.khalti.com/api/v2";
  private _khaltiSecretKey = "live_secret_key_c29bff9015674b939338370b7ea9f7f2";
  private _websiteUrl = "http://localhost:3000";
  private _redirectUrl = "http://localhost:3000/redirectUrl";

  constructor({
    runtimeMode = "Development",
    khaltiSecretKey,
    websiteUrl,
    redirectUrl,
  }: KhaltiPaymentConstructor) {
    this._runtimeMode = runtimeMode;
    this.setApiUrl();
    this.setKhaltiSecret(khaltiSecretKey);
    this.setRedirectsAndWebsiteUrl(websiteUrl, redirectUrl);
  }

  private setApiUrl() {
    if (this._runtimeMode === "Production") {
      this._apiUrl = "https://khalti.com/api/v2";
    } else {
      console.log(
        `No Runtime Environment found.\nSetting Development API URL: ${this._apiUrl}`
      );
    }
  }

  private setKhaltiSecret(
    khaltiSecretKey: KhaltiPaymentConstructor["khaltiSecretKey"]
  ) {
    if (typeof khaltiSecretKey === "string" && khaltiSecretKey.length > 5) {
      this._khaltiSecretKey = khaltiSecretKey;
    } else {
      // throw new Error("MerchantId cannot Be empty.");
      console.log(
        `No Merchant Key found.\nSetting Development Key To: ${this._khaltiSecretKey}`
      );
    }
  }

  private setRedirectsAndWebsiteUrl(
    websiteUrl: KhaltiPaymentConstructor["websiteUrl"],
    redirectUrl: KhaltiPaymentConstructor["redirectUrl"]
  ) {
    if (
      typeof websiteUrl === "string" &&
      websiteUrl.length > 5 &&
      typeof redirectUrl === "string" &&
      redirectUrl.length > 5
    ) {
      this._websiteUrl = websiteUrl;
      this._redirectUrl = redirectUrl;
    }
  }

  // public initiate(params) {
  //   const paymentInitiateUrl = this._apiUrl + "/epayment/initiate";
  //   const finalPostData = {
  //     su: this._successRedirectUrl,
  //     fu: this._failureRedirectUrl,
  //     ...params,
  //   };
  //   postForm(
  //     paymentInitiateUrl,
  //     convertObjectDataToString<typeof finalPostData>(finalPostData)
  //   );
  // }

  // public verifyPayment(params) {
  //   const verificationUrl = this._apiUrl + "/epayment/lookup";
  //   return this.makeVerficationRequest(verificationUrl, params);
  // }

  // private async makeVerficationRequest(path: string, params) {
  //   const finalPostData = {
  //     ...params,
  //   };
  //   let formData: { [key: string]: string } =
  //     convertObjectDataToString<typeof finalPostData>(finalPostData);
  //   const form = new FormData();
  //   for (let key in formData) {
  //     form.append(key, formData[key]);
  //   }
  //   try {
  //     const response = await axios({
  //       method: "POST",
  //       url: path,
  //       data: form,
  //     });
  //     if (response.data.includes("Success")) {
  //       return {
  //         success: true,
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       success: false,
  //     };
  //   }
  // }
}
