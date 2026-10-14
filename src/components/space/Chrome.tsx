import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { nav } from "@/data/profile";

const StarScene = lazy(() => import("./Scenes").then((m) => ({ default: m.StarScene })));

export function useEnv() {
  const [env, setEnv] = useState({ ready: false, reduced: false, lite: false, fine: false, webgl: true });
  useEffect(() => {
    const c = document.createElement("canvas");
    const webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    setEnv({
      ready: true,
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      lite: innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4,
      fine: matchMedia("(hover: hover) and (pointer: fine)").matches,
      webgl,
    });
  }, []);
  return env;
}

export function Backdrop({ webgl, lite, reduced }: { webgl: boolean; lite: boolean; reduced: boolean }) {
  const { scrollYProgress } = useScroll();
  const bg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.32, 0.5, 0.7, 1],
    ["var(--space-ivory)", "var(--space-silver)", "var(--space-sky)", "var(--space-navy)", "var(--space-deep)", "var(--space-black)"],
  );
  const starOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0.15, 1]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <motion.div className="absolute inset-0" style={{ background: bg }} />
      <div className="absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full bg-cyan opacity-20 blur-[140px]" />
      <div className="absolute -right-1/4 bottom-0 h-[60vh] w-[60vw] rounded-full bg-violet opacity-15 blur-[160px]" />
      {webgl && !reduced && (
        <motion.div className="absolute inset-0" style={{ opacity: starOpacity }}>
          <Suspense fallback={null}>
            <StarScene lite={lite} />
          </Suspense>
        </motion.div>
      )}
    </div>
  );
}

export function OrbCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 });
  const tx = useSpring(x, { stiffness: 80, damping: 20 });
  const ty = useSpring(y, { stiffness: 80, damping: 20 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add("has-orb-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!(e.target as HTMLElement)?.closest("a,button,input,textarea,[data-magnetic]"));
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-orb-cursor");
    };
  }, [x, y]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan opacity-25 blur-md" style={{ left: tx, top: ty }} />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan bg-glass backdrop-blur-sm"
        style={{ left: sx, top: sy }}
        animate={{ width: big ? 44 : 14, height: big ? 44 : 14 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <motion.span className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-primary" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ originX: "-6px" }} />
      </motion.div>
    </div>
  );
}

const diagnostics = ["Initializing AI core", "Calibrating star map", "Warming particle engines", "Systems nominal"];

export function BootScreen({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (reduced) return onDone();
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / 1300) * 100);
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduced]);
  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.04 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-24 w-24">
        <motion.div className="absolute inset-0 rounded-full border border-primary/40" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ borderTopColor: "var(--cyan)" }} />
        <div className="absolute inset-6 rounded-full bg-core opacity-80 blur-[2px]" />
        <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-primary-foreground">YA</span>
      </div>
      <p className="mt-8 font-mono text-4xl tabular-nums text-foreground">{Math.round(pct)}%</p>
      <p className="eyebrow mt-3 h-4">{diagnostics[Math.min(3, Math.floor(pct / 26))]}</p>
      <div className="mt-6 h-px w-48 overflow-hidden bg-border">
        <div className="h-full bg-core" style={{ width: `${pct}%` }} />
      </div>
    </motion.div>
  );
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (e: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -20 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const p = document.getElementById("projects");
      setDark(!!p && p.getBoundingClientRect().top < 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);
  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 text-foreground ${dark ? "zone-dark" : ""}`}>
      <nav
        aria-label="Primary"
        className={`glass flex w-full max-w-5xl items-center justify-between rounded-full transition-all duration-500 ${scrolled ? "px-4 py-2" : "px-6 py-3"}`}
       
      >
        <button onClick={() => go("home")} className="font-display text-base font-bold tracking-tight">
          Yash<span className="text-core">.</span>
        </button>
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map(([id, label]) => (
            <li key={id}>
              <button onClick={() => go(id)} aria-current={active === id ? "true" : undefined} className="relative rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground">
                {active === id && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                {label}
              </button>
            </li>
          ))}
        </ul>
        <button className="lg:hidden rounded-full px-3 py-1.5 text-sm" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul id="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass absolute top-16 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-popover p-3 lg:hidden">
            {nav.map(([id, label]) => (
              <li key={id}>
                <button onClick={() => go(id)} className="w-full rounded-xl px-4 py-3 text-left text-popover-foreground hover:bg-accent">{label}</button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Magnetic({ children, className = "", ...rest }: { children: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 15 });
  const y = useSpring(0, { stiffness: 250, damping: 15 });
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-shadow ${className}`;
  if (rest.href) {
    return (
      <motion.a ref={ref as React.Ref<HTMLAnchorElement>} href={rest.href} download data-magnetic onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} className={cls}>
        {children}
      </motion.a>
    );
  }
  const { onClick, type, disabled } = rest;
  return (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} type={type} disabled={disabled} onClick={onClick} data-magnetic onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} whileTap={{ scale: 0.96 }} className={cls}>
      {children}
    </motion.button>
  );
}

export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-bold md:text-6xl">{title}</h2>
      {sub && <p className="mt-5 text-lg text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

