"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export interface ArchiveExcerptCardProps {
  portraitSrc: string;
  fileName?: string;
  excerptBefore?: string;
  highlighted?: string;
  excerptAfter?: string;
  citation?: string;
  className?: string;
}

export function ArchiveExcerptCard({
  portraitSrc,
  fileName = "noli_me_tangere_1887.pdf",
  excerptBefore = "Chapter 1 opens on a homecoming: a young reformist returns to",
  highlighted = "a town still ruled by friars and old fears",
  excerptAfter = ".",
  citation = "[1] Noli Me Tangere, Ch. 1 — Rizal, 1887",
  className = "",
}: ArchiveExcerptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: -3, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      whileHover={{
        y: -6,
        rotate: -1,
        boxShadow: "0 24px 48px rgba(32,31,28,0.16)",
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        default: { type: "spring", stiffness: 260, damping: 24 },
      }}
      className={`absolute top-0 left-0 w-[340px] bg-white border border-[#E6E2D8] rounded-xl shadow-md p-5 cursor-default will-change-transform ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EFEDE6]">
        <Image
          src={portraitSrc}
          alt="José Rizal"
          width={24}
          height={24}
          className="rounded-full object-cover border border-[#E6E2D8]"
          unoptimized
        />
        <span className="font-mono text-[11px] text-[#9C988E]">{fileName}</span>
      </div>

      <p className="font-display text-[15px] leading-relaxed text-[#2A2926]">
        {excerptBefore}{" "}
        <motion.span
          initial={{ backgroundColor: "rgba(246,234,230,0)" }}
          animate={{ backgroundColor: "rgba(246,234,230,1)" }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded px-1 py-0.5 inline"
        >
          {highlighted}
          <sup className="text-[#8C2F2F] font-mono text-[10px] ml-0.5">1</sup>
        </motion.span>
        {excerptAfter}
      </p>

      <div className="mt-4 pt-3 border-t border-[#EFEDE6] flex items-start gap-2">
        <Quote className="w-3 h-3 text-[#8C2F2F] mt-0.5 shrink-0" />
        <span className="font-mono text-[11px] text-[#6B6862]">{citation}</span>
      </div>
    </motion.div>
  );
}

export default ArchiveExcerptCard;