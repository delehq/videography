import {NextResponse} from 'next/server';
import {processNotifications} from '@/lib/notifications';
export const maxDuration=300;
export async function GET(req:Request){const secret=process.env.CRON_SECRET;if(!secret||req.headers.get('authorization')!==`Bearer ${secret}`)return NextResponse.json({error:'Unauthorized'},{status:401});try{return NextResponse.json(await processNotifications())}catch{return NextResponse.json({error:'Notification job failed.'},{status:503})}}
