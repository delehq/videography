import referenceAssets from "./reference-assets.json";
import referenceProjects from "./reference-projects.json";
export const brand = { name: 'John', description: 'Films for the moments that matter.' };
const legacyProjects = [
 {slug:'a-place-to-remember',title:'A place to remember',category:'Stories',image:'work-a.jpg',film:'brand.webm',description:'A study of place, light, and the little things we carry with us.'},
 {slug:'by-the-water',title:'By the water',category:'Stories',image:'work-b.jpg',film:'brand.webm',description:'A quiet escape, told through changing light.'},
 {slug:'the-way-you-look',title:'The way you look',category:'Weddings',image:'wedding.jpg',film:'wedding.webm',description:'An intimate celebration. The in-between moments, held a little longer.'},
 {slug:'together-always',title:'Together, always',category:'Weddings',image:'wedding2.jpg',film:'wedding.webm',description:'Two people, one day, a story to return to.'},
 {slug:'at-the-table',title:'At the table',category:'Commercial',image:'commercial.jpg',film:'film.webm',description:'Texture, craft, and the people behind an experience.'},
 {slug:'a-slower-life',title:'A slower life',category:'Stories',image:'cloud39.jpg',film:'film.webm',description:'A portrait of everyday rituals and unhurried living.'},
 {slug:'room-to-breathe',title:'Room to breathe',category:'Commercial',image:'commercial2.jpg',film:'brand.webm',description:'A hospitality film exploring space and atmosphere.'},
];

export const projects = referenceProjects;
export function mediaUrl(src:string){return /^(https?:|\/)/.test(src)?src:`/media/${src}`;}
const legacyMap:Record<string,string>={"a-place-to-remember":"zakynthos-videos","by-the-water":"zakynthos-greece","the-way-you-look":"nikos-lenia","together-always":"sophie-dara","at-the-table":"hamsa","a-slower-life":"yiayia-maria","room-to-breathe":"olea-all-suite-hotel"};
export function getProject(slug:string){return projects.find(p=>p.slug===(legacyMap[slug]||slug))|| (legacyProjects.some(p=>p.slug===slug)?projects[0]:undefined);}

export function referenceMedia(path:string){return (referenceAssets as Record<string,string>)[path]||`https://thomasmamfredas.com${path}`;}
