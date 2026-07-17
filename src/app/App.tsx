import { useState, useRef, useEffect } from "react";
import { ArrowRight, Upload, Linkedin, ChevronDown, Check, Plus, Minus, Send } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "landing" | "intake" | "summary" | "paths" | "refine";

const TARGET_ROLES = [
  "Chief Product Officer",
  "VP of Engineering",
  "General Manager / BU Lead",
  "Founder / CEO",
  "Partner at a Venture Firm",
  "Principal / Staff Engineer",
  "Head of Design",
  "Chief of Staff",
  "Director of Strategy",
  "Independent Consultant",
  "Board Director",
  "Angel Investor",
];

const SUMMARY_SKILLS = [
  { label: "Product Strategy", strength: 92 },
  { label: "Cross-functional Leadership", strength: 88 },
  { label: "B2B Go-to-Market", strength: 75 },
  { label: "Data & Analytics", strength: 67 },
  { label: "Fundraising / Investor Relations", strength: 44 },
];

const PATHS = [
  {
    id: "operator",
    badge: "Highest fit",
    badgeColor: "#7ee8c8",
    title: "Executive Operator",
    subtitle: "GM → CPO → CEO track",
    narrative:
      "Your cross-functional history and product intuition make you a rare operator who can own both strategy and execution. The market is pricing this profile at a premium right now.",
    timeToTarget: "18–24 months",
    salaryRange: "$320k–$480k",
    equityRange: "0.5–2%",
    milestones: [
      { label: "Interim GM role at Series B", time: "0–6 mo" },
      { label: "First P&L ownership", time: "6–12 mo" },
      { label: "GM → CPO offer", time: "12–18 mo" },
      { label: "Target role", time: "18–24 mo" },
    ],
    skillGaps: [
      { label: "Financial modeling", severity: "high" },
      { label: "Board communication", severity: "medium" },
      { label: "Sales cycle ownership", severity: "low" },
    ],
    accentColor: "#7ee8c8",
  },
  {
    id: "venture",
    badge: "High fit",
    badgeColor: "#e8c86d",
    title: "Operator-to-Investor",
    subtitle: "Principal → Partner track",
    narrative:
      "Your pattern recognition across product cycles is exactly what early-stage funds are hiring for. You have the operator credibility that most investors lack.",
    timeToTarget: "24–36 months",
    salaryRange: "$250k–$400k + carry",
    equityRange: "Carry: 0.1–0.5%",
    milestones: [
      { label: "Angel 3–5 deals", time: "0–6 mo" },
      { label: "EIR at top-tier fund", time: "6–18 mo" },
      { label: "Principal offer", time: "18–24 mo" },
      { label: "Partner track begins", time: "24–36 mo" },
    ],
    skillGaps: [
      { label: "Portfolio construction", severity: "high" },
      { label: "LP relationships", severity: "high" },
      { label: "Deal sourcing network", severity: "medium" },
    ],
    accentColor: "#e8c86d",
  },
  {
    id: "founder",
    badge: "Strong fit",
    badgeColor: "#c87ee8",
    title: "Founder Path",
    subtitle: "Productized service → SaaS",
    narrative:
      "You have the domain expertise and the network to found in your current vertical. The window for your specific insight is 18–24 months before the space gets crowded.",
    timeToTarget: "12–18 months",
    salaryRange: "Founder salary: $150k–$220k",
    equityRange: "60–85% founder equity",
    milestones: [
      { label: "3 paying design partners", time: "0–3 mo" },
      { label: "Pre-seed ($500k–$1.5M)", time: "3–6 mo" },
      { label: "First hire + $1M ARR", time: "6–12 mo" },
      { label: "Seed round", time: "12–18 mo" },
    ],
    skillGaps: [
      { label: "Founder brand / content", severity: "medium" },
      { label: "Technical co-founder sourcing", severity: "medium" },
      { label: "Investor storytelling", severity: "low" },
    ],
    accentColor: "#c87ee8",
  },
];

const COACH_QUESTIONS = [
  "What originally drew you to product work — was it a specific moment, a person, or just where you ended up?",
  "Think about the last time you felt genuinely energized at work. What was actually happening in that moment?",
  "You're aiming for a senior executive role. What does that title mean to you beyond the compensation — what changes in your day-to-day?",
  "What's the story you tell yourself about why you haven't made this move yet? Be honest.",
  "When people in your network describe you to others, what do you think they actually say? And what do you wish they said?",
  "If you designed the first 90 days of your next role from scratch, what would need to be true for you to feel like you made the right call?",
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function severity(s: string) {
  if (s === "high") return { bg: "rgba(232,100,80,0.12)", color: "#e86450", label: "Gap" };
  if (s === "medium") return { bg: "rgba(232,200,109,0.12)", color: "#e8c86d", label: "Develop" };
  return { bg: "rgba(126,232,200,0.1)", color: "#7ee8c8", label: "Minor" };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ onBack, step }: { onBack?: () => void; step?: number }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(9,9,15,0.92)", backdropFilter: "blur(16px)" }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2.5 group"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#e8c86d" }}>
          <span style={{ fontSize: 10, color: "#09090f", fontWeight: 900 }}>T</span>
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: "#f0ede8" }}>Trajectory</span>
      </button>

      {step !== undefined && (
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="rounded-full transition-all duration-300"
              style={{
                width: s === step ? 24 : 6,
                height: 6,
                background: s === step ? "#e8c86d" : s < step ? "rgba(232,200,109,0.4)" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      )}

      <div style={{ width: 80 }} />
    </nav>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Nav />

      {/* Hero */}
      <section className="pt-40 pb-28 px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <p className="text-xs font-mono tracking-widest mb-8" style={{ color: "#8b8ba0", letterSpacing: "0.15em" }}>
              CAREER CLARITY PLATFORM
            </p>
            <h1
              className="text-6xl md:text-7xl font-black leading-[1.02] tracking-tight mb-8"
              style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}
            >
              Your career has
              <br />
              a story.
              <br />
              <em style={{ color: "#e8c86d", fontStyle: "italic" }}>Find it.</em>
            </h1>
            <p className="text-base leading-relaxed max-w-md mb-10" style={{ color: "#8b8ba0" }}>
              Trajectory surfaces the through-line in your work history, names your unique edge, and maps the
              specific steps to your next role.
            </p>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#e8c86d", color: "#09090f" }}
            >
              Map your trajectory
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Side stats */}
          <div className="hidden md:flex flex-col gap-px w-56" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
            {[
              { label: "Avg. time to offer", value: "11 weeks" },
              { label: "Salary increase", value: "+38%" },
              { label: "Paths mapped", value: "4,200+" },
            ].map((s, i) => (
              <div key={i} className="px-5 py-4" style={{ background: "#12121c" }}>
                <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>{s.value}</div>
                <div className="text-xs" style={{ color: "#8b8ba0" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline strip */}
      <section className="px-8 pb-28 max-w-5xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          <span className="text-xs font-mono" style={{ color: "#8b8ba0", letterSpacing: "0.12em" }}>HOW A TRAJECTORY UNFOLDS</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
        <div className="grid grid-cols-4 relative">
          <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-px" style={{ background: "linear-gradient(to right, #7ee8c8, #e8c86d, #c87ee8, #e8a07e)" }} />
          {[
            { phase: "Discovery", time: "Week 1–2", color: "#7ee8c8" },
            { phase: "Positioning", time: "Week 3–6", color: "#e8c86d" },
            { phase: "Momentum", time: "Month 2–4", color: "#c87ee8" },
            { phase: "Offer", time: "Month 3–6", color: "#e8a07e" },
          ].map((n, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center">
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center relative z-10" style={{ borderColor: n.color, background: "#09090f" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: n.color }} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: "#f0ede8" }}>{n.phase}</div>
                <div className="text-xs font-mono" style={{ color: "#8b8ba0" }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Archetypes */}
      <section className="px-8 pb-28 max-w-5xl mx-auto">
        <p className="text-xs font-mono tracking-widest mb-10" style={{ color: "#8b8ba0", letterSpacing: "0.15em" }}>THREE PATH ARCHETYPES</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "The Deep Expert", color: "#7ee8c8", desc: "Mastery compounds. You become the person others call when nothing else works.", roles: ["Staff Eng", "Principal Scientist", "Domain Consultant"] },
            { title: "The Connector", color: "#c87ee8", desc: "Your edge is relationships and cross-domain pattern recognition.", roles: ["Chief of Staff", "Partnership Director", "VC Partner"] },
            { title: "The Reinventor", color: "#e8a07e", desc: "You see inflection points early. Pivoting is your compounding advantage.", roles: ["Founder", "Category Creator", "Emerging Tech Lead"] },
          ].map((a, i) => (
            <div key={i} className="p-6 rounded-xl" style={{ background: "#12121c", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-1.5 h-1.5 rounded-full mb-5" style={{ background: a.color }} />
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>{a.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#8b8ba0" }}>{a.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {a.roles.map((r) => (
                  <span key={r} className="text-xs px-2.5 py-1 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#8b8ba0" }}>{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 pb-32 max-w-5xl mx-auto">
        <div className="h-px mb-16" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Amara Osei", from: "Director of Product", to: "VC Partner", quote: "I'd been trying to explain my career for years. In one session I finally had the words. Two months later I had the offer." },
            { name: "Jun Watanabe", from: "Software Engineer", to: "Staff Eng → Founder", quote: "The timeline showed me I wasn't lost — I was three steps into a 10-year arc I just hadn't named yet." },
            { name: "Priya Sharma", from: "Consultant", to: "Domain Expert", quote: "My edge was always there. I just couldn't see it. Now I close at double the rate with half the pitching." },
          ].map((t, i) => (
            <div key={i}>
              <p className="text-base leading-relaxed mb-5 italic" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>"{t.quote}"</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8b8ba0" }}>{t.from} → {t.to}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="px-8 pb-16 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t pt-12" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div>
          <div className="font-bold text-lg mb-1" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>Ready to see your arc?</div>
          <div className="text-sm" style={{ color: "#8b8ba0" }}>Free — takes about 8 minutes.</div>
        </div>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "#e8c86d", color: "#09090f" }}
        >
          Get started
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 1: Intake ───────────────────────────────────────────────────────────

function Intake({ onNext }: { onNext: () => void }) {
  const [resumeDone, setResumeDone] = useState(false);
  const [linkedinDone, setLinkedinDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const canProceed = resumeDone || linkedinDone;

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Nav step={1} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-lg">
          <p className="text-xs font-mono tracking-widest mb-6" style={{ color: "#8b8ba0", letterSpacing: "0.15em" }}>STEP 1 OF 4</p>
          <h2 className="text-4xl font-black mb-3 leading-tight" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>
            Let's start with<br />your raw material.
          </h2>
          <p className="text-sm mb-10" style={{ color: "#8b8ba0" }}>
            Upload your resume or connect LinkedIn — we'll extract the signal from your history.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {/* Resume upload */}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={() => setResumeDone(true)} />
            <button
              onClick={() => { fileRef.current?.click(); setTimeout(() => setResumeDone(true), 200); }}
              className="flex items-center gap-4 px-6 py-5 rounded-xl text-left w-full transition-all"
              style={{
                background: resumeDone ? "rgba(126,232,200,0.08)" : "#12121c",
                border: `1px solid ${resumeDone ? "rgba(126,232,200,0.35)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: resumeDone ? "rgba(126,232,200,0.15)" : "rgba(255,255,255,0.05)" }}>
                {resumeDone ? <Check size={18} color="#7ee8c8" /> : <Upload size={18} color="#8b8ba0" />}
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: resumeDone ? "#7ee8c8" : "#f0ede8" }}>
                  {resumeDone ? "Resume uploaded" : "Upload your resume"}
                </div>
                <div className="text-xs" style={{ color: "#8b8ba0" }}>PDF, Word — any format works</div>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-xs font-mono" style={{ color: "#8b8ba0" }}>OR</span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* LinkedIn */}
            <button
              onClick={() => setLinkedinDone(true)}
              className="flex items-center gap-4 px-6 py-5 rounded-xl text-left w-full transition-all"
              style={{
                background: linkedinDone ? "rgba(126,232,200,0.08)" : "#12121c",
                border: `1px solid ${linkedinDone ? "rgba(126,232,200,0.35)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: linkedinDone ? "rgba(126,232,200,0.15)" : "rgba(255,255,255,0.05)" }}>
                {linkedinDone ? <Check size={18} color="#7ee8c8" /> : <Linkedin size={18} color="#8b8ba0" />}
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: linkedinDone ? "#7ee8c8" : "#f0ede8" }}>
                  {linkedinDone ? "LinkedIn connected" : "Connect LinkedIn"}
                </div>
                <div className="text-xs" style={{ color: "#8b8ba0" }}>We read your profile — we never post</div>
              </div>
            </button>
          </div>

          <button
            onClick={onNext}
            disabled={!canProceed}
            className="w-full py-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: canProceed ? "#e8c86d" : "rgba(255,255,255,0.05)",
              color: canProceed ? "#09090f" : "#8b8ba0",
              cursor: canProceed ? "pointer" : "not-allowed",
            }}
          >
            Analyze my background
            <ArrowRight size={14} />
          </button>

          <p className="text-center text-xs mt-4" style={{ color: "#8b8ba0" }}>
            Your data is never stored or shared. Ever.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Summary + Target Role ───────────────────────────────────────────

function Summary({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Nav step={2} />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <p className="text-xs font-mono tracking-widest mb-6" style={{ color: "#8b8ba0", letterSpacing: "0.15em" }}>STEP 2 OF 4</p>
        <h2 className="text-4xl font-black mb-2 leading-tight" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>
          Here's what we found.
        </h2>
        <p className="text-sm mb-10" style={{ color: "#8b8ba0" }}>Based on 12 years of work history across 4 companies.</p>

        {/* Summary card */}
        <div className="rounded-xl p-7 mb-4" style={{ background: "#12121c", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="font-bold text-lg mb-1" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>Marcus Reid</div>
              <div className="text-sm" style={{ color: "#8b8ba0" }}>Senior Product Manager → Lead PM, Series C SaaS</div>
            </div>
            <div className="text-xs font-mono px-3 py-1.5 rounded" style={{ background: "rgba(232,200,109,0.1)", color: "#e8c86d", border: "1px solid rgba(232,200,109,0.2)" }}>
              Connector archetype
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-7 italic" style={{ fontFamily: "Playfair Display, serif", color: "#c8c5be" }}>
            "Your edge is the combination of deep B2B product intuition with a demonstrated ability to align
            executive stakeholders under pressure. You've shipped in three different verticals — that breadth
            is rare and undervalued."
          </p>

          <div>
            <div className="text-xs font-mono mb-4" style={{ color: "#8b8ba0", letterSpacing: "0.1em" }}>SKILL PROFILE</div>
            <div className="flex flex-col gap-3">
              {SUMMARY_SKILLS.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm" style={{ color: "#f0ede8" }}>{s.label}</span>
                    <span className="text-xs font-mono" style={{ color: "#8b8ba0" }}>{s.strength}%</span>
                  </div>
                  <div className="h-1 rounded-full w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${s.strength}%`,
                        background: s.strength > 80 ? "#7ee8c8" : s.strength > 60 ? "#e8c86d" : "#c87ee8",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Target role selector */}
        <div className="rounded-xl p-7 mb-8" style={{ background: "#12121c", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="font-semibold text-base mb-1" style={{ color: "#f0ede8" }}>Where are you trying to go?</div>
          <p className="text-sm mb-5" style={{ color: "#8b8ba0" }}>Select the role or title that best represents your target.</p>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg text-sm transition-all"
              style={{
                background: selected ? "rgba(232,200,109,0.07)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${selected ? "rgba(232,200,109,0.3)" : "rgba(255,255,255,0.1)"}`,
                color: selected ? "#f0ede8" : "#8b8ba0",
              }}
            >
              <span>{selected || "Select a target role…"}</span>
              <ChevronDown size={15} style={{ color: "#8b8ba0", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {open && (
              <div
                className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden z-20"
                style={{ background: "#1a1a27", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
              >
                {TARGET_ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setSelected(r); setOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between"
                    style={{
                      color: selected === r ? "#e8c86d" : "#f0ede8",
                      background: selected === r ? "rgba(232,200,109,0.07)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (selected !== r) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (selected !== r) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {r}
                    {selected === r && <Check size={13} color="#e8c86d" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full py-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: selected ? "#e8c86d" : "rgba(255,255,255,0.05)",
            color: selected ? "#09090f" : "#8b8ba0",
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          Generate my path recommendations
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Path Recommendations ────────────────────────────────────────────

function Paths({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>("operator");

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Nav step={3} />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <p className="text-xs font-mono tracking-widest mb-6" style={{ color: "#8b8ba0", letterSpacing: "0.15em" }}>STEP 3 OF 4</p>
        <h2 className="text-4xl font-black mb-2 leading-tight" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>
          Three paths forward.
        </h2>
        <p className="text-sm mb-10" style={{ color: "#8b8ba0" }}>
          Each one is built from your actual history. Expand to see the full breakdown.
        </p>

        <div className="flex flex-col gap-4 mb-10">
          {PATHS.map((path) => {
            const isExpanded = expanded === path.id;
            const isSelected = selected === path.id;

            return (
              <div
                key={path.id}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: isSelected ? `${path.accentColor}08` : "#12121c",
                  border: `1px solid ${isSelected ? path.accentColor + "40" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {/* Header row */}
                <div className="flex items-center gap-4 px-6 py-5">
                  <button
                    onClick={() => setSelected(isSelected ? null : path.id)}
                    className="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: isSelected ? path.accentColor : "transparent",
                      borderColor: isSelected ? path.accentColor : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {isSelected && <Check size={11} color="#09090f" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: `${path.accentColor}15`, color: path.accentColor }}>
                        {path.badge}
                      </span>
                    </div>
                    <div className="font-bold text-base" style={{ fontFamily: "Playfair Display, serif", color: "#f0ede8" }}>{path.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#8b8ba0" }}>{path.subtitle}</div>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="font-semibold text-sm" style={{ color: "#f0ede8" }}>{path.salaryRange}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#8b8ba0" }}>{path.timeToTarget}</div>
                  </div>

                  <button
                    onClick={() => setExpanded(isExpanded ? null : path.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    {isExpanded ? <Minus size={14} color="#8b8ba0" /> : <Plus size={14} color="#8b8ba0" />}
                  </button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="pt-5 mb-6">
                      <p className="text-sm leading-relaxed italic" style={{ fontFamily: "Playfair Display, serif", color: "#c8c5be" }}>
                        {path.narrative}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Milestones */}
                      <div>
                        <div className="text-xs font-mono mb-3" style={{ color: "#8b8ba0", letterSpacing: "0.1em" }}>MILESTONE TIMELINE</div>
                        <div className="flex flex-col gap-0">
                          {path.milestones.map((m, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="flex flex-col items-center shrink-0 mt-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: path.accentColor }} />
                                {i < path.milestones.length - 1 && (
                                  <div className="w-px flex-1 mt-1 mb-1" style={{ background: "rgba(255,255,255,0.1)", minHeight: 20 }} />
                                )}
                              </div>
                              <div className="pb-4">
                                <div className="text-xs font-mono mb-0.5" style={{ color: "#8b8ba0" }}>{m.time}</div>
                                <div className="text-sm" style={{ color: "#f0ede8" }}>{m.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skill gaps */}
                      <div>
                        <div className="text-xs font-mono mb-3" style={{ color: "#8b8ba0", letterSpacing: "0.1em" }}>SKILL GAPS TO CLOSE</div>
                        <div className="flex flex-col gap-2">
                          {path.skillGaps.map((g, i) => {
                            const s = severity(g.severity);
                            return (
                              <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg">
                                <span className="text-sm" style={{ color: "#f0ede8" }}>{g.label}</span>
                                <span className="text-xs px-2.5 py-1 rounded font-mono" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 flex items-center gap-4 flex-wrap">
                          <div>
                            <div className="text-xs font-mono" style={{ color: "#8b8ba0" }}>EQUITY</div>
                            <div className="text-sm font-semibold mt-0.5" style={{ color: "#f0ede8" }}>{path.equityRange}</div>
                          </div>
                          <div>
                            <div className="text-xs font-mono" style={{ color: "#8b8ba0" }}>TIMELINE</div>
                            <div className="text-sm font-semibold mt-0.5" style={{ color: "#f0ede8" }}>{path.timeToTarget}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full py-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: selected ? "#e8c86d" : "rgba(255,255,255,0.05)",
            color: selected ? "#09090f" : "#8b8ba0",
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          Refine and sharpen this path
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Refine ───────────────────────────────────────────────────────────

type Message =
  | { role: "coach"; text: string }
  | { role: "user"; text: string; questionIndex: number };

function Refine() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "coach", text: COACH_QUESTIONS[0] },
  ]);
  const [draft, setDraft] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isCoachTyping]);

  function submit() {
    const text = draft.trim();
    if (!text || isCoachTyping) return;

    const next = currentQ + 1;
    setMessages((prev) => [...prev, { role: "user", text, questionIndex: currentQ }]);
    setDraft("");
    setCurrentQ(next);

    if (next >= COACH_QUESTIONS.length) {
      setDone(true);
      return;
    }

    setIsCoachTyping(true);
    setTimeout(() => {
      setIsCoachTyping(false);
      setMessages((prev) => [...prev, { role: "coach", text: COACH_QUESTIONS[next] }]);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }, 1200 + Math.random() * 600);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const progress = Math.round((currentQ / COACH_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Nav step={4} />

      {/* Progress bar */}
      <div className="fixed top-[65px] left-0 right-0 z-40 h-px" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${progress}%`, background: "#e8c86d" }}
        />
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-24 pb-4">
        <div className="flex items-center gap-3 py-5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(232,200,109,0.12)", border: "1px solid rgba(232,200,109,0.25)" }}>
            <span className="text-xs font-bold" style={{ color: "#e8c86d", fontFamily: "Playfair Display, serif" }}>C</span>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "#f0ede8" }}>Career Coach</div>
            <div className="text-xs" style={{ color: "#8b8ba0" }}>
              {done ? "Session complete" : `Question ${Math.min(currentQ + 1, COACH_QUESTIONS.length)} of ${COACH_QUESTIONS.length}`}
            </div>
          </div>
          <div className="ml-auto text-xs font-mono" style={{ color: "#8b8ba0" }}>REFINE & SHARPEN</div>
        </div>
        <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full px-6 pb-4">
        <div className="flex flex-col gap-6 py-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "coach" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(232,200,109,0.12)", border: "1px solid rgba(232,200,109,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#e8c86d", fontFamily: "Playfair Display, serif" }}>C</span>
                </div>
              )}

              <div
                className="max-w-[82%] px-5 py-4 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === "coach"
                    ? {
                        background: "#12121c",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "#f0ede8",
                        borderTopLeftRadius: 4,
                        fontFamily: "Playfair Display, serif",
                        fontSize: "0.95rem",
                      }
                    : {
                        background: "rgba(232,200,109,0.1)",
                        border: "1px solid rgba(232,200,109,0.18)",
                        color: "#f0ede8",
                        borderTopRightRadius: 4,
                      }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isCoachTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(232,200,109,0.12)", border: "1px solid rgba(232,200,109,0.2)" }}>
                <span className="text-xs font-bold" style={{ color: "#e8c86d", fontFamily: "Playfair Display, serif" }}>C</span>
              </div>
              <div className="px-5 py-4 rounded-2xl flex items-center gap-1.5" style={{ background: "#12121c", border: "1px solid rgba(255,255,255,0.07)", borderTopLeftRadius: 4 }}>
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#8b8ba0",
                      animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completion message */}
          {done && !isCoachTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(232,200,109,0.12)", border: "1px solid rgba(232,200,109,0.2)" }}>
                <span className="text-xs font-bold" style={{ color: "#e8c86d", fontFamily: "Playfair Display, serif" }}>C</span>
              </div>
              <div
                className="max-w-[82%] px-5 py-4 rounded-2xl text-sm leading-relaxed"
                style={{
                  background: "#12121c",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#f0ede8",
                  borderTopLeftRadius: 4,
                  fontFamily: "Playfair Display, serif",
                  fontSize: "0.95rem",
                }}
              >
                That's everything I need. You've given me a clear picture of what's driving this and what's
                been holding it back. I'll use this to sharpen your trajectory into a specific, honest plan.
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="max-w-2xl mx-auto w-full px-6 pb-10">
        <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.07)" }} />

        {done ? (
          <button
            className="w-full py-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "#e8c86d", color: "#09090f" }}
          >
            Generate my full trajectory plan
            <ArrowRight size={14} />
          </button>
        ) : (
          <div
            className="flex gap-3 rounded-xl p-3"
            style={{ background: "#12121c", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              disabled={isCoachTyping}
              placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
              rows={3}
              className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-[#8b8ba0] leading-relaxed"
              style={{ color: "#f0ede8" }}
            />
            <button
              onClick={submit}
              disabled={!draft.trim() || isCoachTyping}
              className="self-end w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all"
              style={{
                background: draft.trim() && !isCoachTyping ? "#e8c86d" : "rgba(255,255,255,0.06)",
                cursor: draft.trim() && !isCoachTyping ? "pointer" : "not-allowed",
              }}
            >
              <Send size={14} color={draft.trim() && !isCoachTyping ? "#09090f" : "#8b8ba0"} />
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-3" style={{ color: "#8b8ba0" }}>
          {done ? "You'll receive a personalized PDF roadmap and positioning brief." : "Your responses are private and used only to build your plan."}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  return (
    <>
      {screen === "landing" && <Landing onStart={() => setScreen("intake")} />}
      {screen === "intake" && <Intake onNext={() => setScreen("summary")} />}
      {screen === "summary" && <Summary onNext={() => setScreen("paths")} />}
      {screen === "paths" && <Paths onNext={() => setScreen("refine")} />}
      {screen === "refine" && <Refine />}
    </>
  );
}
