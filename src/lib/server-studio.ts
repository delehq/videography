import 'server-only';
import {bookingDatabase} from './server-booking';
export async function authorizedStudio(req:Request){const db=bookingDatabase(),token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!db||!token)return null;const {data:{user},error}=await db.auth.getUser(token);if(error||!user)return null;const {data,error:membershipError}=await db.from('studio_admins').select('user_id').eq('user_id',user.id).maybeSingle();return data&&!membershipError?{db,user}:null}
