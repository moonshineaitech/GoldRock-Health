import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Scale,
  Sparkles,
  Lock,
  Trash2,
  Check,
  Plus,
  Minus,
  Upload,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

import heroImg from "@assets/generated_images/atelier_hero.png";
import reviewImg from "@assets/generated_images/atelier_review.png";
import trustImg from "@assets/generated_images/atelier_trust.png";
import ctaImg from "@assets/generated_images/atelier_cta.png";

const GOLD_FILL = {
  background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))",
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs uppercase tracking-[0.28em] font-medium"
      style={{ color: "var(--gold)" }}
    >
      {children}
    </span>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={GOLD_FILL}
      />
      <span className="font-serif text-xl tracking-tight text-foreground">
        GoldRock
      </span>
    </Link>
  );
}

const steps = [
  {
    icon: Upload,
    title: "Share your bill",
    body: "Snap a photo, upload a PDF, or type the details. Your information is encrypted the moment it arrives.",
  },
  {
    icon: FileSearch,
    title: "AI finds the issues",
    body: "We read every line — flagging duplicate charges, upcoding, and prices far above fair rates.",
  },
  {
    icon: Scale,
    title: "We help you dispute",
    body: "Get a ready-to-send dispute letter, a phone script, and a clear plan to bring the bill down.",
  },
];

const features = [
  {
    icon: FileSearch,
    title: "Line-by-line analysis",
    body: "Every charge categorized and checked against fair-market and Medicare rates to surface overcharges.",
  },
  {
    icon: Scale,
    title: "Dispute letters & scripts",
    body: "Legally-grounded letters and call scripts generated for your exact situation — no blank page.",
  },
  {
    icon: Sparkles,
    title: "Plain-English summaries",
    body: "Confusing codes and jargon translated into language that actually tells you what you're paying for.",
  },
  {
    icon: ShieldCheck,
    title: "Secure document vault",
    body: "Keep bills, EOBs, and letters in one encrypted place — organized and ready when you need them.",
  },
];

const trustPoints = [
  { icon: Lock, label: "Bank-level encryption, in transit and at rest" },
  { icon: ShieldCheck, label: "Personal details stripped before any AI review" },
  { icon: Trash2, label: "Your data, deleted on your schedule" },
];

const plans = [
  {
    name: "Monthly",
    price: "$24.99",
    cadence: "per month",
    blurb: "Full access, billed monthly. Cancel anytime.",
    features: ["Unlimited bill analysis", "Dispute letters & scripts", "Document vault"],
    featured: false,
  },
  {
    name: "Annual",
    price: "$249.99",
    cadence: "per year",
    blurb: "Two months free versus monthly. Our most popular plan.",
    features: [
      "Everything in Monthly",
      "Priority AI analysis",
      "Savings tracking dashboard",
    ],
    featured: true,
  },
  {
    name: "Lifetime",
    price: "One-time",
    cadence: "web only",
    blurb: "Pay once, keep access for good. Available on the web.",
    features: ["Everything in Annual", "All future features", "No recurring billing"],
    featured: false,
  },
];

const faqs = [
  {
    q: "How does GoldRock find overcharges?",
    a: "Our AI reads each line of your bill, identifies the procedure and billing codes, and compares the charges against fair-market and Medicare reference rates. It flags duplicates, upcoding, and anything priced well above the norm.",
  },
  {
    q: "Is my medical information safe?",
    a: "Yes. Everything is encrypted in transit and at rest. Before any bill is sent for AI review, we strip out identifying details like your name, address, and member ID — only the billing codes and amounts are analyzed.",
  },
  {
    q: "Do you guarantee savings?",
    a: "We can't promise a specific dollar amount — every bill is different. What we promise is a thorough review, clear explanations, and the exact tools to dispute charges that don't look right.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Monthly and annual plans can be cancelled whenever you like, and you keep access through the end of your billing period.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        data-testid={`button-faq-${index}`}
      >
        <span className="font-serif text-lg text-foreground">{q}</span>
        <span className="shrink-0 text-muted-foreground">
          {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-muted-foreground leading-relaxed pb-5 max-w-2xl"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-border bg-card shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Wordmark />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/login"
              className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-signin"
            >
              Sign in
            </a>
            <a
              href="/api/login"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm hover:-translate-y-0.5 transition-transform"
              style={GOLD_FILL}
              data-testid="button-get-started-nav"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease }}>
            <Kicker>AI medical bill advocate</Kicker>
            <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              Stop overpaying for
              <span className="block" style={{ color: "var(--gold-deep)" }}>
                medical care.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
              GoldRock reads your medical bills the way an expert advocate would —
              finding the errors and overcharges hospitals hope you'll miss, then
              handing you everything you need to fight them.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="/api/login"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-white shadow-md hover:-translate-y-0.5 transition-transform"
                style={GOLD_FILL}
                data-testid="button-get-started-hero"
              >
                Analyze my bill <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-medium bg-card border border-border text-foreground hover:bg-secondary transition-colors"
                data-testid="button-how-hero"
              >
                See how it works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" style={{ color: "var(--gold)" }} />
                HIPAA-aligned
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: "var(--gold)" }} />
                Encrypted end to end
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden luxury-card">
              <img
                src={heroImg}
                alt="Medical paperwork reviewed on a warm desk"
                className="w-full h-full object-cover aspect-[3/4]"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 sm:-left-8 max-w-[15rem] luxury-card p-4 hidden sm:block">
              <div className="flex items-center gap-3">
                <span
                  className="grid place-items-center w-10 h-10 rounded-xl text-white shrink-0"
                  style={GOLD_FILL}
                >
                  <FileSearch className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Every line checked</p>
                  <p className="text-xs text-muted-foreground">Against fair-market rates</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 grid sm:grid-cols-3 gap-5">
          {trustPoints.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
              <Icon className="w-5 h-5 shrink-0" style={{ color: "var(--gold)" }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5, ease }} className="max-w-2xl">
            <Kicker>How it works</Kicker>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
              Three steps from confusion to clarity
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              No jargon, no guesswork. Just a clear path from a bill you don't
              understand to one you can confidently challenge.
            </p>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                {...fadeUp}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="luxury-card p-7"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid place-items-center w-12 h-12 rounded-xl bg-secondary text-foreground"
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  </span>
                  <span className="font-serif text-3xl text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-xl">{title}</h3>
                <p className="mt-2.5 text-muted-foreground leading-relaxed text-sm">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="order-2 lg:order-1 rounded-2xl overflow-hidden luxury-card"
          >
            <img
              src={reviewImg}
              alt="Reviewing a medical bill"
              className="w-full object-cover aspect-[4/3]"
            />
          </motion.div>

          <div className="order-1 lg:order-2">
            <motion.div {...fadeUp} transition={{ duration: 0.5, ease }}>
              <Kicker>What you get</Kicker>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
                An expert in your corner
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
                Everything a professional bill advocate would do — available the
                moment you need it.
              </p>
            </motion.div>

            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {features.map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp}
                  transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                >
                  <span
                    className="grid place-items-center w-11 h-11 rounded-xl bg-secondary"
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  </span>
                  <h3 className="mt-4 font-medium text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, ease }}>
              <Kicker>Privacy first</Kicker>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
                Your health data, treated like it's our own
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
                Sensitive details never reach our AI partners. We anonymize every
                document, encrypt everything, and let you delete your data whenever
                you choose.
              </p>
            </motion.div>
            <div className="mt-8 space-y-4">
              {[
                { icon: Lock, t: "Encrypted everywhere", d: "TLS 1.3 in transit, AES-256 at rest." },
                { icon: ShieldCheck, t: "Anonymized for AI", d: "Names, IDs, and addresses stripped before analysis." },
                { icon: Trash2, t: "Deleted on your terms", d: "Old bills and chats auto-clear on a schedule you control." },
              ].map(({ icon: Icon, t, d }) => (
                <motion.div
                  key={t}
                  {...fadeUp}
                  transition={{ duration: 0.45, ease }}
                  className="flex items-start gap-4"
                >
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-secondary shrink-0">
                    <Icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{t}</p>
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="rounded-2xl overflow-hidden luxury-card"
          >
            <img
              src={trustImg}
              alt="Secure document storage"
              className="w-full object-cover aspect-[4/3]"
            />
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5, ease }} className="text-center max-w-2xl mx-auto">
            <Kicker>Pricing</Kicker>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
              Simple plans, real advocacy
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              One membership covers every bill, every dispute, every tool.
            </p>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                {...fadeUp}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="luxury-card p-7 flex flex-col"
                style={plan.featured ? { borderColor: "var(--gold)", borderWidth: 2 } : undefined}
              >
                {plan.featured && (
                  <span
                    className="self-start mb-4 rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={GOLD_FILL}
                  >
                    Most popular
                  </span>
                )}
                <h3 className="font-serif text-2xl">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.blurb}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/api/login"
                  className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                    plan.featured
                      ? "text-white shadow-md"
                      : "bg-primary text-primary-foreground"
                  }`}
                  style={plan.featured ? GOLD_FILL : undefined}
                  data-testid={`button-choose-${plan.name.toLowerCase()}`}
                >
                  Get started <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5, ease }}>
            <Kicker>Questions</Kicker>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
              Good to know
            </h2>
          </motion.div>
          <div className="mt-10">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-6xl mx-auto relative rounded-3xl overflow-hidden">
          <img src={ctaImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(120deg, hsla(30,20%,12%,0.78), hsla(30,20%,12%,0.45))" }}
          />
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-white max-w-2xl mx-auto leading-tight">
              The next bill that arrives, send it to us first.
            </h2>
            <p className="mt-5 text-white/80 max-w-xl mx-auto">
              Find out what you really owe — and what you don't — in minutes.
            </p>
            <a
              href="/api/login"
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium bg-white text-neutral-900 shadow-lg hover:-translate-y-0.5 transition-transform"
              data-testid="button-get-started-cta"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Wordmark />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              AI-powered medical bill advocacy. Built to find every overcharge and
              help you fight back.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#how" className="text-foreground hover:opacity-70 transition-opacity">How it works</a></li>
              <li><a href="#features" className="text-foreground hover:opacity-70 transition-opacity">Features</a></li>
              <li><a href="#pricing" className="text-foreground hover:opacity-70 transition-opacity">Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="text-foreground hover:opacity-70 transition-opacity">About</Link></li>
              <li><Link href="/data-security" className="text-foreground hover:opacity-70 transition-opacity">Security</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="mailto:CONTACT@GOLDROCK.ai" className="text-foreground hover:opacity-70 transition-opacity">
                  CONTACT@GOLDROCK.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} GoldRock Health. All rights reserved.</p>
            <p className="inline-flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
              Built for patients, not hospitals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
