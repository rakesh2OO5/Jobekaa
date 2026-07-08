import { motion } from 'framer-motion'
import { BriefcaseBusiness, Building2 } from 'lucide-react'

const roles = [
  { value: 'job-seeker', label: 'Job Seeker', icon: BriefcaseBusiness },
  { value: 'recruiter', label: 'Recruiter', icon: Building2 },
]

function RoleToggle({ selectedRole, onChange }) {
  return (
    <div
      className="rounded-2xl bg-slate-100/85 p-1.5"
      role="tablist"
      aria-label="Continue as"
    >
      <div className="grid grid-cols-2 gap-1.5">
        {roles.map((role) => {
          const isActive = selectedRole === role.value
          const Icon = role.icon

          return (
            <button
              key={role.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(role.value)}
              className={`relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive ? 'text-slate-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="role-highlight"
                  className="absolute inset-0 rounded-[18px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {role.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default RoleToggle
