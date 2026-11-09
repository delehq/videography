import {BookingPortal} from '@/components/booking-portal';
export const metadata={title:'Your booking',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <BookingPortal id={id}/>}
