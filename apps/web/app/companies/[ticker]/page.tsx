"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface CompanyData {
  company: {
    ticker: string;
    name: string;
    sector: string;
    industry: string;
    country: string;
  };
  income_statements: any[];
  balance_sheets: any[];
  cash_flow_statements: any[];
  financial_ratios: any[];
}

const SECTOR_COLORS: Record<string, string> = {
  "Financial Services": "#d4a853",
  "Healthcare":         "#4aad7a",
  "Technology":         "#6b9fd4",
  "Communication Services": "#a87fd4",
};

function fmt(n: number | undefined | null, type: "pct" | "x" | "b"): string {
  if (n == null || isNaN(Number(n))) return "—";
  const v = Number(n);
  if (type === "pct") return `${(v * 100).toFixed(1)}%`;
  if (type === "x")   return `${v.toFixed(2)}x`;
  if (type === "b")   return `$${(v / 1e9).toFixed(1)}B`;
  return "—";
}

const CHART_COLORS = {
  primary:   "#d4a853",
  secondary: "#4aad7a",
  tertiary:  "#6b9fd4",
  negative:  "#d95f5f",
};

const tooltipStyle = {
  backgroundColor: "#111111",
  border: "0.5px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  fontSize: "12px",
  fontFamily: "var(--font-mono, monospace)",
  color: "#f0f0f0",
};

function RatioCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface-2, #1a1a1a)",
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: "6px",
        padding: "14px 16px",
      }}
    >
      <p style={{ fontSize: "10px", color: "#666", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "16px",
          fontWeight: 500,
          color: "#f0f0f0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontFamily: "var(--font-mono)",
        color: "var(--amber)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "14px",
      }}
    >
      {children}
    </p>
  );
}

function FadeInUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function ChartWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#111111",
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      {children}
    </div>
  );
}

export default function CompanyPage() {
  const params = useParams();
  const ticker = (params.ticker as string).toUpperCase();
  const [data, setData]       = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/companies/${ticker}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Company not found or database unreachable."); setLoading(false); });
  }, [ticker]);

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "48px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ width: "120px", height: "32px", backgroundColor: "#111", borderRadius: "4px", marginBottom: "48px", animation: "pulse 2s infinite" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginBottom: "40px" }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ height: "72px", backgroundColor: "#111", borderRadius: "6px", animation: "pulse 2s infinite" }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: "28px", color: "#d4a853", marginBottom: "12px" }}>{ticker}</p>
          <p style={{ fontSize: "14px", color: "#d95f5f", marginBottom: "24px" }}>{error}</p>
          <Link href="/companies" style={{ fontSize: "13px", color: "#666", textDecoration: "none" }}>
            ← Back to companies
          </Link>
        </div>
      </div>
    );
  }

  const { company, income_statements, balance_sheets, cash_flow_statements, financial_ratios } = data;
  const sectorColor = SECTOR_COLORS[company.sector] ?? "#666";
  const latestRatios = financial_ratios[financial_ratios.length - 1] ?? {};

  const revenueData = income_statements.filter(i => i.revenue).map(i => ({
    year: String(i.fiscal_year),
    Revenue:      parseFloat((i.revenue      / 1e9).toFixed(2)),
    "Gross Profit": parseFloat((i.gross_profit / 1e9).toFixed(2)),
    "Net Income":   parseFloat((i.net_income  / 1e9).toFixed(2)),
  }));

  const marginData = financial_ratios.filter(r => r.gross_margin).map(r => ({
    year: String(r.fiscal_year),
    "Gross Margin":     parseFloat((r.gross_margin   * 100).toFixed(1)),
    "Operating Margin": parseFloat((r.operating_margin * 100).toFixed(1)),
    "Net Margin":       parseFloat((r.net_margin      * 100).toFixed(1)),
  }));

  const balanceData = balance_sheets.filter(b => b.total_assets).map(b => ({
    year: String(b.fiscal_year),
    "Total Assets":      parseFloat((b.total_assets      / 1e9).toFixed(2)),
    "Total Liabilities": parseFloat((b.total_liabilities / 1e9).toFixed(2)),
    "Total Equity":      parseFloat((b.total_equity      / 1e9).toFixed(2)),
  }));

  const cashData = cash_flow_statements.filter(c => c.operating_cash_flow).map(c => ({
    year: String(c.fiscal_year),
    "Operating CF":   parseFloat((c.operating_cash_flow / 1e9).toFixed(2)),
    "Free Cash Flow": parseFloat((c.free_cash_flow      / 1e9).toFixed(2)),
    "Capex":          parseFloat((Math.abs(c.capital_expenditure) / 1e9).toFixed(2)),
  }));

  const KEY_RATIOS = [
    { label: "Gross Margin",  value: fmt(latestRatios.gross_margin,       "pct") },
    { label: "Net Margin",    value: fmt(latestRatios.net_margin,         "pct") },
    { label: "ROE",           value: fmt(latestRatios.return_on_equity,   "pct") },
    { label: "ROA",           value: fmt(latestRatios.return_on_assets,   "pct") },
    { label: "Current Ratio", value: fmt(latestRatios.current_ratio,      "x")   },
    { label: "Debt / Equity", value: fmt(latestRatios.debt_to_equity,     "x")   },
    { label: "P/E Ratio",     value: fmt(latestRatios.price_to_earnings,  "x")   },
    { label: "P/B Ratio",     value: fmt(latestRatios.price_to_book,      "x")   },
    { label: "EV / EBITDA",   value: fmt(latestRatios.ev_to_ebitda,       "x")   },
    { label: "FCF Yield",     value: fmt(latestRatios.free_cash_flow_yield, "pct") },
  ];

  const axisStyle = { fill: "#444", fontSize: 11, fontFamily: "var(--font-mono, monospace)" };

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0" }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px" }}>
          <Link
            href="/companies"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#666",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#f0f0f0")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#666")}
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Companies
          </Link>
        </div>
      </div>

      {/* Company header */}
      <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)", backgroundColor: "#111" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "var(--amber, #d4a853)",
                  }}
                >
                  {company.ticker}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: sectorColor,
                    backgroundColor: sectorColor + "18",
                    border: `0.5px solid ${sectorColor}40`,
                    borderRadius: "4px",
                    padding: "3px 8px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {company.sector}
                </span>
              </div>
              <h1 style={{ fontSize: "18px", fontWeight: 400, color: "#f0f0f0", marginBottom: "4px" }}>
                {company.name}
              </h1>
              <p style={{ fontSize: "12px", color: "#444" }}>
                {company.industry} · {company.country}
              </p>
            </div>
            <Link
              href={`/compare?a=${company.ticker}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#666",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "7px 14px",
                textDecoration: "none",
                transition: "color 0.15s ease, border-color 0.15s ease",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "#f0f0f0";
                el.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "#666";
                el.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <ExternalLink size={13} strokeWidth={1.5} />
              Compare
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "34px" }}>

        {/* Key ratios */}
        <FadeInUp>
          <section>
            <SectionLabel>Key ratios — latest year</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px" }}>
              {KEY_RATIOS.map(({ label, value }) => (
                <RatioCard key={label} label={label} value={value} />
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* Revenue chart */}
        {revenueData.length > 0 && (
          <FadeInUp>
            <section>
              <SectionLabel>Revenue & profitability (USD billions)</SectionLabel>
              <ChartWrap>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={48} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#666" }} />
                    <Bar dataKey="Revenue"      fill={CHART_COLORS.primary}   radius={[3,3,0,0]} />
                    <Bar dataKey="Gross Profit" fill={CHART_COLORS.secondary} radius={[3,3,0,0]} />
                    <Bar dataKey="Net Income"   fill={CHART_COLORS.tertiary}  radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrap>
            </section>
          </FadeInUp>
        )}

        {/* Margins chart */}
        {marginData.length > 0 && (
          <FadeInUp>
            <section>
              <SectionLabel>Margin analysis (%)</SectionLabel>
              <ChartWrap>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={marginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} unit="%" />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#666" }} />
                    <Line type="monotone" dataKey="Gross Margin"     stroke={CHART_COLORS.primary}   strokeWidth={1.5} dot={{ r: 3, fill: CHART_COLORS.primary }}   />
                    <Line type="monotone" dataKey="Operating Margin" stroke={CHART_COLORS.secondary} strokeWidth={1.5} dot={{ r: 3, fill: CHART_COLORS.secondary }} />
                    <Line type="monotone" dataKey="Net Margin"       stroke={CHART_COLORS.tertiary}  strokeWidth={1.5} dot={{ r: 3, fill: CHART_COLORS.tertiary }}  />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrap>
            </section>
          </FadeInUp>
        )}

        {/* Balance sheet chart */}
        {balanceData.length > 0 && (
          <FadeInUp>
            <section>
              <SectionLabel>Balance sheet (USD billions)</SectionLabel>
              <ChartWrap>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={balanceData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={48} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#666" }} />
                    <Bar dataKey="Total Assets"      fill={CHART_COLORS.tertiary}  radius={[3,3,0,0]} />
                    <Bar dataKey="Total Liabilities" fill={CHART_COLORS.negative}  radius={[3,3,0,0]} />
                    <Bar dataKey="Total Equity"      fill={CHART_COLORS.secondary} radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrap>
            </section>
          </FadeInUp>
        )}

        {/* Cash flow chart */}
        {cashData.length > 0 && (
          <FadeInUp>
            <section>
              <SectionLabel>Cash flow (USD billions)</SectionLabel>
              <ChartWrap>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={cashData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={48} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#666" }} />
                    <Line type="monotone" dataKey="Operating CF"   stroke={CHART_COLORS.primary}   strokeWidth={1.5} dot={{ r: 3, fill: CHART_COLORS.primary }}   />
                    <Line type="monotone" dataKey="Free Cash Flow" stroke={CHART_COLORS.secondary} strokeWidth={1.5} dot={{ r: 3, fill: CHART_COLORS.secondary }} />
                    <Line type="monotone" dataKey="Capex"          stroke={CHART_COLORS.negative}  strokeWidth={1.5} dot={{ r: 3, fill: CHART_COLORS.negative }}  />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrap>
            </section>
          </FadeInUp>
        )}

      </div>
    </div>
  );
}
