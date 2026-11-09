from pathlib import Path
p=Path('src/app/dashboard/page.tsx');s=p.read_text(encoding='utf8');s=s.replace("import {Booking,readDemo,writeDemo} from '@/lib/bookings';","import {Booking,readDemo,writeDemo} from '@/lib/bookings';\nimport {BookingDetails} from '@/components/booking-details';")
start=s.index('{selected&&<div className="detail-backdrop">');end=s.index('</div>\n}',start)
s=s[:start]+"{selected&&<BookingDetails booking={selected} busy={busy} onClose={()=>setSelected(null)} onStatus={status} onSave={save}/>}"+s[end:]
insert="""async function save(b:Booking){setBusy(true);setError('');const patch={name:b.name.trim(),email:b.email.trim(),date:b.date,venue:b.venue.trim(),message:b.message.trim(),service:b.service,archived_at:b.archived_at||null};if(db){const {error}=await db.from('bookings').update(patch).eq('id',b.id);if(error){setError('Could not save changes. Please try again.');setBusy(false);return false}}const updated={...b,...patch};const next=items.map(x=>x.id===b.id?updated:x);if(!db)writeDemo(next);setItems(next);setSelected(updated);setBusy(false);return true}\n"""
s=s.replace('const shown=useMemo',insert+'const shown=useMemo')
s=s.replace("(filter==='All'||b.status===filter.toLowerCase())", "(filter==='Archived'?!!b.archived_at:!b.archived_at&&(filter==='All'||b.status===filter.toLowerCase()))")
s=s.replace("['All','Pending','Approved','Declined']", "['All','Pending','Approved','Declined','Archived']")
s=s.replace("items.length.toString().padStart", "items.filter(b=>!b.archived_at).length.toString().padStart")
s=s.replace("b.status==='pending'", "b.status==='pending'&&!b.archived_at").replace("b.status==='approved'", "b.status==='approved'&&!b.archived_at")
p.write_text(s,encoding='utf8')
p=Path('src/lib/bookings.ts');s=p.read_text();s=s.replace('created_at:string','archived_at?:string|null;created_at:string');p.write_text(s)
p=Path('supabase/schema.sql');s=p.read_text();s=s.replace(" created_at timestamptz", " archived_at timestamptz,\n created_at timestamptz");s=s.replace('grant update(status)', 'grant update(status,name,email,service,date,venue,message,archived_at)');p.write_text(s)
