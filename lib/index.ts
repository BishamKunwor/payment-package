import { EsewaPayment } from "./Esewa";

const eswaPayment = new EsewaPayment({
  runtimeMode: "Development",
  merchantId: "EPAYTEST",
  successRedirectUrl: "http://merchant.com.np/page/esewa_payment_success?q=su",
  failureRedirectUrl: "http://merchant.com.np/page/esewa_payment_failed?q=fu",
});

// eswaPayment.initiate({
//   amt: 100,
//   pdc: 0,
//   psc: 0,
//   txAmt: 0,
//   tAmt: 100,
//   pid: "ee2c3ca1-696b-4cc5-a6be-2c40d929d453",
// });

async function validatePayment() {
  const response = await eswaPayment.verifyPayment({
    amt: 100.0,
    rid: "0005XMJ",
    pid: "ee2c3ca1-696b-4cc5-a6be",
  });
  console.log(response);
}

validatePayment();
export { EsewaPayment };
