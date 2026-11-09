import {Project} from '@/components/portfolio';
import {projects,getProject} from '@/lib/brand';
import {publishedContent} from '@/lib/server-site-content';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(process.env.NEXT_PUBLIC_SUPABASE_URL){const content=await publishedContent();const canonical=getProject(slug)?.slug||slug;if(!content.projects.some(p=>p.slug===canonical&&p.published!==false))notFound()}return <Project slug={slug}/>}
