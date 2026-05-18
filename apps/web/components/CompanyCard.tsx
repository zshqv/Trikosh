"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

interface CompanyCardProps {
  ticker: string;
  name: string;
  sector: string;
  latest_ratios?: {
    net_margin?: number;
    return_on_equity?: number;
    price_to_earnings?: number;
  } | null;
  latest_income?: {
    revenue?: number;
  } | null;
}

const SECTOR_COLORS: Record<string, string> = {
  "Financial Services":     "#d4a853",
  "Healthcare":             "#4aad7a",
  "Technology":             "#6b9fd4",
  "Communication Services": "#a87fd4",
};

function fmt(n: number | undefined | null, type: "pct" | "x" | "b"): string {
  if (n == null) return "—";
  if (type === "pct") return `${(n * 100).toFixed(1)}%`;
  if (type === "x")   return `${parseFloat(n.toFixed(1))}x`;
  if (type === "b")   return `$${(n / 1e9).toFixed(1)}B`;
  return "—";
}

export default function CompanyCard({
  ticker,
  name,
  sector,
  latest_ratios,
  latest_income,
}: CompanyCardProps) {
  const [hovered, setHovered] = useState(false);
  const sectorColor = SECTOR_COLORS[sector] ?? "var(--text-muted)";

  const metrics = [
    { label: "Revenue",    value: fmt(latest_income?.revenue, "b") },
    { label: "Net Margin", value: fmt(latest_ratios?.net_margin, "pct") },
    { label: "ROE",        value: fmt(latest_ratios?.return_on_equity, "pct") },
  ];

  return (
    <Link
      href={`/companies/${ticker}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{
          backgroundColor: hovered ? "var(--surface-2)" : "var(--surface)",
          border: "0.5px solid var(--border)",
          borderColor: hovered ? "rgba(255,255,255,0.12)" : "var(--border)",
          borderRadius: "8px",
          padding: "20px",
          overflow: "hidden",
          position: "relative",
          transition: "background-color 0.15s ease, border-color 0.15s ease",
        }}
      >
        {/* Amber top border slides in on hover */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: sectorColor,
            transformOrigin: "left",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "18px",
              fontWeight: 500,
              color: "var(--amber)",
              letterSpacing: "0.02em",
            }}
          >
            {ticker}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 500,
              color: sectorColor,
              backgroundColor: `${sectorColor}18`,
              border: `0.5px solid ${sectorColor}40`,
              borderRadius: "4px",
              padding: "3px 7px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {sector === "Communication Services"
              ? "Comm."
              : sector === "Financial Services"
                ? "Financial"
                : sector}
          </span>
        </div>

        {/* Company name */}
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "18px",
            lineHeight: "1.4",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </p>

        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            borderTop: "0.5px solid var(--border)",
            paddingTop: "14px",
          }}
        >
          {metrics.map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  fontSize: "10px",
                  color: "var(--text-subtle)",
                  marginBottom: "3px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  fontWeight: 400,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
