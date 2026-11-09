import 'server-only';
export type CheckoutRequest={attemptId:string;bookingId:string;amountMinor:number;currency:string;email:string;returnUrl:string};
export type VerifiedPayment={reference:string;bookingId:string;attemptId:string;amountMinor:number;currency:string;paid:boolean};
export interface PaymentProvider{name:string;createCheckout(input:CheckoutRequest):Promise<{url:string;reference:string}>;verifyWebhook(rawBody:string,headers:Headers):Promise<VerifiedPayment>;}
// Register the selected provider's server-side SDK adapter here once supplied.
// A browser redirect or simulation must never be accepted as proof of payment.
export function getPaymentProvider():PaymentProvider|null{return null;}
