import { useState, useRef } from "react";

/* ── Bengali numerals ─────────────────────────────────────── */
const bn = (n) => String(n).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
const OPTS = ["ক", "খ", "গ", "ঘ", "ঙ"];

/* ── Theme ────────────────────────────────────────────────── */
const T = {
  ink: "#0d1b2a", navy: "#1b3a5c", blue: "#1a6fa8", sky: "#2196f3",
  gold: "#f5a623", goldL: "#ffd166",
  ok: "#16a34a", err: "#dc2626",
  bg: "#eef2f7", card: "#fff", border: "#d0dce8", muted: "#64748b",
  manual: "#7c3aed", manualL: "#a78bfa",
  ai: "#0d7377", aiL: "#14a085",
};

/* ── Bubble ───────────────────────────────────────────────── */
function Bubble({ label, state, onClick }) {
  const S = {
    empty:   { bg: "transparent", bd: "#99b4cc", cl: T.navy },
    filled:  { bg: T.blue,        bd: T.blue,    cl: "#fff" },
    correct: { bg: T.ok,          bd: T.ok,      cl: "#fff" },
    wrong:   { bg: T.err,         bd: T.err,     cl: "#fff" },
    missed:  { bg: "#dcfce7",     bd: T.ok,      cl: T.ok  },
  }[state] || { bg: "transparent", bd: "#99b4cc", cl: T.navy };
  return (
    <button onClick={onClick} style={{
      width: 33, height: 33, borderRadius: "50%",
      border: `2.5px solid ${S.bd}`, background: S.bg, color: S.cl,
      fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: onClick ? "pointer" : "default", outline: "none", flexShrink: 0,
      transition: "all .15s",
    }}>{label}</button>
  );
}

/* ── OMR Row ──────────────────────────────────────────────── */
function OmrRow({ qNum, optCount, selected, onChange, correctAns, showResult, highlight }) {
  const getState = (i) => {
    if (!showResult) return selected === i ? "filled" : "empty";
    if (selected === i && i === correctAns) return "correct";
    if (selected === i && i !== correctAns) return "wrong";
    if (i === correctAns) return "missed";
    return "empty";
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 10px",
      background: highlight ? "#fefce8" : qNum % 2 === 0 ? "#f6faff" : "#fff",
      borderLeft: highlight ? `3px solid ${T.gold}` : "3px solid transparent",
    }}>
      <span style={{
        minWidth: 28, textAlign: "right",
        fontFamily: "'Noto Serif Bengali',serif",
        fontSize: 12, color: T.muted, fontWeight: 700,
      }}>{bn(qNum)}</span>
      <div style={{ display: "flex", gap: 5 }}>
        {Array.from({ length: optCount }, (_, i) => (
          <Bubble key={i} label={OPTS[i]} state={getState(i)}
            onClick={onChange ? () => onChange(selected === i ? -1 : i) : undefined}
          />
        ))}
      </div>
      {showResult && (
        <span style={{ fontSize: 15, marginLeft: 2 }}>
          {selected === correctAns ? "✅" : selected === -1 ? "⭕" : "❌"}
        </span>
      )}
    </div>
  );
}

/* ── Step Bar ─────────────────────────────────────────────── */
function StepBar({ screen }) {
  const steps = ["সেটআপ", "উত্তরপত্র", "শিক্ষার্থী", "ফলাফল"];
  const idx = { setup: 0, answerkey: 1, student: 2, results: 3, detail: 3 }[screen] ?? 0;
  return (
    <div style={{ display: "flex", gap: 0, paddingBottom: 14 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{
            width: "100%", height: 3, borderRadius: 3,
            background: i <= idx ? T.gold : "rgba(255,255,255,.2)",
            transition: "background .35s",
          }} />
          <span style={{
            fontFamily: "'Noto Serif Bengali',serif", fontSize: 10,
            color: i <= idx ? T.goldL : "rgba(255,255,255,.35)",
            fontWeight: i === idx ? 800 : 400,
          }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCREEN 1 — Setup
════════════════════════════════════════════════════════════ */
function SetupScreen({ cfg, setCfg, onNext }) {
  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.navy, fontSize: 19, marginBottom: 20 }}>
        ⚙️ পরীক্ষার তথ্য সেটআপ
      </h2>

      {[
        { label: "মোট প্রশ্ন সংখ্যা",      key: "totalQ", min: 5,  max: 100, suffix: "টি" },
        { label: "বিকল্প সংখ্যা (ক-ঘ/ঙ)",  key: "opts",   min: 2,  max: 5,   suffix: "টি" },
        { label: "পাসের নম্বর (%)",          key: "pass",   min: 10, max: 99,  suffix: "%" },
      ].map(({ label, key, min, max, suffix }) => (
        <div key={key} style={{ marginBottom: 22 }}>
          <label style={{
            fontFamily: "'Noto Serif Bengali',serif", fontSize: 14,
            color: T.navy, fontWeight: 700, display: "block", marginBottom: 8,
          }}>{label}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input type="range" min={min} max={max} value={cfg[key]}
              onChange={e => setCfg(p => ({ ...p, [key]: +e.target.value }))}
              style={{ flex: 1, accentColor: T.blue }}
            />
            <div style={{
              background: T.navy, color: "#fff", borderRadius: 10,
              padding: "5px 14px", fontFamily: "'Noto Serif Bengali',serif",
              fontSize: 16, fontWeight: 800, minWidth: 52, textAlign: "center",
            }}>{bn(cfg[key])}{suffix}</div>
          </div>
        </div>
      ))}

      {/* Info box */}
      <div style={{
        borderRadius: 12, padding: "13px 14px", marginBottom: 22,
        background: "#e8f4fd", border: `1px solid #90caf9`,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 20 }}>🏫</span>
        <div>
          <p style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, color: T.navy, margin: "0 0 3px", fontWeight: 700 }}>
            মহানগর ক্যাডেট একাডেমি OMR ফরম্যাট
          </p>
          <p style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, color: T.muted, margin: 0 }}>
            ম্যানুয়াল বা AI ক্যামেরা — যেকোনো পদ্ধতিতে মার্কিং করুন
          </p>
        </div>
      </div>

      <button onClick={onNext} style={{
        width: "100%", padding: "15px 0", border: "none", borderRadius: 13, cursor: "pointer",
        background: `linear-gradient(135deg,${T.navy},${T.blue})`,
        color: "#fff", fontFamily: "'Noto Serif Bengali',serif", fontSize: 16, fontWeight: 700,
        boxShadow: `0 4px 16px rgba(27,58,92,.35)`,
      }}>পরবর্তী → সঠিক উত্তর লিখুন</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCREEN 2 — Answer Key
════════════════════════════════════════════════════════════ */
function AnswerKeyScreen({ cfg, answerKey, setAnswerKey, onPrev, onNext }) {
  const filled = answerKey.filter(a => a !== -1).length;
  const done = filled === cfg.totalQ;

  const quickFill = (pattern) => {
    if (pattern === "clear") { setAnswerKey(Array(cfg.totalQ).fill(-1)); return; }
    setAnswerKey(Array.from({ length: cfg.totalQ }, (_, i) => i % cfg.opts));
  };

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.navy, fontSize: 19, margin: 0 }}>
          🔑 সঠিক উত্তরপত্র
        </h2>
        <span style={{
          fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, fontWeight: 700,
          color: done ? T.ok : T.muted,
        }}>{bn(filled)}/{bn(cfg.totalQ)}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => quickFill("clear")} style={{
          padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`,
          background: "transparent", color: T.muted,
          fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
        }}>রিসেট</button>
        <p style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, color: T.muted, margin: "auto 0" }}>
          প্রতিটি প্রশ্নের সঠিক বুলবুল চাপুন
        </p>
      </div>

      <div style={{
        maxHeight: "60vh", overflowY: "auto",
        border: `1px solid ${T.border}`, borderRadius: 12,
        background: T.card, marginBottom: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,.06)",
      }}>
        {Array.from({ length: cfg.totalQ }, (_, i) => (
          <OmrRow key={i} qNum={i + 1} optCount={cfg.opts}
            selected={answerKey[i] ?? -1}
            onChange={v => setAnswerKey(p => { const n = [...p]; n[i] = v; return n; })}
            showResult={false}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onPrev} style={{
          flex: 1, padding: "13px 0", border: "none", borderRadius: 12, cursor: "pointer",
          background: "#e2e8f0", color: T.navy,
          fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 600,
        }}>← পূর্ববর্তী</button>
        <button onClick={onNext} disabled={!done} style={{
          flex: 2, padding: "13px 0", border: "none", borderRadius: 12,
          background: done ? `linear-gradient(135deg,${T.ok},#22c55e)` : "#cbd5e1",
          color: "#fff", cursor: done ? "pointer" : "not-allowed",
          fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 700,
          boxShadow: done ? "0 4px 14px rgba(22,163,74,.3)" : "none",
        }}>
          {done ? "✅ সংরক্ষণ → শিক্ষার্থী যোগ করুন" : `আরও ${bn(cfg.totalQ - filled)} টি বাকি`}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCREEN 3 — Student Entry (Manual + AI combined)
════════════════════════════════════════════════════════════ */
function StudentScreen({ cfg, answerKey, students, setStudents, onPrev, onResults }) {
  const [mode, setMode] = useState(null); // null | "manual" | "ai"
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");

  /* Manual state */
  const [manualAns, setManualAns] = useState(Array(cfg.totalQ).fill(-1));

  /* AI state */
  const [imgData,  setImgData]  = useState(null);
  const [aiStatus, setAiStatus] = useState("idle"); // idle|scanning|reviewing|error
  const [aiAns,    setAiAns]    = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [aiErr,    setAiErr]    = useState("");
  const camRef = useRef();
  const galRef = useRef();

  const resetEntry = () => {
    setName(""); setRoll(""); setMode(null);
    setManualAns(Array(cfg.totalQ).fill(-1));
    setImgData(null); setAiStatus("idle"); setAiAns(null); setEditMode(false);
  };

  /* ── Save student ── */
  const save = (answers) => {
    const score = answers.filter((a, i) => a === answerKey[i]).length;
    setStudents(p => [...p, {
      id: Date.now(), name: name.trim() || "শিক্ষার্থী", roll: roll.trim(),
      answers, score, total: cfg.totalQ,
      percent: Math.round(score / cfg.totalQ * 100),
      imgData: imgData || null, mode,
    }]);
    resetEntry();
  };

  /* ── AI analysis ── */
  const loadImg = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { setImgData(e.target.result); setAiAns(null); setAiStatus("idle"); };
    reader.readAsDataURL(file);
  };

  const runAI = async () => {
    if (!imgData) return;
    setAiStatus("scanning"); setAiErr("");
    const base64 = imgData.split(",")[1];
    const mime   = imgData.split(";")[0].split(":")[1];
    const prompt = `এটি মহানগর ক্যাডেট একাডেমির OMR উত্তরপত্রের ছবি।
ফরম্যাট: "নৈর্বৃত্তিক অভিযার উত্তরপত্র" অংশে ৩ কলামে মোট ${cfg.totalQ}টি প্রশ্ন।
প্রতিটিতে ${cfg.opts}টি বিকল্প: ${OPTS.slice(0, cfg.opts).join(", ")} (বাংলা অক্ষরে গোলাকার বুলবুল)।
কালো/ভরাট বুলবুল = উত্তর। 0=ক,1=খ,2=গ,3=ঘ,4=ঙ, null=খালি।
শুধু JSON দাও: {"answers":[...${cfg.totalQ}টি মান...]}`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mime, data: base64 } },
            { type: "text",  text: prompt },
          ]}],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const match = text.match(/\{[\s\S]*?"answers"[\s\S]*?\}/);
      if (!match) throw new Error("JSON পাওয়া যায়নি");
      let ans = JSON.parse(match[0]).answers;
      if (!Array.isArray(ans)) throw new Error("উত্তর পাওয়া যায়নি");
      while (ans.length < cfg.totalQ) ans.push(null);
      ans = ans.slice(0, cfg.totalQ).map(v => v == null ? -1 : Number(v));
      setAiAns(ans); setAiStatus("reviewing");
    } catch (e) {
      setAiStatus("error"); setAiErr(e.message);
    }
  };

  const filledBubbles = aiAns ? aiAns.filter(a => a !== -1).length : 0;

  /* ─────────────────────────────────────────────────────── */
  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.navy, fontSize: 19, marginBottom: 14 }}>
        ✏️ শিক্ষার্থীর উত্তরপত্র
      </h2>

      {/* Student info */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input placeholder="শিক্ষার্থীর নাম" value={name} onChange={e => setName(e.target.value)}
          style={{
            flex: 2, padding: "10px 12px", borderRadius: 10,
            border: `1.5px solid ${T.border}`, outline: "none",
            fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, background: "#f8fafc",
          }}
        />
        <input placeholder="রোল নং" value={roll} onChange={e => setRoll(e.target.value)}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 10,
            border: `1.5px solid ${T.border}`, outline: "none",
            fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, background: "#f8fafc",
          }}
        />
      </div>

      {/* Mode selector */}
      {!mode && (
        <>
          <p style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, color: T.muted, marginBottom: 14, textAlign: "center" }}>
            উত্তর প্রবেশের পদ্ধতি বেছে নিন
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {/* Manual */}
            <button onClick={() => setMode("manual")} style={{
              flex: 1, padding: "22px 10px", border: "none", borderRadius: 16, cursor: "pointer",
              background: `linear-gradient(145deg,${T.manual},${T.manualL})`,
              boxShadow: `0 6px 20px rgba(124,58,237,.4)`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              transition: "transform .15s",
            }}
              onTouchStart={e => e.currentTarget.style.transform = "scale(.96)"}
              onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize: 38 }}>✋</span>
              <div>
                <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>
                  ম্যানুয়াল
                </div>
                <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 3 }}>
                  নিজে বুলবুল ভরুন
                </div>
              </div>
            </button>

            {/* AI */}
            <button onClick={() => setMode("ai")} style={{
              flex: 1, padding: "22px 10px", border: "none", borderRadius: 16, cursor: "pointer",
              background: `linear-gradient(145deg,${T.ai},${T.aiL})`,
              boxShadow: `0 6px 20px rgba(13,115,119,.4)`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              transition: "transform .15s",
            }}
              onTouchStart={e => e.currentTarget.style.transform = "scale(.96)"}
              onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize: 38 }}>🤖</span>
              <div>
                <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>
                  AI স্ক্যান
                </div>
                <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 3 }}>
                  ছবি তুলে অটো মার্কিং
                </div>
              </div>
            </button>
          </div>
        </>
      )}

      {/* ── MANUAL MODE ── */}
      {mode === "manual" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.manual }} />
              <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 700, color: T.manual }}>
                ম্যানুয়াল মোড
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setManualAns(Array(cfg.totalQ).fill(-1))} style={{
                padding: "5px 10px", border: `1px solid ${T.border}`, borderRadius: 8,
                background: "transparent", color: T.muted,
                fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
              }}>রিসেট</button>
              <button onClick={() => setMode(null)} style={{
                padding: "5px 10px", border: `1px solid ${T.manual}`, borderRadius: 8,
                background: "transparent", color: T.manual,
                fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
              }}>মোড বদলান</button>
            </div>
          </div>

          <div style={{
            border: `1px solid ${T.border}`, borderRadius: 12,
            background: T.card, maxHeight: "48vh", overflowY: "auto", marginBottom: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,.06)",
          }}>
            {Array.from({ length: cfg.totalQ }, (_, i) => (
              <OmrRow key={i} qNum={i + 1} optCount={cfg.opts}
                selected={manualAns[i]}
                onChange={v => setManualAns(p => { const n = [...p]; n[i] = v; return n; })}
                showResult={false}
              />
            ))}
          </div>

          {/* Quick score preview */}
          <div style={{
            borderRadius: 12, padding: "12px 16px", marginBottom: 12,
            background: `linear-gradient(135deg,${T.ink},${T.navy})`,
            display: "flex", justifyContent: "space-around",
          }}>
            {[
              { label: "সঠিক", val: manualAns.filter((a, i) => a === answerKey[i]).length, color: T.goldL },
              { label: "ভুল",  val: manualAns.filter((a, i) => a !== answerKey[i] && a !== -1).length, color: "#f87171" },
              { label: "বাদ",  val: manualAns.filter(a => a === -1).length, color: "#94a3b8" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 26, fontWeight: 900, color }}>{bn(val)}</div>
                <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: "rgba(255,255,255,.6)" }}>{label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => save(manualAns)} style={{
            width: "100%", padding: "14px 0", border: "none", borderRadius: 12, cursor: "pointer",
            background: `linear-gradient(135deg,${T.manual},${T.manualL})`,
            color: "#fff", fontFamily: "'Noto Serif Bengali',serif", fontSize: 15, fontWeight: 800,
            boxShadow: `0 4px 16px rgba(124,58,237,.35)`, marginBottom: 10,
          }}>💾 ফলাফল সংরক্ষণ করুন</button>
        </>
      )}

      {/* ── AI MODE ── */}
      {mode === "ai" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.ai }} />
              <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 700, color: T.ai }}>
                AI স্ক্যান মোড
              </span>
            </div>
            <button onClick={() => { setMode(null); setImgData(null); setAiStatus("idle"); setAiAns(null); }} style={{
              padding: "5px 10px", border: `1px solid ${T.ai}`, borderRadius: 8,
              background: "transparent", color: T.ai,
              fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
            }}>মোড বদলান</button>
          </div>

          {/* No image yet — show camera/gallery */}
          {!imgData && (
            <div style={{
              border: `2px dashed ${T.border}`, borderRadius: 16,
              padding: "28px 16px", textAlign: "center",
              background: "#f8fafc", marginBottom: 14,
            }}>
              <p style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, color: T.muted, marginBottom: 22 }}>
                OMR শিটের ছবি তুলুন বা গ্যালারি থেকে বেছে নিন
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 28 }}>
                {/* Camera */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <button onClick={() => camRef.current?.click()} style={{
                    width: 76, height: 76, borderRadius: 22,
                    background: `linear-gradient(135deg,${T.navy},${T.blue})`,
                    border: "none", cursor: "pointer", fontSize: 36,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 6px 18px rgba(27,58,92,.4)`,
                    transition: "transform .15s",
                  }}
                    onTouchStart={e => e.currentTarget.style.transform = "scale(.93)"}
                    onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
                  >📷</button>
                  <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, color: T.navy, fontWeight: 700 }}>ক্যামেরা</span>
                </div>
                {/* Gallery */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <button onClick={() => galRef.current?.click()} style={{
                    width: 76, height: 76, borderRadius: 22,
                    background: `linear-gradient(135deg,#6d28d9,#8b5cf6)`,
                    border: "none", cursor: "pointer", fontSize: 36,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 6px 18px rgba(109,40,217,.4)",
                    transition: "transform .15s",
                  }}
                    onTouchStart={e => e.currentTarget.style.transform = "scale(.93)"}
                    onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
                  >🖼️</button>
                  <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, color: "#6d28d9", fontWeight: 700 }}>গ্যালারি</span>
                </div>
              </div>
            </div>
          )}

          {/* Image preview */}
          {imgData && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `2px solid ${T.border}`, marginBottom: 8 }}>
                <img src={imgData} alt="OMR" style={{ width: "100%", maxHeight: 230, objectFit: "contain", background: "#f1f5f9" }} />
                {aiStatus === "scanning" && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(13,115,119,.88)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                  }}>
                    <div style={{ fontSize: 42, animation: "spin 1s linear infinite" }}>🔍</div>
                    <p style={{ fontFamily: "'Noto Serif Bengali',serif", color: "#fff", fontSize: 16, fontWeight: 700, margin: 0 }}>AI বিশ্লেষণ চলছে...</p>
                    <p style={{ fontFamily: "'Noto Serif Bengali',serif", color: "rgba(255,255,255,.65)", fontSize: 12, margin: 0 }}>বুলবুল সনাক্ত করা হচ্ছে</p>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setImgData(null); setAiAns(null); setAiStatus("idle"); }} style={{
                  padding: "6px 12px", border: `1px solid ${T.err}`, borderRadius: 8,
                  background: "transparent", color: T.err,
                  fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
                }}>✕ সরান</button>
                {aiStatus !== "scanning" && (<>
                  <button onClick={() => camRef.current?.click()} style={{
                    padding: "6px 12px", border: `1px solid ${T.blue}`, borderRadius: 8,
                    background: "transparent", color: T.blue,
                    fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
                  }}>📷 আবার তুলুন</button>
                  <button onClick={() => galRef.current?.click()} style={{
                    padding: "6px 12px", border: "1px solid #7c3aed", borderRadius: 8,
                    background: "transparent", color: "#7c3aed",
                    fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, cursor: "pointer",
                  }}>🖼️ অন্য ছবি</button>
                </>)}
              </div>
            </div>
          )}

          {imgData && aiStatus === "idle" && (
            <button onClick={runAI} style={{
              width: "100%", padding: "14px 0", border: "none", borderRadius: 13, cursor: "pointer",
              background: `linear-gradient(135deg,${T.gold},${T.goldL})`,
              color: T.ink, fontFamily: "'Noto Serif Bengali',serif", fontSize: 15, fontWeight: 800,
              boxShadow: `0 4px 16px rgba(245,166,35,.4)`, marginBottom: 12,
            }}>🤖 AI দিয়ে স্বয়ংক্রিয় মার্কিং করুন</button>
          )}

          {aiStatus === "error" && (
            <div style={{ borderRadius: 12, padding: "13px", marginBottom: 12, background: "#fef2f2", border: `1px solid #fca5a5` }}>
              <p style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.err, fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>❌ বিশ্লেষণে সমস্যা</p>
              <p style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.muted, fontSize: 12, margin: "0 0 10px" }}>{aiErr}</p>
              <button onClick={runAI} style={{
                padding: "7px 16px", border: "none", borderRadius: 8, cursor: "pointer",
                background: T.blue, color: "#fff",
                fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, fontWeight: 700,
              }}>🔄 আবার চেষ্টা করুন</button>
            </div>
          )}

          {aiStatus === "reviewing" && aiAns && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <p style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.ok, fontSize: 14, fontWeight: 700, margin: 0 }}>✅ বিশ্লেষণ সম্পন্ন</p>
                  <p style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.muted, fontSize: 12, margin: "2px 0 0" }}>
                    {bn(filledBubbles)}/{bn(cfg.totalQ)} বুলবুল শনাক্ত
                  </p>
                </div>
                <button onClick={() => setEditMode(!editMode)} style={{
                  padding: "7px 12px", border: "none", borderRadius: 9, cursor: "pointer",
                  background: editMode ? T.gold : T.blue, color: editMode ? T.ink : "#fff",
                  fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, fontWeight: 700,
                }}>{editMode ? "✅ সম্পন্ন" : "✏️ সংশোধন"}</button>
              </div>

              {/* Score preview */}
              <div style={{
                borderRadius: 12, padding: "12px 16px", marginBottom: 10,
                background: `linear-gradient(135deg,${T.ink},${T.navy})`,
                display: "flex", justifyContent: "space-around",
              }}>
                {[
                  { label: "সঠিক", val: aiAns.filter((a, i) => a === answerKey[i]).length, color: T.goldL },
                  { label: "ভুল",  val: aiAns.filter((a, i) => a !== answerKey[i] && a !== -1).length, color: "#f87171" },
                  { label: "বাদ",  val: aiAns.filter(a => a === -1).length, color: "#94a3b8" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 26, fontWeight: 900, color }}>{bn(val)}</div>
                    <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: "rgba(255,255,255,.6)" }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, background: T.card, maxHeight: "32vh", overflowY: "auto", marginBottom: 10 }}>
                {Array.from({ length: cfg.totalQ }, (_, i) => (
                  <OmrRow key={i} qNum={i + 1} optCount={cfg.opts}
                    selected={aiAns[i]}
                    onChange={editMode ? v => setAiAns(p => { const n = [...p]; n[i] = v; return n; }) : null}
                    correctAns={answerKey[i]} showResult={true}
                    highlight={aiAns[i] === -1}
                  />
                ))}
              </div>

              <button onClick={() => save(aiAns)} style={{
                width: "100%", padding: "14px 0", border: "none", borderRadius: 12, cursor: "pointer",
                background: `linear-gradient(135deg,${T.ok},#22c55e)`,
                color: "#fff", fontFamily: "'Noto Serif Bengali',serif", fontSize: 15, fontWeight: 800,
                boxShadow: "0 4px 16px rgba(22,163,74,.35)", marginBottom: 10,
              }}>💾 ফলাফল সংরক্ষণ করুন</button>
            </>
          )}

          {/* hidden file inputs */}
          <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
            onChange={e => { if (e.target.files[0]) loadImg(e.target.files[0]); e.target.value = ""; }} />
          <input ref={galRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { if (e.target.files[0]) loadImg(e.target.files[0]); e.target.value = ""; }} />
        </>
      )}

      {/* Student list */}
      {students.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, color: T.navy, margin: 0 }}>
              📋 যোগ করা শিক্ষার্থী ({bn(students.length)} জন)
            </h3>
            <button onClick={onResults} style={{
              padding: "6px 14px", border: "none", borderRadius: 9, cursor: "pointer",
              background: T.gold, color: T.ink,
              fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, fontWeight: 700,
            }}>📊 ফলাফল দেখুন</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "20vh", overflowY: "auto" }}>
            {students.map(s => (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 12px", borderRadius: 10,
                border: `1px solid ${T.border}`, background: T.card,
              }}>
                <span style={{ fontSize: 14 }}>{s.mode === "ai" ? "🤖" : "✋"}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, fontWeight: 700, color: T.navy }}>
                    {s.name}
                  </span>
                  {s.roll && <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: T.muted }}> ({s.roll})</span>}
                </div>
                <span style={{
                  fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 20,
                  background: s.percent >= cfg.pass ? "#dcfce7" : "#fee2e2",
                  color: s.percent >= cfg.pass ? T.ok : T.err,
                }}>{bn(s.score)}/{bn(s.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onPrev} style={{
        width: "100%", padding: "12px 0", border: "none", borderRadius: 12, cursor: "pointer",
        background: "#e2e8f0", color: T.navy, marginTop: 14,
        fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 600,
      }}>← উত্তরপত্রে ফিরুন</button>

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCREEN 4 — Results
════════════════════════════════════════════════════════════ */
function ResultsScreen({ cfg, students, onAddMore, onDetail, onReset }) {
  const sorted = [...students].sort((a, b) => b.score - a.score);
  const passed = students.filter(s => s.percent >= cfg.pass);
  const avg    = students.length ? Math.round(students.reduce((s, x) => s + x.percent, 0) / students.length) : 0;

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ fontFamily: "'Noto Serif Bengali',serif", color: T.navy, fontSize: 19, marginBottom: 14 }}>
        📊 সামগ্রিক ফলাফল
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "মোট শিক্ষার্থী",  val: bn(students.length), color: T.blue },
          { label: "পাস করেছে",       val: bn(passed.length),   color: T.ok },
          { label: "গড় নম্বর",        val: `${bn(avg)}%`,       color: T.gold },
          { label: "পাসের হার",       val: `${bn(students.length ? Math.round(passed.length / students.length * 100) : 0)}%`, color: T.manual },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "14px 12px", textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.05)",
          }}>
            <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 26, fontWeight: 900, color }}>{val}</div>
            <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, color: T.muted, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 15, color: T.navy, marginBottom: 8 }}>🏆 মেধা তালিকা</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "44vh", overflowY: "auto" }}>
        {sorted.map((s, r) => (
          <div key={s.id} onClick={() => onDetail(s)} style={{
            background: r === 0 ? "#fefce8" : T.card,
            border: `1px solid ${r === 0 ? "#fde68a" : T.border}`,
            borderRadius: 12, padding: "11px 14px",
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,.04)",
          }}>
            <span style={{ fontSize: 20, minWidth: 26 }}>{r === 0 ? "🥇" : r === 1 ? "🥈" : r === 2 ? "🥉" : `${bn(r + 1)}.`}</span>
            <span style={{ fontSize: 14 }}>{s.mode === "ai" ? "🤖" : "✋"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 700, color: T.navy }}>
                {s.name}
                {s.roll && <span style={{ color: T.muted, fontSize: 12, fontWeight: 400 }}> ({s.roll})</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 4, height: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${s.percent}%`,
                    background: s.percent >= cfg.pass ? `linear-gradient(90deg,${T.ok},#4ade80)` : `linear-gradient(90deg,${T.err},#f87171)`,
                  }} />
                </div>
                <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 12, color: T.muted, minWidth: 50 }}>
                  {bn(s.score)}/{bn(s.total)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 18, fontWeight: 900, color: s.percent >= cfg.pass ? T.ok : T.err }}>
                {bn(s.percent)}%
              </div>
              <span style={{
                fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
                background: s.percent >= cfg.pass ? "#dcfce7" : "#fee2e2",
                color: s.percent >= cfg.pass ? T.ok : T.err,
              }}>{s.percent >= cfg.pass ? "পাস" : "ফেল"}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button onClick={onAddMore} style={{
          flex: 2, padding: "14px 0", border: "none", borderRadius: 12, cursor: "pointer",
          background: `linear-gradient(135deg,${T.navy},${T.blue})`,
          color: "#fff", fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 700,
          boxShadow: `0 4px 14px rgba(27,58,92,.3)`,
        }}>✏️ আরও শিক্ষার্থী যোগ করুন</button>
        <button onClick={onReset} style={{
          flex: 1, padding: "14px 0", border: "none", borderRadius: 12, cursor: "pointer",
          background: T.err, color: "#fff",
          fontFamily: "'Noto Serif Bengali',serif", fontSize: 14, fontWeight: 700,
        }}>🔄 রিসেট</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCREEN 5 — Detail
════════════════════════════════════════════════════════════ */
function DetailScreen({ student, cfg, answerKey, onBack }) {
  const [showImg, setShowImg] = useState(false);
  return (
    <div style={{ padding: "20px 16px" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", marginBottom: 12,
        fontFamily: "'Noto Serif Bengali',serif", color: T.blue, fontSize: 14,
        display: "flex", alignItems: "center", gap: 4, padding: 0,
      }}>← ফলাফলে ফিরুন</button>

      <div style={{
        background: `linear-gradient(135deg,${T.ink},${T.navy},${T.blue})`,
        borderRadius: 18, padding: "20px", marginBottom: 14,
        boxShadow: `0 6px 22px rgba(13,27,42,.4)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>{student.mode === "ai" ? "🤖" : "✋"}</span>
          <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>{student.name}</div>
        </div>
        {student.roll && <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 12 }}>রোল: {student.roll}</div>}
        <div style={{ display: "flex", gap: 22 }}>
          {[
            { val: `${bn(student.score)}/${bn(student.total)}`, label: "নম্বর" },
            { val: `${bn(student.percent)}%`, label: "শতকরা" },
            { val: student.percent >= cfg.pass ? "পাস ✅" : "ফেল ❌", label: "ফলাফল" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 20, fontWeight: 900, color: T.goldL }}>{val}</div>
              <div style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: "rgba(255,255,255,.55)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {student.imgData && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => setShowImg(!showImg)} style={{
            padding: "8px 16px", border: "none", borderRadius: 9, cursor: "pointer",
            background: T.navy, color: "#fff",
            fontFamily: "'Noto Serif Bengali',serif", fontSize: 13, fontWeight: 700, marginBottom: 8,
          }}>{showImg ? "🙈 ছবি লুকান" : "🖼️ OMR ছবি দেখুন"}</button>
          {showImg && <img src={student.imgData} alt="OMR" style={{
            width: "100%", maxHeight: 200, objectFit: "contain",
            borderRadius: 12, border: `2px solid ${T.border}`, background: "#f1f5f9",
          }} />}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        {[
          { bg: T.ok, label: "সঠিক" }, { bg: T.err, label: "ভুল" },
          { bg: "#dcfce7", bd: T.ok, label: "মিস করা সঠিক" },
        ].map(({ bg, bd, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: bg, border: bd ? `2px solid ${bd}` : "none" }} />
            <span style={{ fontFamily: "'Noto Serif Bengali',serif", fontSize: 11, color: T.muted }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, background: T.card, maxHeight: "52vh", overflowY: "auto" }}>
        {Array.from({ length: cfg.totalQ }, (_, i) => (
          <OmrRow key={i} qNum={i + 1} optCount={cfg.opts}
            selected={student.answers[i]} correctAns={answerKey[i]} showResult={true}
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen,     setScreen]    = useState("setup");
  const [cfg,        setCfg]       = useState({ totalQ: 30, opts: 4, pass: 33 });
  const [answerKey,  setAnswerKey] = useState(Array(30).fill(-1));
  const [students,   setStudents]  = useState([]);
  const [detail,     setDetail]    = useState(null);

  const handleCfgNext = () => {
    setAnswerKey(Array(cfg.totalQ).fill(-1));
    setStudents([]);
    setScreen("answerkey");
  };

  const handleReset = () => {
    setCfg({ totalQ: 30, opts: 4, pass: 33 });
    setAnswerKey(Array(30).fill(-1));
    setStudents([]);
    setScreen("setup");
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg,${T.ink} 0%,${T.navy} 55%,${T.blue} 100%)`,
        padding: "18px 20px 0",
        boxShadow: "0 4px 20px rgba(0,0,0,.28)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: `linear-gradient(135deg,${T.gold},${T.goldL})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, boxShadow: `0 3px 10px rgba(245,166,35,.45)`, flexShrink: 0,
          }}>📝</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "'Noto Serif Bengali',serif" }}>
              AI OMR মার্কিং সিস্টেম
            </div>
            <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12, fontFamily: "'Noto Serif Bengali',serif" }}>
              মহানগর ক্যাডেট একাডেমি
            </div>
          </div>
        </div>
        <StepBar screen={screen} />
      </div>

      {/* Screens */}
      <div style={{ minHeight: "calc(100vh - 112px)" }}>
        {screen === "setup"     && <SetupScreen     cfg={cfg} setCfg={setCfg} onNext={handleCfgNext} />}
        {screen === "answerkey" && <AnswerKeyScreen  cfg={cfg} answerKey={answerKey} setAnswerKey={setAnswerKey}
                                     onPrev={() => setScreen("setup")} onNext={() => setScreen("student")} />}
        {screen === "student"   && <StudentScreen    cfg={cfg} answerKey={answerKey}
                                     students={students} setStudents={setStudents}
                                     onPrev={() => setScreen("answerkey")}
                                     onResults={() => setScreen("results")} />}
        {screen === "results"   && <ResultsScreen    cfg={cfg} students={students}
                                     onAddMore={() => setScreen("student")}
                                     onDetail={s => { setDetail(s); setScreen("detail"); }}
                                     onReset={handleReset} />}
        {screen === "detail"    && detail && <DetailScreen student={detail} cfg={cfg} answerKey={answerKey}
                                     onBack={() => setScreen("results")} />}
      </div>
    </div>
  );
}
