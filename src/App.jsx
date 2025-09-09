import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Menu, X, Building2, Globe2, Compass, Check } from "lucide-react";

/**
 * CITEKS — Atelier (new skeleton)
 * - Left rail (desktop), top bar (mobile)
 * - Hero = oversized editorial type on dark canvas
 * - Showcase = horizontal snap gallery (no carousel)
 * - Systems kept: hash routes, Netlify forms, Stripe Embedded Checkout
 * Routes: /#/, /#/why-us, /#/projects, /#/brief/:slug, /#/pay/:slug, /#/thank-you, /#/privacy, /#/tech-terms
 */

function cx(...c){ return c.filter(Boolean).join(" "); }

/* ---- Showcase Data (images live in /public/showcase) ---- */
const showcase = [
  { key:"law", title:"Harbor & Sage Law — Scale", blurb:"Editorial architecture for business law.", src:"/showcase/harbor-sage-law.png" },
  { key:"vigor-hero", title:"Vigor Lab — Growth", blurb:"High-energy hero + programs grid.", src:"/showcase/vigor-lab-hero.png" },
  { key:"vigor-prog", title:"Vigor Lab — Programs", blurb:"Frictionless matrix to act fast.", src:"/showcase/vigor-lab-programs.png" },
  { key:"barber", title:"Urban Barber — Starter", blurb:"Warm tones, craft-led booking.", src:"/showcase/urban-barber.png" },
  { key:"ai", title:"SentienceWorks — Growth", blurb:"Futuristic palette, clear copy.", src:"/showcase/sentienceworks-ai.png" },
  { key:"museum", title:"Meridian Museum — Concept", blurb:"Editorial mood-first concept.", src:"/showcase/meridian-museum.png" },
];

/* ---- Packages ---- */
const packages = [
  { slug:"starter", name:"Starter", price:900, displayPrice:"$900", days:4, rushDays:2, rushFee:200,
    blurb:"2–3 pages, modern motion, responsive. Fast launch.", perfectFor:"Cafés, barbers, freelancers",
    features:["2–3 custom pages","Responsive + performance pass","Simple lead/contact form","Launch in days"], cta:"Start Starter" },
  { slug:"growth", name:"Growth", price:2300, displayPrice:"$2,300", days:8, rushDays:6, rushFee:400, highlight:true,
    blurb:"5–7 pages, SEO + schema, booking, Maps, integrations.", perfectFor:"Dentists, gyms, restaurants, small firms",
    features:["5–7 custom pages","On-page SEO + schema","Booking & Maps","3rd-party integrations","Content guidance"], cta:"Grow with Growth" },
  { slug:"scale", name:"Scale", price:7000, displayPrice:"$7,000", days:14, rushDays:10, rushFee:800,
    blurb:"10+ pages, strategy, advanced SEO + analytics, CRM/e-com.", perfectFor:"Law, real estate, healthcare, e-com",
    features:["10+ pages","Strategy + funnel mapping","Advanced SEO + analytics","Booking / e-com / CRM","Copy support"], cta:"Scale with Scale" },
];

/* ---- Router ---- */
function useHashRoute(){
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(()=>{ const h=()=>setHash(window.location.hash || "#/"); window.addEventListener("hashchange",h); return ()=>window.removeEventListener("hashchange",h);},[]);
  const clean = (hash || "#/").replace(/^#\/?/, "");
  const [path, ...rest] = clean.split("?")[0].split("/").filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(clean.split("?")[1] || ""));
  return { path: path || "", rest, query, raw: hash };
}
function navigate(to){ window.location.hash = to.startsWith("#") ? to : `#${to}`; }
function encodeFormData(data){ return new URLSearchParams(data).toString(); }

/* ---- App ---- */
export default function App(){
  const route = useHashRoute();

  // deferred scroll (from rail links)
  useEffect(()=>{
    const target = sessionStorage.getItem("scrollTo");
    if (target && (route.path === "" || route.path === "/")) {
      sessionStorage.removeItem("scrollTo");
      const el = document.getElementById(target);
      if (el) setTimeout(()=> el.scrollIntoView({behavior:"smooth", block:"start"}), 60);
    }
  },[route.path]);

  return (
    <div className="min-h-screen">
      <Rail/>
      <main className="main">
        {route.path === "" ? <Home/> :
         route.path === "why-us" ? <WhyUs/> :
         route.path === "projects" ? <Projects/> :
         route.path === "brief" && route.rest[0] ? <Brief slug={route.rest[0]}/> :
         route.path === "pay" && route.rest[0] ? <Pay slug={route.rest[0]}/> :
         route.path === "thank-you" ? <ThankYou/> :
         route.path === "privacy" ? <PrivacyPolicy/> :
         route.path === "tech-terms" ? <TechTerms/> :
         <NotFound/>}
        <Footer/>
        <NetlifyHiddenForms/>
      </main>
    </div>
  );
}

/* ================= Rail (Desktop) / Topbar (Mobile) ================= */
function Rail(){
  const [open, setOpen] = useState(false);
  useEffect(()=>{ const onResize=()=>setOpen(false); window.addEventListener("resize",onResize); return ()=>window.removeEventListener("resize",onResize);},[]);
  const go = (id)=> (e)=>{ e.preventDefault(); sessionStorage.setItem("scrollTo", id); navigate("/"); setOpen(false); };

  return (
    <>
      {/* Desktop rail */}
      <aside className="rail hidden lg:flex flex-col justify-between px-6 py-6">
        <div>
          <a href="#/" className="ts-h4 font-semibold">CITEKS</a>
          <div className="ts-h6 text-white/60 mt-2">Oslo · New York · Amsterdam</div>
          <nav className="mt-8 flex flex-col gap-3 ts-h6">
            <a href="#/" className="hover:opacity-80">Home</a>
            <a href="#/why-us" className="hover:opacity-80">Why us</a>
            <a href="#/projects" className="hover:opacity-80">Projects</a>
            <a href="#/" onClick={go("packages")} className="hover:opacity-80">Packages</a>
            <a href="#/" onClick={go("contact")} className="btn btn-acc mt-2 w-max"><Mail className="w-4 h-4"/> Contact</a>
          </nav>
        </div>
        <div className="ts-h6 text-white/50">
          <div className="flex items-center gap-2"><Globe2 className="w-4 h-4"/> English-first</div>
          <div className="flex items-center gap-2"><Building2 className="w-4 h-4"/> Registered in NO/US/NL</div>
          <div className="flex items-center gap-2"><Compass className="w-4 h-4"/> Conversion-led</div>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0f131a]/90 backdrop-blur border-b border-[var(--hair)] px-4 py-3 flex items-center justify-between">
        <a href="#/" className="ts-h5 font-semibold">CITEKS</a>
        <button className="p-2" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open? <X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden bg-[#0f131a] border-b border-[var(--hair)] px-4 py-3"
            initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}}
          >
            <nav className="flex flex-col gap-2 ts-h6">
              <a href="#/" onClick={()=>setOpen(false)} className="py-1">Home</a>
              <a href="#/why-us" onClick={()=>setOpen(false)} className="py-1">Why us</a>
              <a href="#/projects" onClick={()=>setOpen(false)} className="py-1">Projects</a>
              <a href="#/" onClick={go("packages")} className="py-1">Packages</a>
              <a href="#/" onClick={go("contact")} className="btn btn-acc mt-2 w-max"><Mail className="w-4 h-4"/> Contact</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= Pages ================= */
function Home(){
  return (
    <>
      <Hero/>
      <RowShowcase/>
      <Method/>
      <Plans/>
      <ContactBlock/>
    </>
  );
}

/* ---- Hero: big editorial on dark canvas (no photo) ---- */
function Hero(){
  return (
    <section className="relative overflow-clip">
      <div className="hero-bg"/>
      <div className="main container px-6 py-16 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="ts-h1 font-semibold">
            Websites that <span className="text-[var(--accent)]">convert</span>—
            engineered with restraint.
          </h1>
          <p className="ts-h5 text-white/70 mt-3">
            We ship calm, fast, premium interfaces that push one decision per page.
            Editorial structure. Motion with purpose. SEO-ready. Easy to run.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="#/projects" className="ts-h6 inline-flex items-center gap-2 hover:opacity-90">
              View projects <ArrowRight className="w-4 h-4"/>
            </a>
            <a href="#/" onClick={(e)=>{e.preventDefault(); sessionStorage.setItem("scrollTo","packages"); navigate("/");}}
               className="btn btn-acc">See packages</a>
          </div>
        </div>
      </div>
      <div className="hair opacity-50"/>
    </section>
  );
}

/* ---- Horizontal snap “Selected work” ---- */
function RowShowcase(){
  return (
    <section className="container px-6 py-10 lg:py-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="ts-h2 font-semibold">Selected work</h2>
        <a href="#/projects" className="ts-h6 hover:opacity-80">All projects</a>
      </div>
      <div className="snap-row">
        {showcase.map(s => (
          <figure key={s.key} className="surface overflow-hidden">
            <div className="relative" style={{aspectRatio:"2/1"}}>
              <img src={s.src} alt={s.title} className="absolute inset-0 w-full h-full object-contain bg-[#0b0f15]"/>
            </div>
            <figcaption className="p-4">
              <div className="ts-h6 font-semibold">{s.title}</div>
              <div className="ts-h6 text-white/60">{s.blurb}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---- Method (compact 4-up) ---- */
function Method(){
  const items = [
    ["Clarity first", "One goal per page. Labels, not slogans."],
    ["Trust quickly", "Proof, pricing, and guarantees up-front."],
    ["Motion with intent", "Micro-feedback that guides—not performs."],
    ["Friction down", "Fast loads, short forms, clear paths."],
  ];
  return (
    <section className="container px-6 py-10 lg:py-16">
      <div className="surface p-6">
        <h2 className="ts-h2 font-semibold mb-2">Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(([t, d])=>(
            <div key={t} className="border border-[var(--hair)] rounded-lg p-4">
              <div className="ts-h5 font-semibold">{t}</div>
              <div className="ts-h6 text-white/70">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Plans (pricing strips) ---- */
function Plans(){
  return (
    <section id="packages" className="container px-6 py-10 lg:py-16">
      <h2 className="ts-h2 font-semibold mb-6">Packages</h2>
      <div className="space-y-4">
        {packages.map(p=>(
          <motion.div key={p.slug} initial={{opacity:0, y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.45}}
            className={cx("grid grid-cols-12 items-start surface", p.highlight && "ring-1 ring-[var(--accent)]")}
          >
            <div className="col-span-12 md:col-span-4 p-6 border-r border-[var(--hair)]">
              <div className="ts-h4 font-semibold">{p.name}</div>
              <div className="ts-h3 font-semibold text-[var(--accent)] mt-1">{p.displayPrice}</div>
              <div className="ts-h6 text-white/70 mt-1">{p.blurb}</div>
              <div className="ts-h6 text-white/60 mt-1">Perfect for: {p.perfectFor}</div>
              <a href={`#/brief/${p.slug}`} className="btn btn-acc mt-4">{p.cta} <ArrowRight className="w-4 h-4"/></a>
            </div>
            <ul className="col-span-12 md:col-span-8 p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {p.features.map(f=>(
                <li key={f} className="ts-h6 flex items-start gap-2">
                  <Check className="w-5 h-5 text-[var(--accent)] mt-0.5"/><span>{f}</span>
                </li>
              ))}
              <li className="md:col-span-2 ts-h6 text-white/60 pt-2 hair mt-2">
                Typical timeline: {p.days} days (rush {p.rushDays} days +${p.rushFee})
              </li>
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---- Contact ---- */
function ContactBlock(){
  return (
    <section id="contact" className="container px-6 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 surface p-6">
          <h2 className="ts-h2 font-semibold">Let’s build ROI</h2>
          <p className="ts-h6 text-white/70 mt-2">Tell us about your goals. We’ll reply quickly.</p>
          <div className="ts-h6 text-white/80 mt-4">Oslo · New York · Amsterdam</div>
          <a href="mailto:contact@citeks.net" className="ts-h6 underline text-[var(--accent)] mt-2 inline-block">
            contact@citeks.net
          </a>
        </div>
        <div className="lg:col-span-7"><ContactForm/></div>
      </div>
    </section>
  );
}

/* ---- Contact Form (Netlify) ---- */
function ContactForm(){
  const [form, setForm] = useState({ title:"Mr", first:"", last:"", email:"", project:"", budget:"", message:"" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  function v(){ const e={}; if(!form.first)e.first="Required"; if(!form.last)e.last="Required"; if(!/^\S+@\S+\.\S+$/.test(form.email)) e.email="Enter a valid email"; if(!form.project)e.project="Required"; if(!form.budget)e.budget="Required"; return e; }
  async function submit(e){ e.preventDefault(); const errs=v(); setErrors(errs); if(Object.keys(errs).length) return;
    try{ await fetch("/",{method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:encodeFormData({"form-name":"contact",...form})}); setSent(true);}catch{ alert("Submission failed. Please email contact@citeks.net");}
  }
  return (
    <form name="contact" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}
      className="surface p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" name="form-name" value="contact"/><input type="hidden" name="bot-field"/>
      <Field label="Title">
        <select value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full bg-transparent border border-[var(--hair)] rounded-lg p-3">
          {["Mr","Ms","Mx","Dr","Prof","Other"].map(o=> <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
      <Input label="First name" val={form.first} set={v=>setForm({...form, first:v})} err={errors.first}/>
      <Input label="Surname" val={form.last} set={v=>setForm({...form, last:v})} err={errors.last}/>
      <Input label="Email" type="email" val={form.email} set={v=>setForm({...form, email:v})} err={errors.email}/>
      <Input label="Project type" val={form.project} set={v=>setForm({...form, project:v})} err={errors.project}/>
      <Field label="Budget">
        <select value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})}
          className={cx("w-full bg-transparent border rounded-lg p-3", errors.budget?"border-red-500":"border-[var(--hair)]")}>
          <option value="">Select…</option><option>Up to $1,000</option><option>$1,000 – $2,500</option><option>$2,500 – $7,000</option><option>$7,000+</option>
        </select>
        {errors.budget && <div className="ts-h6 text-red-400 mt-1">{errors.budget}</div>}
      </Field>
      <Area label="Message" val={form.message} set={v=>setForm({...form, message:v})} rows={5}/>
      <div className="md:col-span-2 flex items-center justify-between">
        <div className="ts-h6 text-white/60">No spam. We reply within 24h.</div>
        <button className="btn btn-acc" type="submit"><Mail className="w-4 h-4"/> Send</button>
      </div>
      {sent && <div className="md:col-span-2 ts-h6 text-emerald-300">Thanks! Your message is in.</div>}
    </form>
  );
}

/* form field helpers */
function Field({label, children}){ return (<div><label className="ts-h6 block mb-1">{label}</label>{children}</div>); }
function Input({label, val, set, err, type="text"}){ return (
  <Field label={label}>
    <input type={type} value={val} onChange={e=>set(e.target.value)} className={cx("w-full bg-transparent border rounded-lg p-3", err?"border-red-500":"border-[var(--hair)]")}/>
    {err && <div className="ts-h6 text-red-400 mt-1">{err}</div>}
  </Field>
); }
function Area({label, val, set, rows=4}){ return (
  <div className="md:col-span-2"><label className="ts-h6 block mb-1">{label}</label>
    <textarea rows={rows} value={val} onChange={e=>set(e.target.value)} className="w-full bg-transparent border border-[var(--hair)] rounded-lg p-3"/>
  </div>
); }

/* ================= Projects Page ================= */
function Projects(){
  return (
    <section className="container px-6 py-10 lg:py-16">
      <h1 className="ts-h1 font-semibold mb-4">Projects</h1>
      <div className="space-y-8">
        {showcase.map((s,i)=>(
          <article key={s.key} className="surface overflow-hidden">
            <div className="px-6 pt-6 flex items-center justify-between">
              <div className="ts-h5 font-semibold">{s.title}</div>
              <div className="ts-h6 text-white/50">#{String(i+1).padStart(2,"0")}</div>
            </div>
            <div className="mt-4" style={{aspectRatio:"2/1"}}>
              <img src={s.src} alt={s.title} className="w-full h-full object-contain bg-[#0b0f15]"/>
            </div>
            <p className="ts-h6 text-white/70 p-6">{s.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Why Us ================= */
function WhyUs(){
  const bullets = [
    ["Editorial bones", "Swiss grid with generous breathing room; clear proximity and alignment."],
    ["Conversion core", "Single goal per page; form flow and messaging designed for action."],
    ["Search honest", "SEO baked into structure, not bolted on. Schema, IA, and speed."],
    ["Run-light", "Fast stack, simple deploys, and ownership of content."],
  ];
  return (
    <section className="container px-6 py-10 lg:py-16">
      <h1 className="ts-h1 font-semibold mb-4">Why choose CITEKS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bullets.map(([t,d])=>(
          <div key={t} className="surface p-6">
            <div className="ts-h4 font-semibold">{t}</div>
            <div className="ts-h6 text-white/70">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= Brief & Pay (Stripe flow preserved) ================= */
function Brief({ slug }){
  const pkg = packages.find(p=>p.slug===slug); if(!pkg) return <NotFound/>;
  const [rush, setRush] = useState(false);
  const total = pkg.price + (rush ? pkg.rushFee : 0);
  const [form, setForm] = useState({
    company:"", contact:"", email:"", phone:"", pages:"", goal:"", assetsNote:"",
    seo:"", integrations:"", ecommerce:"", crm:"", references:"", competitors:"", notes:"",
  });
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState({});
  function v(){ const e={}; if(!form.company)e.company="Required"; if(!form.contact)e.contact="Required"; if(!/^\S+@\S+\.\S+$/.test(form.email))e.email="Enter a valid email"; if(!form.phone)e.phone="Required"; if(!form.pages)e.pages="Required"; if(!form.goal)e.goal="Required"; if(!form.assetsNote && (!files || files.length===0)) e.assetsNote="Provide a note or upload at least one asset file"; return e;}
  async function submit(e){ e.preventDefault(); const e1=v(); setErr(e1); if(Object.keys(e1).length) return;
    const fd = new FormData(); fd.append("form-name",`brief-${pkg.slug}`); fd.append("package",pkg.name); fd.append("rush",rush?"Yes":"No"); fd.append("total",`$${total}`);
    Object.entries(form).forEach(([k,v])=>fd.append(k,v||"")); if(files?.length) Array.from(files).forEach(f=>fd.append("assetsFiles", f));
    try{ await fetch("/",{method:"POST", body:fd}); navigate(`/pay/${pkg.slug}?rush=${rush?"1":"0"}`);}catch{ alert("Submission failed. Please email contact@citeks.net");}
  }
  return (
    <section className="container px-6 py-10 lg:py-16">
      <h1 className="ts-h2 font-semibold">{pkg.name} brief</h1>
      <p className="ts-h6 text-white/70 mt-1">{pkg.displayPrice} · Typical timeline: {pkg.days} days (rush {pkg.rushDays} days +${pkg.rushFee})</p>
      <form name={`brief-${pkg.slug}`} data-netlify="true" netlify-honeypot="bot-field" encType="multipart/form-data" onSubmit={submit}
        className="surface p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <input type="hidden" name="form-name" value={`brief-${pkg.slug}`}/><input type="hidden" name="bot-field"/>
        <Input label="Company / brand" val={form.company} set={v=>setForm({...form,company:v})} err={err.company}/>
        <Input label="Contact name" val={form.contact} set={v=>setForm({...form,contact:v})} err={err.contact}/>
        <Input label="Email" type="email" val={form.email} set={v=>setForm({...form,email:v})} err={err.email}/>
        <Input label="Phone" val={form.phone} set={v=>setForm({...form,phone:v})} err={err.phone}/>
        <Area label="Goal of the site" val={form.goal} set={v=>setForm({...form,goal:v})}/>
        <Input label="Estimated pages" val={form.pages} set={v=>setForm({...form,pages:v})} err={err.pages}/>
        <Area label="Available assets — notes" val={form.assetsNote} set={v=>setForm({...form, assetsNote:v})}/>
        <Field label="Upload assets (images, logos, docs)">
          <input type="file" multiple onChange={(e)=>setFiles(e.target.files)} className="w-full bg-transparent border border-[var(--hair)] rounded-lg p-3"/>
          <div className="ts-h6 text-white/60 mt-1">Attach multiple files if needed.</div>
          {err.assetsNote && <div className="ts-h6 text-red-400 mt-1">{err.assetsNote}</div>}
        </Field>
        <Area label="SEO targets (keywords/locations)" val={form.seo} set={v=>setForm({...form,seo:v})}/>
        <Input label="Integrations (maps, booking, payments)" val={form.integrations} set={v=>setForm({...form,integrations:v})}/>
        <Input label="E-commerce (if needed)" val={form.ecommerce} set={v=>setForm({...form,ecommerce:v})}/>
        <Input label="CRM (if needed)" val={form.crm} set={v=>setForm({...form,crm:v})}/>
        <Area label="Reference sites (what you like)" val={form.references} set={v=>setForm({...form,references:v})}/>
        <Input label="Competitors" val={form.competitors} set={v=>setForm({...form,competitors:v})}/>
        <Area label="Notes / constraints" val={form.notes} set={v=>setForm({...form,notes:v})}/>
        <div className="md:col-span-2 flex items-center justify-between hair pt-4">
          <label className="ts-h6 flex items-center gap-2"><input type="checkbox" checked={rush} onChange={e=>setRush(e.target.checked)}/> Rush delivery: finish in {pkg.rushDays} days (+${pkg.rushFee})</label>
          <div className="ts-h5 font-semibold text-[var(--accent)]">Total: ${total}</div>
        </div>
        <div className="md:col-span-2 flex items-center justify-end">
          <button className="btn btn-acc">Continue <ArrowRight className="w-4 h-4"/></button>
        </div>
      </form>
    </section>
  );
}

function Pay({ slug }){
  const pkg = packages.find(p=>p.slug===slug); if(!pkg) return <NotFound/>;
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const initialRush = params.get("rush")==="1";
  const [rush, setRush] = useState(initialRush);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(""); const containerRef = useRef(null);

  useEffect(()=>{ (async ()=>{
    try{
      const res = await fetch("/.netlify/functions/create-checkout-session",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ slug, rush, origin: window.location.origin })});
      if(!res.ok){ const t=await res.text(); throw new Error(t||"Failed");}
      const { clientSecret } = await res.json(); setClientSecret(clientSecret); setError("");
    }catch(e){
      try{ const p=JSON.parse(e.message); setError(p.error||"Could not start checkout. Email contact@citeks.net.");}
      catch{ setError(e.message||"Could not start checkout. Email contact@citeks.net.");}
    }
  })(); },[slug, rush]);

  useEffect(()=>{ let cleanup=()=>{}; (async ()=>{
    if(!clientSecret || !containerRef.current) return;
    const { loadStripe } = await import("@stripe/stripe-js");
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || window.STRIPE_PUBLISHABLE_KEY);
    if(!stripe){ setError("Stripe not available."); return; }
    const checkout = await stripe.initEmbeddedCheckout({ clientSecret }); checkout.mount(containerRef.current); cleanup=()=>checkout.destroy();
  })(); return ()=>cleanup(); },[clientSecret]);

  const total = pkg.price + (rush ? pkg.rushFee : 0);

  return (
    <section className="container px-6 py-10 lg:py-16">
      <h1 className="ts-h2 font-semibold">Payment</h1>
      <div className="surface p-6 mt-6">
        <div className="ts-h4 font-semibold">{pkg.name}</div>
        <div className="ts-h6 text-white/70 mt-1">Base price {pkg.displayPrice}. Typical timeline {pkg.days} days.</div>
        <div className="flex items-center justify-between mt-4">
          <label className="ts-h6 flex items-center gap-2"><input type="checkbox" checked={rush} onChange={e=>setRush(e.target.checked)}/> Rush delivery: finish in {pkg.rushDays} days (+${pkg.rushFee})</label>
          <div className="ts-h4 font-semibold text-[var(--accent)]">Total: ${total}</div>
        </div>
        <div className="mt-6">{error && <div className="ts-h6 text-red-400 mb-3 whitespace-pre-wrap">{error}</div>}<div ref={containerRef} id="checkout" className="w-full"/></div>
        <div className="mt-4 ts-h6 text-white/60">Secure payment powered by Stripe.</div>
      </div>
    </section>
  );
}

function ThankYou(){
  const [summary, setSummary] = useState(null); const [error, setError] = useState("");
  const sessionId = new URLSearchParams(window.location.hash.split("?")[1] || "").get("session_id");
  useEffect(()=>{ (async ()=>{
    if(!sessionId) return;
    try{ const res = await fetch(`/.netlify/functions/session-status?session_id=${encodeURIComponent(sessionId)}`); const json = await res.json(); if(!res.ok) throw new Error(json?.error||"Failed"); setSummary(json);}
    catch{ setError("We received your payment, but couldn’t load the details. We’ll email you shortly."); }
  })(); },[sessionId]);
  const niceTotal = summary?.amount_total ? `$${(summary.amount_total/100).toFixed(2)} ${summary.currency?.toUpperCase()}` : "—";
  return (
    <section className="container px-6 py-16">
      <h1 className="ts-h2 font-semibold mb-2">Thank you!</h1>
      <p className="ts-h6 text-white/70">We’ll email you shortly from <b>contact@citeks.net</b> with next steps.</p>
      {summary && (
        <div className="surface p-6 mt-6">
          <div className="ts-h5 font-semibold">Purchase summary</div>
          <div className="ts-h6 text-white/80 mt-2 space-y-1">
            <div><b>Status:</b> {summary.payment_status}</div>
            <div><b>Transaction ID:</b> {summary.payment_intent_id || "—"}</div>
            <div><b>Package:</b> {summary.metadata?.package || "—"}</div>
            <div><b>Rush:</b> {summary.metadata?.rush === "true" ? "Yes":"No"}</div>
            <div><b>Total:</b> {niceTotal}</div>
          </div>
          <div className="ts-h6 text-white/70 mt-3">Forgot something? Use the <a href="#/" onClick={(e)=>{e.preventDefault(); sessionStorage.setItem("scrollTo","contact"); navigate("/");}} className="underline">contact form</a> and include your Transaction ID.</div>
        </div>
      )}
      {error && <div className="ts-h6 text-red-400 mt-4">{error}</div>}
      <a href="#/" className="btn btn-acc mt-6">Back to home</a>
    </section>
  );
}

/* ================= Footer & Static Pages ================= */
function Footer(){
  return (
    <footer className="hair mt-12">
      <div className="container px-6 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="ts-h6 text-white/70">© {new Date().getFullYear()} CITEKS — Oslo · New York · Amsterdam</div>
        <div className="ts-h6"><a href="#/privacy" className="hover:opacity-80 mr-4">Privacy</a><a href="#/tech-terms" className="hover:opacity-80">Technical terms</a></div>
      </div>
    </footer>
  );
}

function PrivacyPolicy(){
  return (
    <section className="container px-6 py-16">
      <h1 className="ts-h1 font-semibold mb-4">Privacy Policy</h1>
      <div className="surface p-6 ts-h6 text-white/80 space-y-3">
        <p><b>Who we are.</b> CITEKS builds fast, modern websites that convert. Contact: contact@citeks.net.</p>
        <p><b>What we collect.</b> Form/brief submissions (including uploads). No cookies.</p>
        <p><b>Use of data.</b> Replies, proposals, service delivery, payments (Stripe), compliance.</p>
        <p><b>Sharing.</b> Only with providers we use (Netlify, Stripe). No selling of personal data.</p>
        <p><b>Retention.</b> Kept as needed for services and legal duties, then deleted/anonymized.</p>
        <p><b>Your rights.</b> Email contact@citeks.net for access/correction/deletion.</p>
      </div>
      <a href="#/" className="btn btn-acc mt-6">Back to home</a>
    </section>
  );
}

function TechTerms(){
  const rows = [
    ["CTA", "Primary action (call, book, buy)."],
    ["CVR", "Share of visitors who convert."],
    ["IA", "How content is structured and labeled."],
    ["Responsive", "Layouts adapt to screen sizes."],
    ["SEO", "Structure & content for discoverability."],
    ["Schema", "Structured data for search engines."],
    ["CRM", "Where leads are captured and routed."],
    ["Analytics", "Behavior & performance tracking."],
    ["Accessibility", "Usable for people of all abilities."],
    ["Performance", "How quickly a page loads/responds."],
  ];
  return (
    <section className="container px-6 py-16">
      <h1 className="ts-h1 font-semibold mb-4">Technical terms</h1>
      <div className="surface p-6">
        <ul className="ts-h6 text-white/80 space-y-2">{rows.map(([t,d])=> <li key={t}><b>{t}:</b> {d}</li>)}</ul>
      </div>
      <a href="#/" className="btn btn-acc mt-6">Back to home</a>
    </section>
  );
}

/* Hidden Netlify forms (build detection) */
function NetlifyHiddenForms(){
  return (
    <div style={{display:"none"}}>
      <form name="brief-starter" data-netlify="true" encType="multipart/form-data"><input name="company"/><input name="assetsFiles" type="file"/></form>
      <form name="brief-growth" data-netlify="true" encType="multipart/form-data"><input name="company"/><input name="assetsFiles" type="file"/></form>
      <form name="brief-scale" data-netlify="true" encType="multipart/form-data"><input name="company"/><input name="assetsFiles" type="file"/></form>
      <form name="contact" data-netlify="true"><input name="first"/></form>
    </div>
  );
}

function NotFound(){
  return (
    <section className="container px-6 py-16">
      <h1 className="ts-h2 font-semibold mb-2">Page not found</h1>
      <a href="#/" className="btn btn-acc mt-2">Go home</a>
    </section>
  );
}
