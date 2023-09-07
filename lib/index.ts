import { EsewaPayment } from './Esewa';
import { KhaltiPayment } from './Khalti';

const khaltiPayment = new KhaltiPayment({});

// (async () => {
//   console.log(
//     await khaltiPayment.getPidx({
//       amount: 20000,
//       purchase_order_id: 'fadsfadfdsa',
//       purchase_order_name: 'asdfasdfasdf',
//     }),
//   );
//   //   console.log(await khaltiPayment.verifyPayment("3owTGDFzmWrRPEsF3wFF7B"));
// })();

export { EsewaPayment, KhaltiPayment };
