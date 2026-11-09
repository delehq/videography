import {NextResponse} from 'next/server';
import {authorizedBooking} from '@/lib/server-booking';
import {getPaymentProvider} from '@/lib/payment-provider';
export async function POST(request:Request){try{
 const {bookingId}=await request.json();if(typeof bookingId!=='string')return NextResponse.json({error:'A booking is required.'},{status:400});
 const result=await authorizedBooking(request,bookingId);if('error'in result)return NextResponse.json({error:result.error},{status:result.status});
 const {db,booking:b}=result;
 if(b.payment_status==='paid')return NextResponse.json({error:'This booking has already been paid.'},{status:409});
 if(b.canceled_at||!b.hold_expires_at||Date.parse(b.hold_expires_at)<=Date.now())return NextResponse.json({error:'Your reservation hold expired or was canceled. Ask the studio to renew availability before paying.'},{status:409});
 if(b.status!=='approved'||!Number.isSafeInteger(b.quote_amount_minor)||b.quote_amount_minor<=0||!b.quote_currency)return NextResponse.json({error:'John must approve your booking and confirm the quote before payment.'},{status:409});
 const provider=getPaymentProvider();if(!provider)return NextResponse.json({error:'Online payment is not available yet. Your booking and quote are saved.'},{status:503});
 const {data:existing}=await db.from('payment_attempts').select('checkout_url,amount_minor,currency').eq('booking_id',b.id).eq('status','pending').maybeSingle();
 if(existing){if(existing.amount_minor!==b.quote_amount_minor||existing.currency!==b.quote_currency)return NextResponse.json({error:'Your quote changed. Please contact the studio before paying.'},{status:409});return existing.checkout_url?NextResponse.json({url:existing.checkout_url}):NextResponse.json({error:'Checkout is being prepared. Please try again shortly.'},{status:409})}
 const {data:attempt,error}=await db.from('payment_attempts').insert({booking_id:b.id,provider:provider.name,amount_minor:b.quote_amount_minor,currency:b.quote_currency}).select('id').single();
 if(error||!attempt)return NextResponse.json({error:'A checkout may already be starting. Please try again shortly.'},{status:409});
 try{const origin=process.env.APP_URL;if(!origin)throw Error('Missing APP_URL');const checkout=await provider.createCheckout({attemptId:attempt.id,bookingId:b.id,amountMinor:b.quote_amount_minor,currency:b.quote_currency,email:b.email,returnUrl:new URL(`/booking/${b.id}/return`,origin).href});const url=new URL(checkout.url);if(url.protocol!=='https:'||url.username||url.password)throw Error('Invalid checkout URL');const {error:saveError}=await db.from('payment_attempts').update({checkout_url:url.href,provider_reference:checkout.reference}).eq('id',attempt.id);if(saveError)throw saveError;return NextResponse.json({url:url.href})}catch{await db.from('payment_attempts').update({status:'failed'}).eq('id',attempt.id);return NextResponse.json({error:'Checkout could not start. No payment has been confirmed. Please try again.'},{status:502})}
 }catch{return NextResponse.json({error:'Please submit a valid payment request.'},{status:400})}}
