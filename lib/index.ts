import { EsewaPayment } from "./Esewa";
import { KhaltiPayment } from "./Khalti";

const khaltiPayment = new KhaltiPayment({});

khaltiPayment.getPidx({
  amount: 200,
  purchase_order_id: "",
  purchase_order_name: "",
});
// (async () => {
//   console.log(await khaltiPayment.verifyPayment("3owTGDFzmWrRPEsF3wFF7B"));
// })();

export { EsewaPayment };
