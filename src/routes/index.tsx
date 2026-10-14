import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { learning, nav, profile, projects, skills } from "@/data/profile";
import { Backdrop, BootScreen, Magnetic, Navbar, OrbCursor, Reveal, scrollToId, SectionHead, Tilt, useEnv } from "@/components/space/Chrome";

const CoreScene = lazy(() => import("@/components/space/Scenes").then((m) => ({ default: m.CoreScene })));

const title = "Yash Agrawal | Aspiring Full Stack Developer";
const description =
  "Explore the portfolio of Yash Agrawal, a B.Tech student at JECRC University interested in web development, programming, and artificial intelligence.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          email: `mailto:${profile.email}`,
          alumniOf: { "@type": "CollegeOrUniversity", name: "JECRC University" },
          knowsAbout: ["Web development", "Programming", "Artificial intelligence"],
        }),
      },
    ],
  }),
  component: Index,
});

const primaryBtn = "bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_var(--primary)] hover:shadow-[0_14px_40px_-8px_var(--cyan)]";
const ghostBtn = "glass text-foreground hover:bg-accent";

function Index() {
  const env = useEnv();
  const [booted, setBooted] = useState(false);
  const done = useCallback(() => setBooted(true), []);

  useEffect(() => {
    if (!env.ready || env.reduced) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.09 });
      (window as unknown as { __lenis: unknown }).__lenis = lenis;
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, [env.ready, env.reduced]);

  return (
    <>
      <AnimatePresence>{env.ready && !booted && <BootScreen onDone={done} reduced={env.reduced} />}</AnimatePresence>
      <Backdrop webgl={env.webgl} lite={env.lite} reduced={env.reduced} />
      {env.fine && !env.reduced && <OrbCursor />}
      <Navbar />
      <main>
        <Hero env={env} />
        <About />
        <Skills />
        <div className="zone-dark">
          <Projects />
          <Experience />
          <Certifications />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}

function RoleCycler() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-8 overflow-hidden align-bottom" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-core font-semibold">
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero({ env }: { env: ReturnType<typeof useEnv> }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10">
          <Reveal><p className="eyebrow">Second-year B.Tech · JECRC University</p></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9]">
              YASH<br /><span className="text-core">AGRAWAL</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}><p className="mt-6 text-lg md:text-xl"><RoleCycler /></p></Reveal>
          <Reveal delay={0.3}><p className="mt-5 max-w-lg text-muted-foreground">{profile.heroDescription}</p></Reveal>
          <Reveal delay={0.4} className="mt-9 flex flex-wrap gap-3">
            <Magnetic className={primaryBtn} onClick={() => scrollToId("projects")}>Explore My Projects →</Magnetic>
            {profile.resumeUrl && <Magnetic className={ghostBtn} href={profile.resumeUrl}>Download Resume</Magnetic>}
            <Magnetic className={ghostBtn} onClick={() => scrollToId("contact")}>Contact Me</Magnetic>
          </Reveal>
        </div>
        <div className="relative aspect-square w-full max-w-[560px] justify-self-center" aria-hidden>
          <div className="absolute inset-[15%] rounded-full bg-core opacity-30 blur-[80px]" />
          {env.ready && env.webgl ? (
            <Suspense fallback={<CoreFallback />}><CoreScene lite={env.lite} /></Suspense>
          ) : (
            <CoreFallback />
          )}
        </div>
      </div>
      <button onClick={() => scrollToId("about")} aria-label="Scroll to About" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="eyebrow">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-border"><motion.span className="block h-4 w-px bg-primary" animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} /></span>
      </button>
    </section>
  );
}

function CoreFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-1/2 w-1/2 rounded-full bg-core opacity-70 blur-sm" />
      <div className="absolute h-3/4 w-3/4 rounded-full border border-primary/30" />
    </div>
  );
}

function About() {
  return (
    <section id="about" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="01 — About" title="Beyond the Code" />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Tilt className="glass rounded-3xl p-8 md:p-10">
            {profile.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}><p className={`${i === 0 ? "text-xl text-foreground" : "mt-5 text-muted-foreground"} leading-relaxed`}>{p}</p></Reveal>
            ))}
          </Tilt>
          <Reveal delay={0.15} className="glass rounded-3xl p-8">
            <p className="eyebrow mb-6">Identity Panel</p>
            <dl className="space-y-4">
              {profile.facts.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0">
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="02 — Skills" title="A constellation in progress" sub="Each planet is a skill I've worked with. A ring marks the ones I'm actively learning right now." />
        <ul className="flex flex-wrap justify-center gap-5">
          {skills.map((s, i) => {
            const size = 96 + (i % 4) * 14;
            return (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.05, type: "spring", stiffness: 120, damping: 14 }}
                whileHover={{ scale: 1.08, y: -6 }}
                animate={{ y: [0, -6, 0] }}
                className="group relative"
              >
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5 + (i % 5), ease: "easeInOut" }}
                  className="glass relative flex flex-col items-center justify-center rounded-full p-3 text-center"
                  style={{ width: size, height: size }}>
                  <span className="absolute inset-2 rounded-full bg-core opacity-10 transition-opacity group-hover:opacity-30" />
                  {s.learning && <span className="absolute -inset-2 rounded-full border border-dashed border-cyan/60 animate-[spin_18s_linear_infinite]" />}
                  <span className="relative text-xs font-semibold leading-tight">{s.name}</span>
                  <span className="relative mt-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{s.learning ? "Learning" : s.group}</span>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const statusStyle: Record<string, string> = {
  "In Development": "border-cyan text-cyan",
  Completed: "border-success text-success",
  Concept: "border-violet text-violet",
};

function Projects() {
  return (
    <section id="projects" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="03 — Projects" title="Missions logged" sub="Personal and concept projects. Code and live links will appear here as they're published." />
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <Tilt className="glass group h-full rounded-3xl p-7">
                <div className="relative mb-8 flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
                  <motion.div className="h-20 w-20 rounded-full bg-core opacity-70 blur-[2px]" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 14 + i * 4, ease: "linear" }} style={{ borderRadius: ["50%", "40% 60% 55% 45%", "50%"][i] }} />
                  <div className="absolute h-28 w-28 rounded-full border border-border" />
                  <span className="absolute left-4 top-4 font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <span className={`inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${statusStyle[p.status]}`}>{p.status}</span>
                <h3 className="mt-4 text-xl font-bold">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((t) => <li key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t}</li>)}
                </ul>
                {(p.github || p.demo) && (
                  <div className="mt-6 flex gap-4 text-sm">
                    {p.github && <a className="underline-offset-4 hover:underline" href={p.github} target="_blank" rel="noreferrer">Source code</a>}
                    {p.demo && <a className="underline-offset-4 hover:underline" href={p.demo} target="_blank" rel="noreferrer">Live demo</a>}
                  </div>
                )}
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="04 — Education & Learning" title="The journey so far" sub="No professional roles yet — here's where I'm learning and what I'm learning." />
        <div className="grid gap-10 lg:grid-cols-2">
          <ol className="relative border-l border-border pl-8">
            <Reveal>
              <li>
                <span className="absolute -left-[7px] mt-2 h-3.5 w-3.5 rounded-full bg-cyan shadow-[0_0_20px_var(--cyan)]" />
                <div className="glass rounded-3xl p-7">
                  <p className="eyebrow">Currently · Second Year</p>
                  <h3 className="mt-3 text-2xl font-bold">JECRC University</h3>
                  <p className="mt-1 text-muted-foreground">Bachelor of Technology (B.Tech)</p>
                  <p className="mt-6 font-mono text-sm">CGPA <span className="ml-2 text-3xl font-bold text-core">8.0</span></p>
                </div>
              </li>
            </Reveal>
          </ol>
          <div>
            <p className="eyebrow mb-5">Areas of learning</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {learning.map((l, i) => (
                <Reveal key={l} delay={i * 0.06}>
                  <li className="glass flex items-center gap-3 rounded-2xl px-5 py-4 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{l}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="05 — Certifications" title="Coming into orbit" />
        <Reveal className="glass flex flex-col items-start gap-3 rounded-3xl p-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-muted-foreground">No certifications to show yet. As I complete courses and earn credentials, they'll be listed here.</p>
          <span className="font-mono text-xs uppercase tracking-widest text-cyan">Status · Pending</span>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({});
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<"name" | "email" | "message", string>> = {};
    if (form.name.trim().length < 2) err.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10) err.message = "Message should be at least 10 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`);
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio message from ${form.name.trim()}`)}&body=${body}`;
    setSent(true);
  };
  const field = "mt-2 w-full rounded-2xl border border-input bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none";
  return (
    <section id="contact" className="px-6 py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="06 — Contact" title="Open a channel" sub="Have an idea, opportunity, or just want to say hi? I'd love to hear from you." />
          <a href={`mailto:${profile.email}`} className="text-core font-display text-2xl font-bold md:text-3xl">{profile.email}</a>
          <p className="mt-3 text-sm text-muted-foreground">Based in {profile.location}</p>
        </div>
        <Reveal>
          <form noValidate onSubmit={submit} className="glass space-y-5 rounded-3xl p-8">
            {(["name", "email"] as const).map((k) => (
              <div key={k}>
                <label htmlFor={k} className="text-sm font-medium capitalize">{k}</label>
                <input id={k} type={k === "email" ? "email" : "text"} maxLength={k === "email" ? 255 : 100} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} className={field} />
                {errors[k] && <p id={`${k}-err`} className="mt-1.5 text-sm text-destructive">⚠ {errors[k]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" rows={5} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} className={field} />
              {errors.message && <p id="message-err" className="mt-1.5 text-sm text-destructive">⚠ {errors.message}</p>}
            </div>
            <Magnetic type="submit" className={`${primaryBtn} w-full`}>Send via email app →</Magnetic>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {sent ? "✓ Your email app should open with the message ready to send." : "This opens your email app with the message pre-filled."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const socials = Object.entries(profile.socials).filter(([, url]) => url);
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl font-bold">Yash Agrawal<span className="text-core">.</span></p>
          <p className="mt-2 text-muted-foreground">{profile.footerTagline}</p>
          <a href={`mailto:${profile.email}`} className="mt-4 inline-block text-sm hover:text-primary">{profile.email}</a>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-4 text-sm">
              {socials.map(([k, url]) => <li key={k}><a href={url} target="_blank" rel="noreferrer" className="capitalize hover:text-primary">{k}</a></li>)}
            </ul>
          )}
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {nav.map(([id, label]) => <li key={id}><button onClick={() => scrollToId(id)} className="hover:text-foreground">{label}</button></li>)}
          </ul>
          <p className="mt-6 font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} Yash Agrawal</p>
        </nav>
      </div>
    </footer>
  );
}
