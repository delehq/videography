import {AuthForm} from '@/components/auth-form';
import {studioSession} from '@/lib/auth-server';
import {redirect} from 'next/navigation';
export const metadata={title:'Choose a new password',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Page(){const session=await studioSession();if(session.state!=='authorized')redirect('/login?reason=recovery');return <AuthForm mode="reset" configured/>}
