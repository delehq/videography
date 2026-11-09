import {AuthForm} from '@/components/auth-form';
import {studioSession} from '@/lib/auth-server';
import {redirect} from 'next/navigation';
export const metadata={title:'Studio sign in',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Page(){const session=await studioSession();if(session.state==='authorized')redirect('/dashboard');return <AuthForm mode="login" configured={session.state!=='unconfigured'}/>}
