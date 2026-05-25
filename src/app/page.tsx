"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface ApiResult {
  success?: boolean;
  type?: string;
  data?: {
    url?: string;
    width?: number;
    height?: number;
    duration?: number;
    thumbnail?: string;
  };
  error?: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Pinterest URL dalo bhai!");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.error || "Kuch gadbad ho gayi");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error, dobara try karo");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      setError("Clipboard access nahi mila, manually paste karo");
    }
  };

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return null;
    const secs = Math.floor(ms / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const mediaUrl = result?.data?.url;
  const thumbnail = result?.data?.thumbnail;
  const duration = formatDuration(result?.data?.duration);
  const isVideo = result?.type === "video";

  return (
    <main className={styles.main}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          <span>PinSave</span>
        </div>
        <nav className={styles.nav}>
          <span>Free</span>
          <span>Fast</span>
          <span>No Signup</span>
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>✦ 100% Free Tool</div>
        <h1 className={styles.title}>
          Pinterest Videos<br />
          <span className={styles.accent}>Download Karo</span>
        </h1>
        <p className={styles.subtitle}>
          Koi bhi Pinterest pin ka link paste karo — video ya image turant download ho jayegi
        </p>

        <div className={styles.inputWrap}>
          <div className={styles.inputBox}>
            <svg className={styles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://pin.it/... ya pinterest.com/pin/..."
              className={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            />
            <button onClick={handlePaste} className={styles.pasteBtn}>Paste</button>
          </div>
          <button onClick={handleDownload} disabled={loading} className={styles.downloadBtn}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Karo
              </>
            )}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
      </section>

      {/* Result */}
      {result && mediaUrl && (
        <section className={styles.resultSection}>
          <div className={styles.resultCard}>
            {thumbnail && (
              <div className={styles.thumbWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbnail} alt="Pinterest thumbnail" className={styles.thumb} />
                {isVideo && (
                  <div className={styles.thumbOverlay}>
                    <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                )}
              </div>
            )}

            <div className={styles.resultInfo}>
              <div className={styles.metaRow}>
                <span className={styles.qualityBadge}>{isVideo ? "🎬 Video" : "🖼️ Image"}</span>
                {duration && <span className={styles.duration}>⏱ {duration}</span>}
                {result.data?.width && result.data?.height && (
                  <span className={styles.duration}>{result.data.width}×{result.data.height}</span>
                )}
              </div>

              <div className={styles.linksGrid}>
                <div className={styles.linkRow}>
                  <div className={styles.linkInfo}>
                    <span className={styles.extBadge}>{isVideo ? ".mp4" : ".jpg"}</span>
                    <span className={styles.urlPreview}>{mediaUrl.slice(0, 48)}...</span>
                  </div>
                  <div className={styles.linkActions}>
                    <button onClick={() => copyLink(mediaUrl)} className={styles.copyBtn}>
                      {copied ? "✓ Copied!" : "Copy Link"}
                    </button>
                    <a
                      href={mediaUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.dlBtn}
                    >
                      ↓ Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Steps */}
      <section className={styles.steps}>
        <h2 className={styles.stepsTitle}>Itna Easy Hai</h2>
        <div className={styles.stepsGrid}>
          {[
            { num: "01", title: "Link Copy Karo", desc: "Pinterest pe koi bhi pin kholo aur uska URL copy karo" },
            { num: "02", title: "Paste Karo", desc: "Upar wale box mein link paste karo" },
            { num: "03", title: "Download Karo", desc: "Download button dabao aur file save ho jayegi" },
          ].map((s) => (
            <div key={s.num} className={styles.step}>
              <span className={styles.stepNum}>{s.num}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>PinSave — Sirf personal use ke liye. Pinterest ke terms follow karo.</p>
      </footer>
    </main>
  );
          }
              
