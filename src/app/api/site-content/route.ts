import {NextResponse} from 'next/server';
import {bookingDatabase} from '@/lib/server-booking';
import {defaultContent} from '@/lib/site-content';
export const dynamic='force-dynamic';
export async function GET(){const db=bookingDatabase();if(!db)return NextResponse.json({content:defaultContent,blocks:[]});const [{data,error},{data:availability,error:blockError}]=await Promise.all([db.from('studio_content').select('content').eq('id','published').maybeSingle(),db.from('studio_content').select('content').eq('id','operations').maybeSingle()]);if(error||blockError)return NextResponse.json({error:'Site settings are temporarily unavailable.'},{status:503});return NextResponse.json({content:data?.content||defaultContent,blocks:(availability?.content?.blocks||[]).map((b:{start:string;end:string})=>({start:b.start,end:b.end}))},{headers:{'Cache-Control':'no-store'}})}
