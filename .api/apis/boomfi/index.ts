import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'boomfi/1.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * The **Get Organization** endpoint allows you to retrieve your organization's current
   * settings and details. This includes key information such as the organization's `name`,
   * `logo_url`, and `webhook_url`. Use this endpoint to verify that your organization's
   * configuration in BoomFi is accurate and up to date.
   *
   * @summary Get Organization
   * @throws FetchError<400, types.GetOrganizationResponse400> Bad Request
   * @throws FetchError<401, types.GetOrganizationResponse401> Unauthorized
   * @throws FetchError<500, types.GetOrganizationResponse500> Internal Server Error
   */
  getOrganization(): Promise<FetchResponse<200, types.GetOrganizationResponse200>> {
    return this.core.fetch('/v1/orgs', 'get');
  }

  /**
   * The **Update Organization** endpoint allows you to modify your organization's details,
   * such as the `name`, `logo_url`, and `webhook_url`. This endpoint is useful for keeping
   * your organization's information current and ensuring that your settings align with any
   * changes in your operations or branding.
   *
   * @summary Update Organization
   * @throws FetchError<400, types.UpdateOrganizationResponse400> Bad Request
   * @throws FetchError<401, types.UpdateOrganizationResponse401> Unauthorized
   * @throws FetchError<500, types.UpdateOrganizationResponse500> Internal Server Error
   */
  updateOrganization(body: types.UpdateOrganizationBodyParam): Promise<FetchResponse<200, types.UpdateOrganizationResponse200>> {
    return this.core.fetch('/v1/orgs', 'put', body);
  }

  /**
   * The **List Accounts** endpoint allows you to retrieve the configured settlement accounts
   * for each supported blockchain network within the BoomFi platform. This endpoint provides
   * information regarding the accounts established for receiving payments across various
   * networks, along with the associated currencies enabled for each network.
   *
   * @summary List Accounts
   * @throws FetchError<400, types.ListAccountsResponse400> Bad Request
   * @throws FetchError<500, types.ListAccountsResponse500> Internal Server Error
   */
  listAccounts(): Promise<FetchResponse<200, types.ListAccountsResponse200>> {
    return this.core.fetch('/v1/accounts', 'get');
  }

  /**
   * The **List Paylinks** endpoint allows you to retrieve a comprehensive list of all pay
   * links created within your organization on the BoomFi platform. Use this endpoint to
   * efficiently manage and review all the payment links you have generated, ensuring they
   * align with your business needs.
   *
   * > 📘 Note
   * > 
   * > Paylinks are created automatically when a plan is created. Each plan has a
   * corresponding paylink that can be used to facilitate payments.
   *
   * @summary List Paylinks
   * @throws FetchError<400, types.ListPaylinksResponse400> Bad Request
   * @throws FetchError<500, types.ListPaylinksResponse500> Internal Server Error
   */
  listPaylinks(metadata?: types.ListPaylinksMetadataParam): Promise<FetchResponse<200, types.ListPaylinksResponse200>> {
    return this.core.fetch('/v1/paylinks', 'get', metadata);
  }

  /**
   * The **Create Payment Link** endpoint enables you to generate a new payment link for a
   * specific product or service within the BoomFi platform. This link can be customized with
   * various parameters, such as the amount, currency, and description, facilitating payments
   * for a wide range of offerings. Use this endpoint to quickly create payment links you can
   * share with customers to collect payments seamlessly.
   *
   * > 📘 Note
   * > 
   * > When creating a payment link, you can implicitly create a plan by providing details
   * such as `amount` and `currency`.
   *
   * > 🚧  Account-specific Paylinks 
   * >
   * > Create an account-specific paylink by adding either `account_ref` or `account_ids`.
   * Its important to note that you cannot add both.
   *
   * @summary Create Payment Link
   * @throws FetchError<400, types.CreatePaymentLinkResponse400> Bad Request
   * @throws FetchError<500, types.CreatePaymentLinkResponse500> Internal Server Error
   */
  createPaymentLink(body: types.CreatePaymentLinkBodyParam): Promise<FetchResponse<200, types.CreatePaymentLinkResponse200>> {
    return this.core.fetch('/v1/paylinks', 'post', body);
  }

  /**
   * Update the status of a specific paylink by setting the `enabled` field to `true` or
   * `false`.
   *
   * @summary Enable or Disable a Paylink
   */
  enableDisablePaylink(body: types.EnableDisablePaylinkBodyParam, metadata: types.EnableDisablePaylinkMetadataParam): Promise<FetchResponse<200, types.EnableDisablePaylinkResponse200>> {
    return this.core.fetch('/v1/paylinks/{paylinkId}', 'patch', body, metadata);
  }

  /**
   * The **Create Variant Pay Link URL** endpoint enables you to create a customized version
   * of an existing payment link, allowing you to modify key elements such as the amount and
   * currency. This functionality is ideal for scenarios where you need to offer personalized
   * payment options, such as discounts, special pricing, or promotions, while maintaining
   * the original plan’s integrity.
   *
   * > 📘 Note
   * > 
   * > You can use this endpoint to offer discounts or custom pricing by creating a variant
   * of an existing paylink.
   *
   * @summary Create Variant Pay Link URL
   * @throws FetchError<400, types.CreateVariantPaylinkUrlResponse400> Bad Request
   * @throws FetchError<403, types.CreateVariantPaylinkUrlResponse403> Forbidden
   * @throws FetchError<404, types.CreateVariantPaylinkUrlResponse404> Not Found
   * @throws FetchError<500, types.CreateVariantPaylinkUrlResponse500> Internal Server Error
   */
  createVariantPaylinkUrl(metadata: types.CreateVariantPaylinkUrlMetadataParam): Promise<FetchResponse<200, types.CreateVariantPaylinkUrlResponse200>> {
    return this.core.fetch('/v1/paylinks/generate-variant/{paylinkId}', 'get', metadata);
  }

  /**
   * The **List Payments** endpoint allows you to retrieve a list of all payment transactions
   * associated with your organization. It is a valuable tool for tracking and reviewing your
   * organization’s payment history, ensuring that you have an overview of all financial
   * activities within the BoomFi platform.
   *
   * > 📘 Note
   * > 
   * > Use pagination parameters to efficiently navigate through a large volume of payments.
   *
   * @summary List Payments
   * @throws FetchError<400, types.ListPaymentsResponse400> Bad Request
   * @throws FetchError<500, types.ListPaymentsResponse500> Internal Server Error
   */
  listPayments(metadata?: types.ListPaymentsMetadataParam): Promise<FetchResponse<200, types.ListPaymentsResponse200>> {
    return this.core.fetch('/v1/payments', 'get', metadata);
  }

  /**
   * The **Get Payment by ID** endpoint allows you to retrieve information about a specific
   * payment transaction using its unique identifier. This endpoint provides comprehensive
   * data on the payment, including its status, method, amount, and currency.
   *
   * @summary Get Payment by ID
   * @throws FetchError<400, types.GetPaymentByIdResponse400> Bad Request
   * @throws FetchError<404, types.GetPaymentByIdResponse404> Not Found
   * @throws FetchError<500, types.GetPaymentByIdResponse500> Internal Server Error
   */
  getPaymentById(metadata: types.GetPaymentByIdMetadataParam): Promise<FetchResponse<200, types.GetPaymentByIdResponse200>> {
    return this.core.fetch('/v1/payments/{paymentId}', 'get', metadata);
  }

  /**
   * The **List Plans** endpoint allows you to retrieve a list of all subscription plans
   * available within your organization. This includes details such as the plan's `name`,
   * `currency`, and `billing_scheme`, among others. Use this endpoint to review and manage
   * the subscription options your organization offers.
   *
   * > 📘 Note
   * > 
   * > A plan is synonymous with a product in BoomFi. You can have multiple plans for
   * different currencies or pricing structures for the same product.
   *
   * @summary List Plans
   * @throws FetchError<400, types.ListPlansResponse400> Bad Request
   * @throws FetchError<500, types.ListPlansResponse500> Internal Server Error
   */
  listPlans(metadata?: types.ListPlansMetadataParam): Promise<FetchResponse<200, types.ListPlansResponse200>> {
    return this.core.fetch('/v1/plan', 'get', metadata);
  }

  /**
   * The **Create Plan** endpoint allows you to create a new subscription plan. It requires a
   * payload containing the plan's details. Use this endpoint to create flexible and tailored
   * subscription options that align with your business needs.
   *
   * > 📘 Note
   * > 
   * > When creating a plan, you automatically create a paylink associated with it. This
   * allows you to offer the plan for immediate purchase.
   *
   * @summary Create Plan
   * @throws FetchError<400, types.CreatePlanResponse400> Bad Request
   * @throws FetchError<500, types.CreatePlanResponse500> Internal Server Error
   */
  createPlan(body: types.CreatePlanBodyParam): Promise<FetchResponse<200, types.CreatePlanResponse200>> {
    return this.core.fetch('/v1/plan', 'post', body);
  }

  /**
   * The **Get Plan by ID** endpoint lets you retrieve detailed information about a specific
   * subscription plan using its unique identifier. Use this endpoint to manage and review
   * individual plans effectively.
   *
   * @summary Get Plan by ID
   * @throws FetchError<400, types.GetPlanByIdResponse400> Bad Request
   * @throws FetchError<500, types.GetPlanByIdResponse500> Internal Server Error
   */
  getPlanById(metadata: types.GetPlanByIdMetadataParam): Promise<FetchResponse<200, types.GetPlanByIdResponse200>> {
    return this.core.fetch('/v1/plan/{planId}', 'get', metadata);
  }

  /**
   * The **List Subscriptions** endpoint allows you to retrieve a list of all active
   * subscriptions within your organization. Use this endpoint to track and manage your
   * organization's ongoing subscriptions with its customers.
   *
   * > 📘 Note
   * > 
   * > A subscription is created automatically when a customer makes a payment on a recurring
   * plan. Use this endpoint to track all active subscriptions.
   *
   * @summary List Subscriptions
   * @throws FetchError<400, types.ListSubscriptionsResponse400> Bad Request
   * @throws FetchError<500, types.ListSubscriptionsResponse500> Internal Server Error
   */
  listSubscriptions(metadata?: types.ListSubscriptionsMetadataParam): Promise<FetchResponse<200, types.ListSubscriptionsResponse200>> {
    return this.core.fetch('/v1/subscriptions', 'get', metadata);
  }

  /**
   * The **Cancel Subscription** endpoint allows you to cancel an active subscription within
   * your organization. Use this endpoint to manage and control the lifecycle of your
   * subscriptions effectively.
   *
   * @summary Cancel Subscription
   * @throws FetchError<400, types.CancelSubscriptionResponse400> Bad Request
   * @throws FetchError<404, types.CancelSubscriptionResponse404> Not Found
   * @throws FetchError<500, types.CancelSubscriptionResponse500> Internal Server Error
   */
  cancelSubscription(metadata: types.CancelSubscriptionMetadataParam): Promise<FetchResponse<200, types.CancelSubscriptionResponse200>> {
    return this.core.fetch('/v1/subscriptions/{subscriptionID}', 'delete', metadata);
  }

  /**
   * The **List Customers** endpoint allows you to retrieve a paginated list of customers
   * associated with your organization. This endpoint provides optional parameters for
   * sorting and filtering the results, enabling you to manage and review customer data
   * efficiently.
   *
   * @summary List Customers
   */
  listCustomers(metadata?: types.ListCustomersMetadataParam): Promise<FetchResponse<200, types.ListCustomersResponse200>> {
    return this.core.fetch('/v1/customers', 'get', metadata);
  }

  /**
   * The **Create a Customer** endpoint allows you to create a new customer record within
   * your organization. This endpoint requires a payload that includes key details about the
   * customer, such as their email and wallet address.
   *
   * > 📘 Note
   * > 
   * > If a customer makes a payment without being pre-registered, the system automatically
   * creates a customer record during the checkout process.
   *
   * @summary Create a Customer
   * @throws FetchError<400, types.CreateCustomerResponse400> Bad Request
   * @throws FetchError<500, types.CreateCustomerResponse500> Internal Server Error
   */
  createCustomer(body: types.CreateCustomerBodyParam): Promise<FetchResponse<200, types.CreateCustomerResponse200>> {
    return this.core.fetch('/v1/customers', 'post', body);
  }

  /**
   * The **Get Customer by ID** endpoint allows you to retrieve detailed information about a
   * specific customer using their unique identifier. Use this endpoint to access and manage
   * individual customer records within your organization.
   *
   * @summary Get Customer by ID
   * @throws FetchError<400, types.GetCustomerByIdResponse400> Bad Request
   * @throws FetchError<500, types.GetCustomerByIdResponse500> Internal Server Error
   */
  getCustomerById(metadata: types.GetCustomerByIdMetadataParam): Promise<FetchResponse<200, types.GetCustomerByIdResponse200>> {
    return this.core.fetch('/v1/customers/{customerID}', 'get', metadata);
  }

  /**
   * The **Delete Customer** endpoint allows you to remove a specific customer record from
   * your organization. Use this endpoint with caution to manage your customer database
   * effectively.
   *
   * @summary Delete Customer
   * @throws FetchError<400, types.DeleteCustomerResponse400> Bad Request
   * @throws FetchError<500, types.DeleteCustomerResponse500> Internal Server Error
   */
  deleteCustomer(metadata: types.DeleteCustomerMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/v1/customers/{customerID}', 'delete', metadata);
  }

  /**
   * The **Get All Integrations** endpoint allows you to retrieve a list of all integrations
   * available within your organization.  Use this endpoint to review and manage the
   * integrations that connect BoomFi with other platforms.
   *
   * @summary Get All Integrations
   * @throws FetchError<400, types.GetIntegrationsResponse400> Bad Request
   * @throws FetchError<500, types.GetIntegrationsResponse500> Internal Server Error
   */
  getIntegrations(): Promise<FetchResponse<200, types.GetIntegrationsResponse200>> {
    return this.core.fetch('/v1/integrations', 'get');
  }

  /**
   * The **Get All Integration Templates** endpoint allows you to retrieve a list of all
   * available integration templates within your organization. These templates provide
   * pre-configured setups for common integrations, making it easier to quickly implement and
   * manage connections between BoomFi and other services.
   *
   * @summary Get All Integration Templates
   * @throws FetchError<400, types.GetIntegrationTemplatesResponse400> Bad Request
   * @throws FetchError<500, types.GetIntegrationTemplatesResponse500> Internal Server Error
   */
  getIntegrationTemplates(): Promise<FetchResponse<200, types.GetIntegrationTemplatesResponse200>> {
    return this.core.fetch('/v1/integrations/_templates', 'get');
  }

  /**
   * The **Enable Integration** endpoint allows you to activate a specific integration within
   * your organization identified by its unique `name`. Enabling an integration allows BoomFi
   * to interact with the selected service, making its features available for use within your
   * platform.
   *
   * @summary Enable Integration
   * @throws FetchError<400, types.EnableIntegrationResponse400> Bad Request
   * @throws FetchError<500, types.EnableIntegrationResponse500> Internal Server Error
   */
  enableIntegration(metadata: types.EnableIntegrationMetadataParam): Promise<FetchResponse<200, types.EnableIntegrationResponse200>> {
    return this.core.fetch('/v1/integrations/{name}', 'post', metadata);
  }

  /**
   * The **Disable an Integration** endpoint allows you to deactivate a specific integration
   * within your organization identified by its unique `name`. Disabling an integration stops
   * its operation while retaining its configuration, allowing you to re-enable it later if
   * needed.
   *
   * @summary Disable an Integration
   * @throws FetchError<400, types.DisableIntegrationResponse400> Bad Request
   * @throws FetchError<500, types.DisableIntegrationResponse500> Internal Server Error
   */
  disableIntegration(metadata: types.DisableIntegrationMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/v1/integrations/{name}', 'delete', metadata);
  }

  /**
   * The **Create Webhook** endpoint allows you to set up a new webhook for your
   * organization. Webhooks are used to receive real-time notifications from BoomFi about
   * specific events, such as payment transactions or subscription updates. This endpoint
   * requires a payload containing the webhook's configuration details.
   *
   * @summary Create Webhook
   * @throws FetchError<400, types.CreateWebhookResponse400> Bad Request
   * @throws FetchError<500, types.CreateWebhookResponse500> Internal Server Error
   */
  createWebhook(metadata: types.CreateWebhookMetadataParam): Promise<FetchResponse<200, types.CreateWebhookResponse200>> {
    return this.core.fetch('/v1/integrations/{name}/{orgID}', 'post', metadata);
  }

  /**
   * The **List Events for an Organization** endpoint allows you to retrieve a list of events
   * associated with your organization. These events correspond to the same data received via
   * webhooks, providing you with access to historical event records. This is useful for
   * auditing purposes or in case of connection loss, ensuring you can always review actions
   * such as subscription management, payment transactions, and plan creation.
   *
   * @summary List Events for an Organization
   */
  listEventsForOrganization(metadata?: types.ListEventsForOrganizationMetadataParam): Promise<FetchResponse<200, types.ListEventsForOrganizationResponse200>> {
    return this.core.fetch('/v1/events', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { CancelSubscriptionMetadataParam, CancelSubscriptionResponse200, CancelSubscriptionResponse400, CancelSubscriptionResponse404, CancelSubscriptionResponse500, CreateCustomerBodyParam, CreateCustomerResponse200, CreateCustomerResponse400, CreateCustomerResponse500, CreatePaymentLinkBodyParam, CreatePaymentLinkResponse200, CreatePaymentLinkResponse400, CreatePaymentLinkResponse500, CreatePlanBodyParam, CreatePlanResponse200, CreatePlanResponse400, CreatePlanResponse500, CreateVariantPaylinkUrlMetadataParam, CreateVariantPaylinkUrlResponse200, CreateVariantPaylinkUrlResponse400, CreateVariantPaylinkUrlResponse403, CreateVariantPaylinkUrlResponse404, CreateVariantPaylinkUrlResponse500, CreateWebhookMetadataParam, CreateWebhookResponse200, CreateWebhookResponse400, CreateWebhookResponse500, DeleteCustomerMetadataParam, DeleteCustomerResponse400, DeleteCustomerResponse500, DisableIntegrationMetadataParam, DisableIntegrationResponse400, DisableIntegrationResponse500, EnableDisablePaylinkBodyParam, EnableDisablePaylinkMetadataParam, EnableDisablePaylinkResponse200, EnableIntegrationMetadataParam, EnableIntegrationResponse200, EnableIntegrationResponse400, EnableIntegrationResponse500, GetCustomerByIdMetadataParam, GetCustomerByIdResponse200, GetCustomerByIdResponse400, GetCustomerByIdResponse500, GetIntegrationTemplatesResponse200, GetIntegrationTemplatesResponse400, GetIntegrationTemplatesResponse500, GetIntegrationsResponse200, GetIntegrationsResponse400, GetIntegrationsResponse500, GetOrganizationResponse200, GetOrganizationResponse400, GetOrganizationResponse401, GetOrganizationResponse500, GetPaymentByIdMetadataParam, GetPaymentByIdResponse200, GetPaymentByIdResponse400, GetPaymentByIdResponse404, GetPaymentByIdResponse500, GetPlanByIdMetadataParam, GetPlanByIdResponse200, GetPlanByIdResponse400, GetPlanByIdResponse500, ListAccountsResponse200, ListAccountsResponse400, ListAccountsResponse500, ListCustomersMetadataParam, ListCustomersResponse200, ListEventsForOrganizationMetadataParam, ListEventsForOrganizationResponse200, ListPaylinksMetadataParam, ListPaylinksResponse200, ListPaylinksResponse400, ListPaylinksResponse500, ListPaymentsMetadataParam, ListPaymentsResponse200, ListPaymentsResponse400, ListPaymentsResponse500, ListPlansMetadataParam, ListPlansResponse200, ListPlansResponse400, ListPlansResponse500, ListSubscriptionsMetadataParam, ListSubscriptionsResponse200, ListSubscriptionsResponse400, ListSubscriptionsResponse500, UpdateOrganizationBodyParam, UpdateOrganizationResponse200, UpdateOrganizationResponse400, UpdateOrganizationResponse401, UpdateOrganizationResponse500 } from './types';
