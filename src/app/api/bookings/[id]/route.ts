import {NextResponse} from 'next/server';
import {authorizedBooking} from '@/lib/server-booking';
import {getPaymentProvider} from '@/lib/payment-provider';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const result=await authorizedBooking(request,id);
 const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex'};
 if('error'in result)return NextResponse.json({error:result.error},{status:result.status,headers});
 const {id:bookingId,name,service,date,venue,status,payment_status,quote_amount_minor,quote_currency,paid_at,slot_kind,start_minute,end_minute,studio_timezone,hold_expires_at,canceled_at,payment_kind}=result.booking;
 return NextResponse.json({booking:{id:bookingId,name,service,date,venue,status,payment_status,quote_amount_minor,quote_currency,paid_at,slot_kind,start_minute,end_minute,studio_timezone,hold_expires_at,canceled_at,payment_kind},checkoutEnabled:!!getPaymentProvider()},{headers});
}

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){const {authorizedStudio}=await import('@/lib/server-studio');const auth=await authorizedStudio(req);if(!auth)return NextResponse.json({error:'Studio access required.'},{status:401});const {id}=await params;try{const body=await req.json();if(body.action!=='renew')return NextResponse.json({error:'Unknown action.'},{status:400});const {data:ops}=await auth.db.from('studio_content').select('content').eq('id','operations').maybeSingle();const hours=ops?.content?.schedule?.holdHours||48;const {data,error}=await auth.db.from('bookings').update({hold_expires_at:new Date(Date.now()+hours*3600000).toISOString()}).eq('id',id).eq('status','approved').eq('payment_status','unpaid').is('canceled_at',null).select('*').single();if(error)return NextResponse.json({error:'This slot is no longer available for a hold. Review the schedule.'},{status:409});return NextResponse.json({booking:data})}catch{return NextResponse.json({error:'Unable to renew hold.'},{status:400})}}
