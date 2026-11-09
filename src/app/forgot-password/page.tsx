import {AuthForm} from '@/components/auth-form';
export const metadata={title:'Reset your password',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default function Page(){return <AuthForm mode="forgot" configured={!!process.env.NEXT_PUBLIC_SUPABASE_URL&&!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}/>}
