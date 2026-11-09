import {after} from 'next/server';
import {processNotifications} from '@/lib/notifications';
import {NextResponse} from 'next/server';
import {getPaymentProvider} from '@/lib/payment-provider';
import {bookingDatabase} from '@/lib/server-booking';
export async function POST(request:Request){
 const provider=getPaymentProvider(),db=bookingDatabase();if(!provider||!db)return NextResponse.json({error:'Payments are not connected.'},{status:503});
 let payment;try{payment=await provider.verifyWebhook(await request.text(),request.headers)}catch{return NextResponse.json({error:'Invalid payment signature.'},{status:401})}
 if(!payment.paid)return NextResponse.json({received:true});
 const {error}=await db.rpc('record_verified_payment',{p_attempt_id:payment.attemptId,p_booking_id:payment.bookingId,p_provider:provider.name,p_reference:payment.reference,p_amount:payment.amountMinor,p_currency:payment.currency});
 if(error){await db.from('notification_outbox').upsert({booking_id:payment.bookingId,event_type:'payment_review',event_key:`payment-review-${payment.attemptId}`,payload:{service:'Payment reconciliation',amount_minor:payment.amountMinor,currency:payment.currency}},{onConflict:'event_key',ignoreDuplicates:true});after(async()=>{try{await processNotifications()}catch{}});return NextResponse.json({error:'Payment could not be reconciled. Studio review required.'},{status:409})}after(async()=>{try{await processNotifications()}catch{}});return NextResponse.json({received:true});
}
