import 'server-only';
import {connection} from 'next/server';
import {cache} from 'react';
import {bookingDatabase} from './server-booking';
import {defaultContent,type SiteContent} from './site-content';
export const publishedContent=cache(async function():Promise<SiteContent>{const db=bookingDatabase();if(!db)return defaultContent;await connection();const {data,error}=await db.from('studio_content').select('content').eq('id','published').maybeSingle();return !error&&data?data.content:defaultContent});
