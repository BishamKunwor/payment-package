##### Package Progress

> Currently I'm Working on Khlati Integration. The Documentation of all of these packages will be done after the implementation are completed.

## Installing

A straightforward preconfigured package for seamlessly integrating all well-known Nepalese payment provider into any application.

> **Note :**
> The Package is Type Safe and includes Type Definations.

### Package manager

Using npm:

```
npm install @bisham/payment-package
```

Using yarn:

```
yarn add @bisham/payment-package
```

Using pnpm:

```
pnpm add @bisham/payment-package
```

## Example

### Esewa

#### Importing Esewa Payment Method

After the package is installed, import it by using `import` or `require`.

```js
import { EsewaPayment } from "@bisham/payment-package";
```

##### Initialize the package as:

```js
const eswaPayment = new EsewaPayment({
  runtimeMode: "Development",
  merchantId: "EPAYTEST",
  successRedirectUrl: "http://merchant.com.np/page/esewa_payment_success?q=su",
  failureRedirectUrl: "http://merchant.com.np/page/esewa_payment_failed?q=fu",
});
```

Esewa Will redirect user to the `successRedirectUrl` if the payment was successful. Else it will redirect to `failureRedirectUrl`.

##### For making Payment Request:

```js
eswaPayment.initiate({
  amt: 100,
  pdc: 0,
  psc: 0,
  txAmt: 0,
  tAmt: 100,
  pid: "ee2c3ca1-696b-4cc5-a6be",
});
```

> ##### Esewa Credentials (Development Only)
>
> `eSewa ID` : 9806800001, 9806800002, 9806800003, 9806800004, 9806800005
> `Password` : Nepal@123
> `Transaction Token`: 123456

#### Payment Verification

```js
async function validatePayment() {
  const response = await eswaPayment.verifyPayment({
    amt: 100.0,
    rid: "0005XMJ",
    pid: "ee2c3ca1-696b-4cc5-a6be",
  });
  console.log(response); //wil return {success: boolean}
}

validatePayment();
```

### Khalti

> #### Work on Progress

### ConnectIPS

> #### Starting Soon
