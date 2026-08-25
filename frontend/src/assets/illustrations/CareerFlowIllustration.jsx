import { motion } from 'framer-motion'

function CareerFlowIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative mx-auto mt-10 w-full max-w-[520px]"
      aria-hidden="true"
    >
      <div className="absolute inset-x-10 bottom-0 h-14 rounded-full bg-blue-200/30 blur-2xl" />
      <svg viewBox="0 0 540 360" className="relative w-full">
        <defs>
          <linearGradient id="jobekaa-card" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eff6ff" />
          </linearGradient>
          <linearGradient id="jobekaa-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        <rect x="40" y="36" width="285" height="196" rx="28" fill="url(#jobekaa-card)" />
        <rect
          x="40"
          y="36"
          width="285"
          height="196"
          rx="28"
          stroke="rgba(148,163,184,0.18)"
          fill="none"
        />
        <rect x="68" y="68" width="84" height="12" rx="6" fill="#BFDBFE" />
        <rect x="68" y="94" width="132" height="12" rx="6" fill="#DBEAFE" />
        <rect x="68" y="126" width="232" height="18" rx="9" fill="#E2E8F0" />
        <rect x="68" y="156" width="176" height="12" rx="6" fill="#E2E8F0" />
        <rect x="68" y="182" width="204" height="12" rx="6" fill="#E2E8F0" />

        <rect x="220" y="66" width="78" height="78" rx="22" fill="#0F172A" />
        <path
          d="M244 116c9-18 22-26 30-16 7 9-3 32-20 37-12 4-21-5-10-21Z"
          fill="#60A5FA"
        />
        <circle cx="276" cy="99" r="8" fill="#F8FAFC" />
        <path d="M282 206h-44a6 6 0 0 1 0-12h44a6 6 0 0 1 0 12Z" fill="#2563EB" />

        <rect x="338" y="86" width="156" height="182" rx="30" fill="#0F172A" />
        <rect x="356" y="110" width="120" height="128" rx="24" fill="#111827" />
        <path d="M376 204c20-28 42-33 66-14 14 12 23 12 34 1" stroke="url(#jobekaa-line)" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="390" cy="174" r="10" fill="#10B981" />
        <circle cx="430" cy="152" r="10" fill="#60A5FA" />
        <circle cx="462" cy="188" r="10" fill="#BFDBFE" />
        <rect x="372" y="254" width="86" height="12" rx="6" fill="#1D4ED8" />

        <path
          d="M188 248c22 20 52 31 83 31 48 0 91-24 117-61"
          stroke="url(#jobekaa-line)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="12 14"
        />
        <circle cx="189" cy="248" r="16" fill="#2563EB" />
        <circle cx="388" cy="218" r="18" fill="#DBEAFE" />
      </svg>
    </motion.div>
  )
}

export default CareerFlowIllustration
