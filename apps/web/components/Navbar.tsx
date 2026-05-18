"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

function GithubIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/sectors",   label: "Sectors" },
  { href: "/compare",   label: "Compare" },
  { href: "/glossary",  label: "Glossary" },
  { href: "/research",  label: "Research" },
] as const;

const GITHUB_URL = "https://github.com/ashutoshatri/trikosh";

export default function Navbar() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(10, 10, 10, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--amber)",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            Trikosh
          </Link>

          {/* ── Center nav links (desktop) ── */}
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              listStyle: "none",
              margin: 0,
              padding: 0,
              flex: 1,
              justifyContent: "center",
            }}
            className="nav-links-desktop"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href} style={{ position: "relative" }}>
                  <Link
                    href={href}
                    style={{
                      display: "block",
                      padding: "6px 12px",
                      fontSize: "13px",
                      fontWeight: active ? 500 : 400,
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      backgroundColor: "transparent",
                      letterSpacing: "0.01em",
                      transition: "color 0.15s ease",
                      position: "relative",
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                      }
                    }}
                  >
                    {label}
                    {/* Active amber underline */}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "12px",
                          right: "12px",
                          height: "1.5px",
                          backgroundColor: "var(--amber)",
                          borderRadius: "1px",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right: GitHub + Auth ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                transition: "color 0.15s ease",
                padding: "4px",
                borderRadius: "4px",
              }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)")
              }
            >
              <GithubIcon size={17} />
            </a>

            <SignedOut>
              <SignInButton mode="modal">
                <button
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    border: "0.5px solid rgba(255,255,255,0.10)",
                    borderRadius: "6px",
                    padding: "5px 12px",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.20)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.10)";
                  }}
                >
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: { width: "28px", height: "28px" },
                  },
                }}
              />
            </SignedIn>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setOpen(v => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="mobile-menu-btn"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: "56px",
              left: 0,
              right: 0,
              zIndex: 49,
              backgroundColor: "rgba(10, 10, 10, 0.97)",
              backdropFilter: "blur(12px)",
              borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "12px 24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      style={{
                        display: "block",
                        padding: "10px 12px",
                        fontSize: "14px",
                        fontWeight: active ? 500 : 400,
                        color: active ? "var(--amber)" : "var(--text-muted)",
                        backgroundColor: "transparent",
                        letterSpacing: "0.01em",
                        borderLeft: active ? "2px solid var(--amber)" : "2px solid transparent",
                        paddingLeft: "14px",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
