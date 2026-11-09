import {SiteContentProvider} from '@/components/site-content';
import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import './globals.css';
import './scroll-sections.css';
import './reference-type.css';
import './dashboard.css';
import './responsive.css';
import {publishedContent} from '@/lib/server-site-content';
export async function generateMetadata():Promise<Metadata>{const {settings}=await publishedContent();return {title:{default:`${settings.name} — Videographer`,template:`%s — ${settings.name}`},description:settings.description};}
export default async function RootLayout({children}:{children:React.ReactNode}) { const initialContent=await publishedContent();return <html lang="en"><body><SiteContentProvider initialContent={initialContent}><SiteShell>{children}</SiteShell></SiteContentProvider></body></html>; }

