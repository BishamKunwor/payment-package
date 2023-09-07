type RuntimeMode = 'Development' | 'Production';

interface WebsiteUrls {
  /**
   * @param redirectUrl - Khalti Redirects to this Url After Payment
   */
  redirectUrl?: string;

  /**
   * @param websiteUrl - Website Url used By Khalti For Keeping Payment Initiation Record
   */
  websiteUrl?: string;
}

interface KhaltiDevelopmentConstructor {
  /**
   * @param {RuntimeMode} runtimeMode - `Development` or `Production` Mode to Perform Transaction
   * @default Development
   */
  runtimeMode?: 'Development';
  /**
   * @param khaltiSecretKey - Secret key provided by khalti.
   */
  khaltiSecretKey?: string;
}

interface KhaltiProductionConstructor {
  /**
   * @param {RuntimeMode} runtimeMode - `Development` or `Production` Mode to Perform Transaction
   * @default Development
   */
  runtimeMode?: 'Production';
  /**
   * @param khaltiSecretKey - Secret key provided by khalti.
   */
  khaltiSecretKey: string;
}

interface KhaltiUniqueConstructorConfigs extends WebsiteUrls {
  /**
   * @param logConfig - Boolean to Show Logs or Not
   */
  logConfig?: boolean;
}
type KhaltiPaymentConstructor = KhaltiUniqueConstructorConfigs &
  (KhaltiDevelopmentConstructor | KhaltiProductionConstructor);

interface GetPidxProps extends WebsiteUrls {
  /**
   * @param amount - Total payable amount `Rs. in Paisa` excluding the service charge.
   */
  amount: number;
  /**
   * @param purchase_order_id - Unique identifier for the transaction generated by merchant
   */
  purchase_order_id: string;
  /**
   * @param purchase_order_name - This is the name of the product.
   */
  purchase_order_name: string;
  /**
   * @param customer_info - This field represents to whom the txn is going to be billed to.
   * @example
   * ```ts
   *  "customer_info": {
      "name": "Ashim Upadhaya",
      "email": "example@gmail.com",
      "phone": "9811496763"
     },
  ```
   */
  customer_info?: any;
  /**
   * @param amount_breakdown - Any number of labels and amounts can be passed.
   * @example
   * ```ts
   *  "amount_breakdown": [
      {
          "label": "Mark Price",
          "amount": 1000
      },
      {
          "label": "VAT",
          "amount": 300
      }
    ],
  ```
   */
  amount_breakdown?: any[];
  /**
   * @param product_details - No of set is unlimited
   * @example
   * ```ts
   *  "product_details": [
      {
          "identity": "1234567890",
          "name": "Khalti logo",
          "total_price": 1300,
          "quantity": 1,
          "unit_price": 1300
      }
  ]
  ```
   */
  product_details?: any[];
}
