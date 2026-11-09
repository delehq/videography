import 'server-only';
import {createClient} from '@supabase/supabase-js';
export function bookingDatabase(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;return url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;}
export async function authorizedBooking(request:Request,id:string){
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'')||'';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)||!/^[0-9a-f]{64}$/i.test(token))return {error:'This booking link is invalid.',status:404} as const;
 const db=bookingDatabase();if(!db)return {error:'Booking access is not available yet.',status:503} as const;
 const {data,error}=await db.from('bookings').select('*').eq('id',id).eq('client_token',token).maybeSingle();
 if(error)return {error:'Unable to open this booking. Please try again.',status:500} as const;
 if(!data)return {error:'This booking link is invalid or no longer available.',status:404} as const;
 return {db,booking:data};
}
