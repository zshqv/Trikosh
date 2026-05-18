"use client";

import { useEffect, useState, useMemo } from "react";
import CompanyCard from "@/components/CompanyCard";
import { Search } from "lucide-react";
import { motion } from "motion/react";

interface Company {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  latest_ratios: { net_margin?: number; return_on_equity?: number } | null;
  latest_income: { revenue?: number } | null;
}

const TABS = ["All", "Financial Services", "Healthcare", "Technology", "Communication Services"];

function CardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "0.5px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
        animation: "pulse 2s cubic-bezier(.4,0,.6,1) infinite",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ width: "60px", height: "20px", backgroundColor: "var(--surface-2)", borderRadius: "4px" }} />
        <div style={{ width: "70px", height: "16px", backgroundColor: "var(--surface-2)", borderRadius: "4px" }} />
      </div>
      <div style={{ width: "140px", height: "14px", backgroundColor: "var(--surface-2)", borderRadius: "4px", marginBottom: "18px" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          borderTop: "0.5px solid var(--border)",
          paddingTop: "14px",
        }}
      >
        {[0, 1, 2].map(i => (
          <div key={i}>
            <div style={{ width: "40px", height: "10px", backgroundColor: "var(--surface-2)", borderRadius: "3px", marginBottom: "6px" }} />
            <div style={{ width: "50px", height: "14px", backgroundColor: "var(--surface-2)", borderRadius: "3px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [query, setQuery]         = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetch("/api/companies")
      .then(r => r.json())
      .then(d => {
        setCompanies(d.companies ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load company data. Check your database connection.");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchTab   = activeTab === "All" || c.sector === activeTab;
      const q          = query.toLowerCase();
      const matchQuery = !q || c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [companies, activeTab, query]);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
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
            Coverage
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Companies
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            30 global companies across Financial Services, Healthcare, and Technology.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{ position: "relative", maxWidth: "420px", marginBottom: "16px" }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-subtle)",
            }}
          />
          <input
            type="text"
            placeholder="Search by ticker or name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "var(--surface)",
              border: "0.5px solid var(--border)",
              borderRadius: "6px",
              padding: "9px 12px 9px 34px",
              fontSize: "13px",
              color: "var(--text-primary)",
              outline: "none",
              transition: "border-color 0.15s ease",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "28px",
            overflowX: "auto",
            paddingBottom: "2px",
          }}
        >
          {TABS.map(tab => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--amber)" : "var(--text-muted)",
                  backgroundColor: active ? "rgba(212,168,83,0.08)" : "transparent",
                  border: `0.5px solid ${active ? "rgba(212,168,83,0.25)" : "transparent"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s ease, background-color 0.15s ease",
                }}
              >
                {tab}
              </button>
            );
          })}
        </motion.div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(217,95,95,0.08)",
              border: "0.5px solid rgba(217,95,95,0.25)",
              borderRadius: "6px",
              padding: "16px 20px",
              color: "var(--red)",
              fontSize: "13px",
              marginBottom: "28px",
            }}
          >
            {error}
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "12px",
          }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "72px 0",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  No companies match &ldquo;{query}&rdquo;.
                </div>
              )
              : filtered.map((c, i) => (
                <motion.div
                  key={c.ticker}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(i * 0.03, 0.3) }}
                >
                  <CompanyCard
                    ticker={c.ticker}
                    name={c.name}
                    sector={c.sector}
                    latest_ratios={c.latest_ratios}
                    latest_income={c.latest_income}
                  />
                </motion.div>
              ))
          }
        </div>

        {/* Count line */}
        {!loading && !error && (
          <p
            style={{
              marginTop: "28px",
              fontSize: "11px",
              color: "var(--text-subtle)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {filtered.length} / {companies.length} companies
          </p>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
