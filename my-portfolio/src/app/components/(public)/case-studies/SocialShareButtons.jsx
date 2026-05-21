// components/case-studies/SocialShareButton.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FacebookShareButton from './FacebookShareButton';
import TwitterShareButton from './TwitterShareButton';
import LinkedInShareButton from './LinkedInShareButton';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVertical = {
  hidden: { opacity: 0, x: 10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const itemInline = {
  hidden: { opacity: 0, y: 6 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

function CopyButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy link'}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.88 }}
      animate={copied ? { scale: [1, 1.18, 1] } : { scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`
        flex items-center justify-center w-9 h-9 rounded-full border
        cursor-pointer outline-none select-none transition-colors duration-200
        ${copied
          ? 'border-emerald-300 bg-emerald-50 text-emerald-500'
          : 'border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-400'
        }
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{    scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="link"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{    scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function SocialShareButton({ title, description, url, vertical = false }) {
  const post = { title, description };

  const buttons = [
    <FacebookShareButton key="fb" post={post} url={url} />,
    <TwitterShareButton  key="tw" post={post} url={url} />,
    <LinkedInShareButton key="li" post={post} url={url} />,
    <CopyButton          key="cp" url={url} />,
  ];

  // ── Vertical (desktop sidebar) ──
  if (vertical) {
    return (
      <motion.div
        className="flex flex-col items-center gap-3 px-2.5 py-4 rounded-2xl bg-white border border-gray-400 shadow-sm"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <span className="text-[9px] font-bold tracking-widest uppercase text-gray-300 text-center leading-tight">
          Share
        </span>

        <motion.div
          className="flex flex-col items-center gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {buttons.map((btn) => (
            <motion.div key={btn.key} variants={itemVertical}>
              {btn}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  // ── Inline (mobile) — no "Share" label, just the icon buttons ──
  return (
    <motion.div
      className="inline-flex items-center gap-1 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className="flex items-center gap-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {buttons.map((btn) => (
          <motion.div key={btn.key} variants={itemInline}>
            {btn}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}