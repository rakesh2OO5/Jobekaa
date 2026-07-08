import { motion } from 'framer-motion'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import InputField from './InputField'
import RoleToggle from './RoleToggle'
import SocialButtons from './SocialButtons'

function AuthCard({ selectedRole, onRoleChange }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 42 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.21, 1, 0.29, 1] }}
      className="glass-panel w-full max-w-[420px] rounded-[28px] border border-white/70 bg-white/88 p-7 shadow-[0_32px_80px_rgba(15,23,42,0.12)] sm:p-8"
      aria-labelledby="auth-title"
    >
      <div className="mb-8">
        <h2
          id="auth-title"
          className="text-3xl font-semibold tracking-[-0.05em] text-slate-950"
        >
          Welcome to Jobekaa
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">Continue As</p>
          <RoleToggle selectedRole={selectedRole} onChange={onRoleChange} />
        </div>

        <form className="space-y-5">
          <div className="relative">
            <Mail className="pointer-events-none absolute top-[44px] right-4 h-4 w-4 text-slate-400" />
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@jobekaa.com"
            />
          </div>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute top-[44px] right-4 h-4 w-4 text-slate-400" />
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="inline-flex cursor-pointer items-center gap-3 text-slate-500">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember Me
            </label>
            <a
              href="/"
              className="cursor-pointer font-medium text-slate-600 transition duration-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="button-ripple inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-medium text-white shadow-[0_22px_45px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Sign In
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <SocialButtons />
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <a
          href="/"
          className="inline-flex cursor-pointer font-semibold text-slate-950 transition duration-300 hover:translate-x-0.5 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Create Account
        </a>
      </p>
    </motion.section>
  )
}

export default AuthCard
