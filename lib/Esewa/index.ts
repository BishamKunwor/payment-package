import axios from "axios";
import postForm from "../postForm";

type RuntimeMode = "Development" | "Production";
interface EsewaPaymentConstructor {
  runtimeMode?: RuntimeMode;
  merchantId?: string;
  successRedirectUrl?: string;
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
    postForm(paymentInitiateUrl, {
      su: this._successRedirectUrl,
      fu: this._failureRedirectUrl,
      scd: this._scd,
      ...params,
    });
  }

  public verifyPayment(params: PaymentVerificationRequest) {
    const verificationUrl = this._apiUrl + "/epay/transrec";
    return this.makeVerficationRequest(verificationUrl, params);
  }

  private async makeVerficationRequest(
    path: string,
    params: PaymentVerificationRequest
  ) {
    const formData: any = { scd: this._scd, ...params };
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
