import { motion } from 'framer-motion'

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      className="glass-panel auth-shine rounded-[20px] border border-white/60 p-5 shadow-[0_18px_50px_rgba(148,163,184,0.15)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_22px_60px_rgba(37,99,235,0.18)]"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
        {title}
      </h3>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </motion.article>
  )
}

export default FeatureCard
