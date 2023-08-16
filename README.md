**Package Progress**

> `eSewa` - Can be Used For Production
> 
> `Khalti` - **( Do Not Use In Production )** Implementation Completed. Currently Working on Type Safety and Documentation
> 

**Doc Link** **-** [https://bishamkunwor.notion.site/Payment-Package-Docs-5130308e4c2a4e84af7bc6047c7c04de?pvs=4](https://www.notion.so/Payment-Package-Docs-5130308e4c2a4e84af7bc6047c7c04de?pvs=21)

## Esewa

> Progress
> 
- [x]  Implementation
- [x]  Type Safety
- [x]  Documentation
- [x]  Manual Testing
- [ ]  Setting Automatic Test Runner

### **Documentation**

**Importing Esewa Payment Method**

After the package is installed, import it by using `import` or `require`.

```tsx
import { EsewaPayment } from "@bisham/payment-package";
```

**Initialization With Default Values**

```tsx
// Initializes the payment package with default credentials

// Default Options
// runtimeMode = "Development"
// merchantId = "EPAYTEST"
// successRedirectUrl = "http://localhost:3000/esewaSuccessRedirect"
// failureRedirectUrl = "http://localhost:3000/esewaFailureRedirect"

const esewaPayment = new EsewaPayment({});
```

**You Can Also Manually Override these Settings as:**

```tsx
const esewaPayment = new EsewaPayment({
  merchantId: "ESEWASCD",
});
```

**Initialization With Global Redirect URLs**

```tsx
// If the App have single Redirect Url then set it Here

const esewaPayment = new EsewaPayment({
  successRedirectUrl: "http://bishamkunwor.com.np/payment/success",
  failureRedirectUrl: "http://bishamkunwor.com.np/payment/failure",
});
```

**Config with custom parameters**

```tsx
const eswaPayment = new EsewaPayment({
  runtimeMode: "Development",
  merchantId: "EPAYTEST",
  successRedirectUrl: "http://merchant.com.np/page/esewa_payment_success?q=su",
  failureRedirectUrl: "http://merchant.com.np/page/esewa_payment_failed?q=fu",
}); 
```

eSewa Will redirect user to the `successRedirectUrl` if the payment was successful. Else it will redirect to `failureRedirectUrl`.

**For making Payment Request:**

```tsx
eswaPayment.initiate({
  amt: 100,
  pdc: 0,
  psc: 0,
  txAmt: 0,
  tAmt: 100,
  pid: "ee2c3ca1-696b-4cc5-a6be",
});
```

> **Esewa Credentials (Development Only)**
> 
> 
> `eSewa ID` : 9806800001, 9806800002, 9806800003, 9806800004, 9806800005
> 
> `Password` : Nepal@123
> 
> `Transaction Token`: 123456
> 

**Verifying Payment**

```tsx
async function validatePayment() {
  const response = await esewaPayment.verifyPayment({
    amt: 200,
    pid: "pid-provided-by-esewa",
    rid: "rid-provided-by-esewa",
  });
  // Implement Your Logic Here
  console.log(response?.success);
}

validatePayment();
```

## Khalti

> Progress
> 
- [x]  Implementation
- [ ]  Type Safety
- [ ]  Documentation
- [ ]  Manual Testing
- [ ]  Setting Automatic Test Runner