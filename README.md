# Payment Package Docs

**Package Progress**

> I’m Happy to announce that I’ve completed `eSewa` Implementation and can be used for `production`. Furthermore, I’ll be working on Khalti Implementation.
> 

## Esewa

> Progress
> 
- [x]  Implementation
- [x]  Type Safety
- [x]  Documentation
- [x]  Manual Testing
- [ ]  Setting Automatic Test Runner

### **Documentation**

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