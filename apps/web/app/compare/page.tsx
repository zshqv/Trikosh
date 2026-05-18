"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface CompanyDetail {
  company: { ticker: string; name: string; sector: string; industry: string; country: string };
  income_statements: any[];
  balance_sheets: any[];
  cash_flow_statements: any[];
  financial_ratios: any[];
}

const METRICS: { label: string; key: string; type: "pct" | "x" | "b"; higherBetter: boolean }[] = [
  { label: "Revenue (Latest)",   key: "revenue",              type: "b",   higherBetter: true  },
  { label: "Gross Margin",       key: "gross_margin",         type: "pct", higherBetter: true  },
  { label: "Operating Margin",   key: "operating_margin",     type: "pct", higherBetter: true  },
  { label: "Net Margin",         key: "net_margin",           type: "pct", higherBetter: true  },
  { label: "Return on Equity",   key: "return_on_equity",     type: "pct", higherBetter: true  },
  { label: "Return on Assets",   key: "return_on_assets",     type: "pct", higherBetter: true  },
  { label: "Debt / Equity",      key: "debt_to_equity",       type: "x",   higherBetter: false },
  { label: "Current Ratio",      key: "current_ratio",        type: "x",   higherBetter: true  },
  { label: "P/E Ratio",          key: "price_to_earnings",    type: "x",   higherBetter: false },
  { label: "P/B Ratio",          key: "price_to_book",        type: "x",   higherBetter: false },
  { label: "EV / EBITDA",        key: "ev_to_ebitda",         type: "x",   higherBetter: false },
  { label: "FCF Yield",          key: "free_cash_flow_yield", type: "pct", higherBetter: true  },
];

const EXAMPLE_PAIRS: { label: string; a: string; b: string }[] = [
  { label: "NVDA vs MSFT", a: "NVDA", b: "MSFT" },
  { label: "JPM vs GS",    a: "JPM",  b: "GS"   },
  { label: "LLY vs JNJ",   a: "LLY",  b: "JNJ"  },
];

function fmt(n: number | undefined | null, type: "pct" | "x" | "b"): string {
  if (n == null || isNaN(Number(n))) return "—";
  const v = Number(n);
  if (type === "pct") return `${(v * 100).toFixed(1)}%`;
  if (type === "x")   return `${v.toFixed(2)}x`;
  if (type === "b")   return `$${(v / 1e9).toFixed(1)}B`;
  return "—";
}

function SelectBox({
  companies,
  value,
  onChange,
  placeholder,
}: {
  companies: Company[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          backgroundColor: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: "6px",
          padding: "10px 36px 10px 14px",
          fontSize: "13px",
          color: value ? "var(--text-primary)" : "var(--text-muted)",
          appearance: "none",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)")}
        onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <option value="">{placeholder}</option>
        {companies.map(c => (
          <option key={c.ticker} value={c.ticker}>
            {c.ticker} — {c.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function ComparePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tickerA, setTickerA]     = useState("");
  const [tickerB, setTickerB]     = useState("");
  const [dataA, setDataA]         = useState<CompanyDetail | null>(null);
  const [dataB, setDataB]         = useState<CompanyDetail | null>(null);
  const [loadingA, setLoadingA]   = useState(false);
  const [loadingB, setLoadingB]   = useState(false);
  const [listError, setListError] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then(r => r.json())
      .then(d => setCompanies(d.companies ?? []))
      .catch(() => setListError(true));
  }, []);

  useEffect(() => {
    if (!tickerA) { setDataA(null); return; }
    setLoadingA(true);
    fetch(`/api/companies/${tickerA}`)
      .then(r => r.json())
      .then(d => { setDataA(d); setLoadingA(false); })
      .catch(() => setLoadingA(false));
  }, [tickerA]);

  useEffect(() => {
    if (!tickerB) { setDataB(null); return; }
    setLoadingB(true);
    fetch(`/api/companies/${tickerB}`)
      .then(r => r.json())
      .then(d => { setDataB(d); setLoadingB(false); })
      .catch(() => setLoadingB(false));
  }, [tickerB]);

  const latestRatios = (d: CompanyDetail | null) =>
    d?.financial_ratios[d.financial_ratios.length - 1] ?? null;

  const latestIncome = (d: CompanyDetail | null) =>
    d?.income_statements[d.income_statements.length - 1] ?? null;

  function getValue(d: CompanyDetail | null, key: string): number | null {
    if (key === "revenue") return latestIncome(d)?.[key] ?? null;
    return latestRatios(d)?.[key] ?? null;
  }

  const bothLoaded = dataA && dataB;
  const anySelected = tickerA || tickerB;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "32px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--amber)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Peer Analysis
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Compare
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Select two companies to compare their fundamentals side by side.
          </p>
        </motion.div>

        {listError && (
          <div
            style={{
              backgroundColor: "rgba(217,95,95,0.08)",
              border: "0.5px solid rgba(217,95,95,0.25)",
              borderRadius: "6px",
              padding: "14px 18px",
              color: "var(--red)",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            Could not load company list. Check database connection.
          </div>
        )}

        {/* Example chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-subtle)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              alignSelf: "center",
            }}
          >
            Try:
          </span>
          {EXAMPLE_PAIRS.map(pair => (
            <button
              key={pair.label}
              onClick={() => { setTickerA(pair.a); setTickerB(pair.b); }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--amber)",
                backgroundColor: "rgba(212,168,83,0.08)",
                border: "0.5px solid rgba(212,168,83,0.25)",
                borderRadius: "4px",
                padding: "4px 10px",
                cursor: "pointer",
                transition: "background-color 0.15s ease, border-color 0.15s ease",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "rgba(212,168,83,0.16)";
                el.style.borderColor = "rgba(212,168,83,0.45)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "rgba(212,168,83,0.08)";
                el.style.borderColor = "rgba(212,168,83,0.25)";
              }}
            >
              {pair.label}
            </button>
          ))}
        </motion.div>

        {/* Selector row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "32px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <SelectBox
            companies={companies.filter(c => c.ticker !== tickerB)}
            value={tickerA}
            onChange={setTickerA}
            placeholder="Select first company…"
          />
          <span style={{ color: "var(--text-subtle)", fontSize: "13px", flexShrink: 0 }}>vs.</span>
          <SelectBox
            companies={companies.filter(c => c.ticker !== tickerA)}
            value={tickerB}
            onChange={setTickerB}
            placeholder="Select second company…"
          />
        </motion.div>

        {/* Comparison table with AnimatePresence */}
        <AnimatePresence mode="wait">
          {anySelected ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                backgroundColor: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  borderBottom: "0.5px solid var(--border)",
                }}
              >
                <div style={{ padding: "16px 20px", borderRight: "0.5px solid var(--border)" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "var(--text-subtle)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Metric
                  </p>
                </div>
                {[
                  { ticker: tickerA, data: dataA, loading: loadingA },
                  { ticker: tickerB, data: dataB, loading: loadingB },
                ].map(({ ticker, data, loading }, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      borderRight: i === 0 ? "0.5px solid var(--border)" : "none",
                      backgroundColor: ticker ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    {loading ? (
                      <div
                        style={{
                          width: "80px",
                          height: "18px",
                          backgroundColor: "var(--surface)",
                          borderRadius: "4px",
                        }}
                      />
                    ) : ticker ? (
                      <>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "var(--amber)",
                            marginBottom: "2px",
                          }}
                        >
                          {ticker}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {data?.company?.name ?? ""}
                        </p>
                      </>
                    ) : (
                      <p style={{ fontSize: "13px", color: "var(--text-subtle)" }}>—</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {METRICS.map(({ label, key, type, higherBetter }, idx) => {
                const valA = getValue(dataA, key);
                const valB = getValue(dataB, key);

                let winnerCol: "A" | "B" | null = null;
                if (valA != null && valB != null && valA !== valB) {
                  winnerCol = higherBetter
                    ? (valA > valB ? "A" : "B")
                    : (valA < valB ? "A" : "B");
                }

                return (
                  <div
                    key={key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      borderBottom: idx < METRICS.length - 1 ? "0.5px solid var(--border)" : "none",
                    }}
                  >
                    <div
                      style={{
                        padding: "13px 20px",
                        borderRight: "0.5px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{label}</p>
                    </div>

                    {[
                      { val: valA, loading: loadingA, isWinner: winnerCol === "A" },
                      { val: valB, loading: loadingB, isWinner: winnerCol === "B" },
                    ].map(({ val, loading, isWinner }, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "13px 20px",
                          borderRight: i === 0 ? "0.5px solid var(--border)" : "none",
                          backgroundColor: isWinner ? "rgba(212,168,83,0.06)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {loading ? (
                          <div
                            style={{
                              width: "56px",
                              height: "14px",
                              backgroundColor: "var(--surface-2)",
                              borderRadius: "3px",
                            }}
                          />
                        ) : (
                          <>
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "13px",
                                color: isWinner ? "var(--amber)" : "var(--text-primary)",
                                fontWeight: isWinner ? 500 : 400,
                              }}
                            >
                              {fmt(val, type)}
                            </span>
                            {isWinner && (
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontFamily: "var(--font-mono)",
                                  color: "var(--amber)",
                                  backgroundColor: "rgba(212,168,83,0.15)",
                                  border: "0.5px solid rgba(212,168,83,0.30)",
                                  borderRadius: "3px",
                                  padding: "1px 5px",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                WIN
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                textAlign: "center",
                padding: "72px 0",
                color: "var(--text-subtle)",
                fontSize: "14px",
                border: "0.5px dashed rgba(255,255,255,0.06)",
                borderRadius: "8px",
              }}
            >
              Select two companies above to start comparing.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
