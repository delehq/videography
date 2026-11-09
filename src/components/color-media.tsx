'use client';
import {useState} from 'react';
export function ColorMedia({children,className='',label='image'}:{children:React.ReactNode;className?:string;label?:string}){
 const [color,setColor]=useState(false);
 return <div className={`${className} color-media${color?' is-color':''}`} role="button" tabIndex={0} aria-label={`${color?'Show in black and white':'Show in color'}: ${label}`} aria-pressed={color} onClick={()=>setColor(v=>!v)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setColor(v=>!v)}}}>{children}</div>
}
