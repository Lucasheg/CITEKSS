import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Menu, X, Check, Globe2, Building2, Compass } from "lucide-react";

/**
 * CITEKS — Refined skeleton (smaller type, thin lines, stronger value messaging)
 * Routes preserved: /#/, /#/why-us, /#/projects, /#/brief/:slug, /#/pay/:slug, /#/thank-you, /#/privacy, /#/tech-terms
 */

function cx(...c) { return c.filter(Boolean).join(" "); }

/* ---------- Data ---------- */
const showcase = [
  { key:"law", title:"Harbor & Sage Law — Scale", blurb:"Editorial architecture for a business law firm.", src:"/showcase/harbor-sage-law.png" },
  { key:"vigor-hero", title:"Vigor Lab — Growth", blurb:"High-energy hero + clear programs matrix.", src:"/showcase/vigor-lab-hero.png" },
  { key:"vigor-prog", title:"Vigor Lab — Programs", blurb:"Frictionless grid that speeds sign-ups.", src:"/showcase/vigor-lab-programs.png" },
  { key:"barber", title:"Urban Barber — Starter", blurb:"Warm tones, craft-led structure, clean booking.", src:"/showcase/urban-barber.png" },
  { key:"ai", title:"SentienceWorks — Growth", blurb:"Futuristic palette, clear copy, purposeful motion.", src:"/showcase/sentienceworks-ai.png" },
  { key:"museum", title:"Meridian Museum — Concept", blurb:"Editorial concept focused on mood and presence.", src:"/showcase/meridian-museum.png" },
];

const packages = [
  { slug:"starter", name:"Starter", price:900, displayPrice:"$900", days:4, rushDays:2, rushFee:200,
    blurb:"2–3 pages, responsive, modern motion. Launch quickly.",
    perfectFor:"Founders, creators, boutique services",
    features:["2–3 custom pages","Responsive + performance pass","Simple lead/contact form","Launch in days"],
    cta:"Start Starter"
  },
  { slug:"growth", name:"Growth", price:2300, displayPrice:"$2,300", days:8, rushDays:6, rushFee:400, highlight:true,
    blurb:"5–7 pages, SEO + schema, booking & Maps, integrations.",
    perfectFor:"Clinics, gyms, restaurants, SMBs",
    features:["5–7 custom pages","On-page SEO + schema","Booking & Maps","3rd-party integrations","Content guidance"],
    cta:"Grow with Growth"
  },
  { slug:"scale", name:"Scale", price:7000, displayPrice:"$7,000", days:14, rushDays:10, rushFee:800,
    blurb:"10+ pages, strategy, advanced SEO/analytics, CRM/e-com.",
    perfectFor:"Law, real estate, healthcare, e-com",
    features:["10+ pages","Strategy + funnel mapping","Advanced SEO + analytics","Booking / e-com / CRM","Copy support"],
    cta:"Scale with Scale"
  },
];

/* ---------- Router ---------- */
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

/* ---------- App ---------- */
export default function App(){
  const route = useHashRoute();

  useEffect(()=>{
    const t = sessionStorage.getItem("scrollTo");
    if (t && (route.path === "" || route.path === "/")) {
      sessionStorage.removeItem("scrollTo");
      const el = document.getElementById(t);
      if (el) setTimeout(()=> el.scrollIntoView({ behavior:"smooth", block:"start"}), 60);
    }
  },[route.path]);

  return (
    <div className="min-h-screen">
      <Topbar />
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
    </div>
  );
}

/* ================= NAV ================= */
function Topbar(){
  const [open, setOpen] = useState(false);
  const go = (id)=> (e)=>{ e.preventDefault(); sessionStorage.setItem("scrollTo", id); navigate("/"); setOpen(false); };
  return (
    <>
      <div className="topbar px-4 lg:px-6 py-2.5 flex items-center justify-between">
        <a href="#/" className="ts-h5 font-semibold">CITEKS</a>
        <div className="hidden md:flex items-center gap-6 ts-h6">
          <a href="#/" className="hover:opacity-80">Home</a>
          <a href="#/why-us" className="hover:opacity-80">Why us</a>
          <a href="#/projects" className="hover:opacity-80">Projects</a>
          <a href="#/" onClick={go("packages")} className="hover:opacity-80">Packages</a>
          <a href="#/" onClick={go("contact")} className="btn btn-acc"><Mail className="w-4 h-4"/> Contact</a>
        </div>
        <button className="md:hidden p-2" onClick={()=>setOpen(!open)} aria-label="Toggle menu">
          {open? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}}
            className="md:hidden bg-white border-b border-[var(--hair)] px-4 py-3"
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

/* ================= HOME ================= */
function Home(){
  return (
    <>
      <Hero />
      <Outcomes />
      <ServiceLadder />
      <ShowcaseRow />
      <ProofBand />
      <ContactBlock />
    </>
  );
}

/* ---- Hero: stronger scrim + frosted copy panel (white text) ---- */
function Hero(){
  const ref = useRef(null);
  const prefersRM = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const yImg   = useTransform(scrollYProgress, [0,1], [0, prefersRM ? 0 : -80]);
  const fade   = useTransform(scrollYProgress, [0,1], [1, prefersRM ? 1 : 0.88]);

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero-media" style={{ backgroundImage: "url('/hero/waterfall.jpg')", y: yImg, opacity: fade }}/>
      <div className="hero-scrim"></div>

      <div className="container h-full grid content-center">
        <div className="hero-copy p-5 md:p-6 max-w-2xl">
          <h1 className="ts-h1 font-semibold">
            Websites that grow pipeline —
            <span style={{color:"#b6ffe5"}}>without the noise.</span>
          </h1>
          <p className="ts-h6 mt-2 text-white/90">
            We build quiet, conversion-led sites: fewer choices, faster decisions, clearer value. From structure to search, every detail supports one goal.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a href="#/projects" className="ts-h6 inline-flex items-center gap-2 underline underline-offset-4 decoration-white/60 hover:opacity-90">
              View projects <ArrowRight className="w-4 h-4"/>
            </a>
            <a
              href="#/"
              onClick={(e)=>{e.preventDefault(); sessionStorage.setItem("scrollTo","packages"); navigate("/");}}
              className="btn btn-acc"
            >
              See packages
            </a>
          </div>
          <div className="ts-h6 mt-3 text-white/80 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2"><Globe2 className="w-4 h-4"/> English-first</span>
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4"/> Oslo · New York · Amsterdam</span>
            <span className="flex items-center gap-2"><Compass className="w-4 h-4"/> Conversion-led</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Outcomes (value / “better version after working with us”) ---- */
function Outcomes(){
  const items = [
    ["Clear message → More action", "Pages center on a single decision. Labels over slogans. Lead forms feel effortless."],
    ["Trust early → Risk down", "Proof, guarantees, transparent pricing appear high on the page to reduce hesitation."],
    ["Search-ready → Compounding traffic", "IA + schema + fast performance. Content frameworks that scale without mess."],
    ["Owner-friendly → Faster iteration", "Simple stack, clean CMS hooks, and patterns you can extend without calling a dev."],
  ];
  return (
    <section className="container px-6 py-12 lg:py-16">
      <h2 className="ts-h2 font-semibold mb-3">After a CITEKS partnership</h2>
      <p className="ts-h6 text-slate-700 mb-5 max-w-3xl">
        Your site stops performing like a brochure and starts acting like a quiet sales engine. Fewer steps. Faster load. Clearer copy. Better decisions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(([t,d])=>(
          <div key={t} className="surface p-5">
            <div className="ts-h5 font-semibold">{t}</div>
            <div className="ts-h6 text-slate-700 mt-1">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- Packages (smaller type, thinner look) ---- */
function ServiceLadder(){
  return (
    <section id="packages" className="container px-6 py-12 lg:py-16">
      <h2 className="ts-h2 font-semibold mb-5">Packages</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {packages.map(p=>(
          <motion.div key={p.slug} initial={{opacity:0, y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.45}}
            className={cx("surface p-5 flex flex-col", p.highlight && "ring-1 ring-[var(--accent)]")}
          >
            <div className="flex items-baseline justify-between">
              <div className="ts-h5 font-semibold">{p.name}</div>
              <div className="ts-h3 font-semibold" style={{color:"var(--accent)"}}>{p.displayPrice}</div>
            </div>
            <div className="ts-h6 text-slate-700 mt-1">{p.blurb}</div>
            <div className="ts-h6 text-slate-600 mt-1">Perfect for: {p.perfectFor}</div>
            <ul className="mt-2 space-y-2">
              {p.features.map(f=>(
                <li key={f} className="flex items-start gap-2 ts-h6">
                  <Check className="w-5 h-5" style={{color:"var(--accent)"}}/><span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="ts-h6 text-slate-600 mt-2">Typical timeline: {p.days} days (rush {p.rushDays} days +${p.rushFee})</div>
            <a href={`#/brief/${p.slug}`} className="btn btn-acc mt-4 self-start">{p.cta} <ArrowRight className="w-4 h-4"/></a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---- Horizontal showcase (lighter, airy) ---- */
function ShowcaseRow(){
  const prefersRM = useReducedMotion();
  return (
    <section className="container px-6 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="ts-h2 font-semibold">Selected work</h2>
        <a href="#/projects" className="ts-h6 hover:opacity-80">All projects</a>
      </div>
      <div className="snap-row">
        {showcase.map(s=>(
          <motion.figure
            key={s.key}
            className="surface overflow-hidden"
            whileInView={prefersRM ? {} : { scale: 1.015 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <div className="relative" style={{aspectRatio:"2/1"}}>
              <img src={s.src} alt={s.title} className="absolute inset-0 w-full h-full object-contain bg-white"/>
            </div>
            <figcaption className="p-4">
              <div className="ts-h6 font-semibold">{s.title}</div>
              <div className="ts-h6 text-slate-700">{s.blurb}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

/* ---- Simple proof band (thin, understated) ---- */
function ProofBand(){
  return (
    <section className="container px-6 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric label="Avg. form uplift" value={34} suffix="%" />
        <Metric label="Projects delivered" value={200}/>
        <Metric label="Average build time" value={8} suffix=" days" />
      </div>
    </section>
  );
}

function Metric({ value, label, suffix="" }){
  const prefersRM = useReducedMotion();
  const [n,setN] = useState(0);
  useEffect(()=>{
    if (prefersRM) { setN(value); return; }
    let f = 0, id = setInterval(()=>{ f+=1; const t = Math.min(value, Math.round((f/28)*value)); setN(t); if (t>=value) clearInterval(id); }, 16);
    return ()=> clearInterval(id);
  },[value, prefersRM]);
  return (
    <div className="surface p-4">
      <div className="ts-h3 font-semibold" style={{color:"var(--accent)"}}>{n}{suffix}</div>
      <div className="ts-h6 text-slate-700">{label}</div>
    </div>
  );
}

/* ---- Contact ---- */
function ContactBlock(){
  return (
    <section id="contact" className="container px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 surface p-5">
          <h2 className="ts-h2 font-semibold">Let’s build ROI</h2>
          <p className="ts-h6 text-slate-700 mt-2">Tell us about your goals. We’ll reply quickly.</p>
          <div className="ts-h6 text-slate-700 mt-3">Oslo · New York · Amsterdam</div>
          <a href="mailto:contact@citeks.net" className="ts-h6 underline" style={{color:"var(--accent)"}}>contact@citeks.net</a>
        </div>
        <div className="lg:col-span-7"><ContactForm/></div>
      </div>
    </section>
  );
}

/* ================= CONTACT FORM ================= */
function ContactForm(){
  const [form, setForm] = useState({ title:"Mr", first:"", last:"", email:"", project:"", budget:"", message:"" });
  const [sent, setSent] = useState(false); const [errors, setErrors] = useState({});
  function v(){ const e={}; if(!form.first)e.first="Required"; if(!form.last)e.last="Required"; if(!/^\S+@\S+\.\S+$/.test(form.email)) e.email="Enter a valid email"; if(!form.project)e.project="Required"; if(!form.budget)e.budget="Required"; return e; }
  async function submit(e){ e.preventDefault(); const errs=v(); setErrors(errs); if(Object.keys(errs).length) return;
    try{ await fetch("/",{method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:encodeFormData({"form-name":"contact",...form})}); setSent(true);}catch{ alert("Submission failed. Please email contact@citeks.net");}
  }
  return (
    <form name="contact" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}
      className="surface p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        {errors.budget && <div className="ts-h6 text-red-600 mt-1">{errors.budget}</div>}
      </Field>
      <Area label="Message" val={form.message} set={v=>setForm({...form, message:v})} rows={5}/>
      <div className="md:col-span-2 flex items-center justify-between">
        <div className="ts-h6 text-slate-600">No spam. We reply within 24h.</div>
        <button className="btn btn-acc" type="submit"><Mail className="w-4 h-4"/> Send</button>
      </div>
      {sent && <div className="md:col-span-2 ts-h6 text-emerald-700">Thanks! Your message is in.</div>}
    </form>
  );
}

/* Field helpers */
function Field({label, children}){ return (<div><label className="ts-h6 block mb-1">{label}</label>{children}</div>); }
function Input({label, val, set, err, type="text"}){ return (
  <Field label={label}>
    <input type={type} value={val} onChange={e=>set(e.target.value)} className={cx("w-full bg-transparent border rounded-lg p-3", err?"border-red-500":"border-[var(--hair)]")}/>
    {err && <div className="ts-h6 text-red-600 mt-1">{err}</div>}
  </Field>
); }
function Area({label, val, set, rows=4}){ return (
  <div className="md:col-span-2"><label className="ts-h6 block mb-1">{label}</label>
    <textarea rows={rows} value={val} onChange={e=>set(e.target.value)} className="w-full bg-transparent border border-[var(--hair)] rounded-lg p-3"/>
  </div>
); }

/* ================= PROJECTS ================= */
function Projects(){
  return (
    <section className="container px-6 py-12 lg:py-16">
      <h1 className="ts-h1 font-semibold mb-4">Projects</h1>
      <div className="space-y-6">
        {showcase.map((s,i)=>(
          <article key={s.key} className="surface overflow-hidden">
            <div className="px-5 pt-5 flex items-center justify-between">
              <div className="ts-h6 font-semibold">{s.title}</div>
              <div className="ts-h6 text-slate-500">#{String(i+1).padStart(2,"0")}</div>
            </div>
            <div className="mt-3" style={{aspectRatio:"2/1"}}>
              <img src={s.src} alt={s.title} className="w-full h-full object-contain bg-white"/>
            </div>
            <p className="ts-h6 text-slate-700 p-5">{s.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= WHY US ================= */
function WhyUs(){
  const bullets = [
    ["Editorial bones", "Swiss grid with breathing room; proximity and alignment remove cognitive load."],
    ["Conversion core", "Single goal per page; optimized forms and clear pathways to action."],
    ["Search honest", "SEO embedded in IA, schema and performance—not bolted on later."],
    ["Run-light", "Fast stack, clean handover, and patterns you can extend without heavy dev cycles."],
  ];
  return (
    <section className="container px-6 py-12 lg:py-16">
      <h1 className="ts-h1 font-semibold mb-4">Why choose CITEKS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bullets.map(([t,d])=>(
          <div key={t} className="surface p-5">
            <div className="ts-h5 font-semibold">{t}</div>
            <div className="ts-h6 text-slate-700">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= BRIEF / PAY / THANK YOU ================= */
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
    <section className="container px-6 py-12 lg:py-16">
      <h1 className="ts-h2 font-semibold">{pkg.name} brief</h1>
      <p className="ts-h6 text-slate-700 mt-1">{pkg.displayPrice} · Typical timeline: {pkg.days} days (rush {pkg.rushDays} days +${pkg.rushFee})</p>
      <form name={`brief-${pkg.slug}`} data-netlify="true" netlify-honeypot="bot-field" encType="multipart/form-data" onSubmit={submit}
        className="surface p-5 grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
          <div className="ts-h6 text-slate-600 mt-1">Attach multiple files if needed.</div>
          {err.assetsNote && <div className="ts-h6 text-red-600 mt-1">{err.assetsNote}</div>}
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
          <div className="ts-h5 font-semibold" style={{color:"var(--accent)"}}>Total: ${total}</div>
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
    <section className="container px-6 py-12 lg:py-16">
      <h1 className="ts-h2 font-semibold">Payment</h1>
      <div className="surface p-5 mt-5">
        <div className="ts-h5 font-semibold">{pkg.name}</div>
        <div className="ts-h6 text-slate-700 mt-1">Base price {pkg.displayPrice}. Typical timeline {pkg.days} days.</div>

        <div className="flex items-center justify-between mt-3">
          <label className="ts-h6 flex items-center gap-2"><input type="checkbox" checked={rush} onChange={e=>setRush(e.target.checked)}/> Rush delivery: finish in {pkg.rushDays} days (+${pkg.rushFee})</label>
          <div className="ts-h4 font-semibold" style={{color:"var(--accent)"}}>Total: ${total}</div>
        </div>

        <div className="mt-5">{error && <div className="ts-h6 text-red-600 mb-3 whitespace-pre-wrap">{error}</div>}<div ref={containerRef} id="checkout" className="w-full"/></div>
        <div className="mt-3 ts-h6 text-slate-600">Secure payment powered by Stripe.</div>
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
      <p className="ts-h6 text-slate-700">We’ll email you shortly from <b>contact@citeks.net</b> with next steps.</p>
      {summary && (
        <div className="surface p-5 mt-5">
          <div className="ts-h5 font-semibold">Purchase summary</div>
          <div className="ts-h6 text-slate-800 mt-2 space-y-1">
            <div><b>Status:</b> {summary.payment_status}</div>
            <div><b>Transaction ID:</b> {summary.payment_intent_id || "—"}</div>
            <div><b>Package:</b> {summary.metadata?.package || "—"}</div>
            <div><b>Rush:</b> {summary.metadata?.rush === "true" ? "Yes":"No"}</div>
            <div><b>Total:</b> {niceTotal}</div>
          </div>
          <div className="ts-h6 text-slate-700 mt-3">Forgot something? Use the <a href="#/" onClick={(e)=>{e.preventDefault(); sessionStorage.setItem("scrollTo","contact"); navigate("/");}} className="underline">contact form</a> and include your Transaction ID.</div>
        </div>
      )}
      {error && <div className="ts-h6 text-red-600 mt-4">{error}</div>}
      <a href="#/" className="btn btn-acc mt-6">Back to home</a>
    </section>
  );
}

/* ================= FOOTER / STATIC ================= */
function Footer(){
  return (
    <footer className="hair mt-10">
      <div className="container px-6 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="ts-h6 text-slate-600">© {new Date().getFullYear()} CITEKS — Oslo · New York · Amsterdam</div>
        <div className="ts-h6"><a href="#/privacy" className="hover:opacity-80 mr-4">Privacy</a><a href="#/tech-terms" className="hover:opacity-80">Technical terms</a></div>
      </div>
    </footer>
  );
}

function PrivacyPolicy(){
  return (
    <section className="container px-6 py-16">
      <h1 className="ts-h1 font-semibold mb-4">Privacy Policy</h1>
      <div className="surface p-5 ts-h6 text-slate-800 space-y-3">
        <p><b>Who we are.</b> CITEKS builds fast, modern websites that convert. Contact: contact@citeks.net.</p>
        <p><b>What we collect.</b> Form/brief submissions (including uploads). No cookies.</p>
        <p><b>Use of data.</b> Replies, proposals, service delivery, payments (Stripe), compliance.</p>
        <p><b>Sharing.</b> Only with providers we use (Netlify, Stripe). We don’t sell personal data.</p>
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
      <div className="surface p-5">
        <ul className="ts-h6 text-slate-800 space-y-2">{rows.map(([t,d])=> <li key={t}><b>{t}:</b> {d}</li>)}</ul>
      </div>
      <a href="#/" className="btn btn-acc mt-6">Back to home</a>
    </section>
  );
}

/* Hidden Netlify form stubs (build detection) */
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
