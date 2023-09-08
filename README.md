# Payment Package Docs

**Note: From V1.0.0, this Package can only be Used with `node version` ≥ `18.x.x`**

[View Documentation](https://www.notion.so/Payment-Package-Docs-5130308e4c2a4e84af7bc6047c7c04de?pvs=21)

## Esewa

### **Documentation**

**Importing Esewa Payment Method**

Import by using `import` or `require`.

```tsx
import { EsewaPayment } from '@bisham/payment-package';
```

**Initialization With Default Values**

```tsx
// Initializes Esewa with default credentials

// Default Options

// runtimeMode = "Development"
// merchantId = "EPAYTEST"
// successRedirectUrl = "https://example.com/esewaSuccessRedirect"
// failureRedirectUrl = "https://example.com/esewaFailureRedirect"
// logConfig = false

const esewaPayment = new EsewaPayment();
```

**Make Payment With Initial Config**

```
// Payment Initiation Can Only Be Done in Browser Environment
esewaPayment.initiate({
      amount: 10, // Amount in Rs
			// Add A unique process-id
      processId: 'Unique-id-for-each-transaction',
      totalAmount: 10
    })
```

> **Esewa Credentials (Development Mode Only)**
>
> `eSewa ID` : 9806800001, 9806800002, 9806800003, 9806800004, 9806800005
>
> `Password` : Nepal@123
>
> `Transaction Token`: 123456

**Verifying Payment**

```tsx
// Validation Only Works on Server Side due To CORS
async function validatePayment() {
  const response = await esewaPayment.verifyPayment({
    amount: 10,
    // processId is oid recieved from eSewa
    processId: 'Unique-id-for-each-transaction',
    referenceId: '00063JQ',
  });
  // Implement Your Logic Here
  console.log(response?.success);
}

validatePayment();
```

### **Full Configuration Override Guide**

**You Can Also Manually Override these Settings as:**

```tsx
// Only merchantId changes and all Other Options are set to Default

// Default Options

// runtimeMode = "Development"
// successRedirectUrl = "https://example.com/esewaSuccessRedirect"
// failureRedirectUrl = "https://example.com/esewaFailureRedirect"
// logConfig = false

// merchantId = "ESEWASCD"

const esewaPayment = new EsewaPayment({
  merchantId: 'ESEWASCD',
});
```

**Initialization With Global Redirect URLs**

```tsx
// If the App have single Redirect Url then set it Here

const esewaPayment = new EsewaPayment({
  successRedirectUrl: 'http://bishamkunwor.com.np/payment/success',
  failureRedirectUrl: 'http://bishamkunwor.com.np/payment/failure',
});
```

**Config with custom parameters**

```tsx
const eswaPayment = new EsewaPayment({
  runtimeMode: 'Production',
  merchantId: 'MERCHANTSCD',
  successRedirectUrl: 'http://merchant.com.np/page/esewa_payment_success?q=su',
  failureRedirectUrl: 'http://merchant.com.np/page/esewa_payment_failed?q=fu',
  logConfig: true,
});
```

Khalti Will redirect user to the `successRedirectUrl` if the payment was successful. Else it will redirect to `failureRedirectUrl`.

### **For making Payment Request:**

```tsx
// Payment Initiation Can Only Be Done in Browser Environment
esewaPayment.initiate({
  amount: 40, // Amount in Rs
  // Add A unique process-id
  processId: 'Unique-id-for-each-transaction',
  deliveryCharge: 20,
  serviceCharge: 20,
  taxAmount: 20,
  // totalAmount = amount + deliveryCharge+ serviceCharge+ taxAmount
  totalAmount: 100,
  // Set Dynamic Url for each payment request, If your success and failure
  // redirect url is static then set it in the global config and ommit this
  // this field
  successRedirectUrl:
    'http://some-dynamic-url-that-changes-on-every-transaction.com',
  failureRedirectUrl:
    'http://some-dynamic-url-that-changes-on-every-transaction.com',
});
```

**Verifying Payment**

```tsx
// Validation Only Works on Server Side due To CORS
async function validatePayment() {
  const response = await esewaPayment.verifyPayment({
    amount: 200,
    processId: 'pid-provided-by-esewa',
    referenceId: 'rid-provided-by-esewa',
  });
  // Implement Your Logic Here
  console.log(response?.success);
}

validatePayment();
```

## Khalti

### **Documentation**

**Importing Khalti Payment Method**

Import by using `import` or `require`.

```tsx
import { KhaltiPayment } from '@bisham/payment-package';
```

**Initialization With Default Values**

```tsx
// Initializes Khalti with default credentials

// Default Options

// runtimeMode = "Development"
// khaltiSecretKey = "live_secret_key_c29bff9015674b939338370b7ea9f7f2"
// websiteUrl = "https://example.com"
// redirectUrl = "https://example.com/redirectUrl"
// logConfig = false

const khaltiPayment = new KhaltiPayment();
```

**Make Payment With Initial Config**

```
// Payment Initiation Can Only Be Done in Node Environment due to `CORS error`
// Send the response recieved on calling this method on Server Side to the Cilent
// Application

async function getKhaltiPaymentUrl () {
  const response = await khaltiPayment.getPidx({
    amount: 1000,
    purchase_order_id: 'unique-process-id',
    purchase_order_name: 'your-product-name'
  })

  // Your Logic Here

  console.log(response)
}

getKhaltiPaymentUrl()

// Response Example
// {
//  pidx: '7dQBsUCxfEtNcsrWMQbxrJ',
//  payment_url: 'https://test-pay.khalti.com/?pidx=7dQBsUCxfEtNcsrWMQbxrJ',
//  expires_at: '2023-09-08T21:14:57.545837+05:45',
//  expires_in: 1800
// }

// Redirect The User to the payment_url to initiate khalti Payment
```

> **Khalti Credentials (Development Mode Only)**
>
> `Khalti ID` : 9800000000, 9800000001, 9800000002, 9800000003, 9800000004, 9800000005
>
> `MPIN` : 1111
>
> `Transaction OTP`: 987654

**Verifying Payment**

```tsx
// Validation Only Works on Server Side due To CORS
async function validatePayment() {
  // Enter PIDX recieved From Khalti
  const response = await khaltiPayment.verifyPayment('7dQBsUCxfEtNcsrWMQbxrJ');
  // Implement Your Logic Here
  console.log(response);
}

validatePayment();

// Response Example
// {
//  pidx: '7dQBsUCxfEtNcsrWMQbxrJ',
//  total_amount: 1000,
//  status: 'Completed',
//  transaction_id: 'CsovwPVkSXzvevQdEwSytE',
//  fee: 30,
// refunded: false
// }
```

### **Full Configuration Override Guide**

**You Can Also Manually Override these Settings as:**

```tsx
// Only khaltiSecretKey changes and all Other Options are set to Default

// Default Options

// runtimeMode = "Development"
// khaltiSecretKey = "live-secret-key-provided-by-khalti"
// websiteUrl = "https://example.com"
// redirectUrl = "https://example.com/redirectUrl"
// logConfig = false

const khaltiPayment = new KhaltiPayment({
  khaltiSecretKey: 'live-secret-key-provided-by-khalti',
});
```

**Initialization With Global Redirect URL**

```tsx
// If the App have single Redirect Url then set it Here

const khaltiPayment = new KhaltiPayment({
  websiteUrl: 'http://bishamkunwor.com.np',
  redirectUrl: 'http://bishamkunwor.com.np/payment/validate',
});
```

**Config with custom parameters**

```tsx
const khaltiPayment = new KhaltiPayment({
  runtimeMode: 'Production',
  khaltiSecretKey: 'live-secret-key-provided-by-khalti',
  websiteUrl: 'https://bishamkunwor.com.np',
  redirectUrl: 'https://bishamkunwor.com.np/payment/validate',
  logConfig: true,
});
```

Khalti Will redirect user to the `redirectUrl` if the payment was successful.

### **For making Payment Request:**

```tsx
// Only amount, purchase_order_id, purchase_order_name are Required
// and all other fields are optional

async function getKhaltiPaymentUrl() {
  const response = await khaltiPayment.getPidx({
    amount: 1000, // Amount in Paisa
    purchase_order_id: 'unique-process-id',
    purchase_order_name: 'your-product-name',
    redirectUrl: 'dynamic-webiste-url-for-every-payment',
    websiteUrl: 'website-url-best-to-set-it-in-global-config',
    amount_breakdown: [
      {
        label: 'Mark Price',
        amount: 1000,
      },
      {
        label: 'VAT',
        amount: 300,
      },
    ],
    customer_info: {
      name: 'Bisham Kunwor',
      email: 'novelian.nova@gmail.com',
      phone: '9800000000',
    },
    product_details: [
      {
        identity: '1234567890',
        name: 'React Course',
        total_price: 1300,
        quantity: 1,
        unit_price: 1300,
      },
    ],
  });

  // Your Logic Here

  console.log(response);
}

// Response Example
// {
//  pidx: '7dQBsUCxfEtNcsrWMQbxrJ',
//  payment_url: 'https://test-pay.khalti.com/?pidx=7dQBsUCxfEtNcsrWMQbxrJ',
//  expires_at: '2023-09-08T21:14:57.545837+05:45',
//  expires_in: 1800
// }

// Redirect The User to the payment_url to initiate khalti Payment
```

**Verifying Payment**

```tsx
// Validation Only Works on Server Side due To CORS
async function validateKhaltiPayment() {
  // Enter PIDX recieved From Khalti
  const response = await khaltiPayment.verifyPayment('7dQBsUCxfEtNcsrWMQbxrJ');
  // Implement Your Logic Here
  console.log(response);
}

validateKhaltiPayment();

// Response Example
// {
//  pidx: '7dQBsUCxfEtNcsrWMQbxrJ',
//  total_amount: 1000,
//  status: 'Completed',
//  transaction_id: 'CsovwPVkSXzvevQdEwSytE',
//  fee: 30,
// refunded: false
// }
```
