import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {studioSession} from '@/lib/auth-server';
export const metadata:Metadata={title:'Studio',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Layout({children}:{children:React.ReactNode}){const session=await studioSession();if(session.state!=='authorized')redirect(`/login?reason=${session.state==='unconfigured'?'setup':session.state==='forbidden'?'access':'session'}`);return children}
