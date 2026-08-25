import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthCard from '../components/AuthCard'
import FeatureCard from '../components/FeatureCard'
import Logo from '../components/Logo'
import CareerFlowIllustration from '../assets/illustrations/CareerFlowIllustration'

const features = []

function Login() {
  const [selectedRole, setSelectedRole] = useState('job-seeker')
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [resetToken, setResetToken] = useState('')
  const navigate = useNavigate()

  function handleModeChange(nextMode) {
    setMode(nextMode)
    setMessage('')
    if (nextMode !== 'forgot') setResetToken('')
  }

  async function authenticate(form) {
    setMessage('')
    try {
      setLoading(true)
      const endpoint = mode === 'forgot' ? resetToken ? 'reset-password' : 'forgot-password' : mode === 'register' ? 'register' : 'login'
      const response = await fetch(`/api/auth/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, role: selectedRole, resetToken }) })
      const text = await response.text()
      let data = {}
      try { data = text ? JSON.parse(text) : {} } catch { throw new Error('The API returned an invalid response. Make sure npm run dev is running.') }
      if (!response.ok) {
        if (data.code === 'USER_NOT_FOUND' && mode === 'login') {
          setMode('register')
          throw new Error('No account was found. Complete registration to create one.')
        }
        throw new Error(data.message || 'The request could not be completed. Make sure the API server is running.')
      }
      if (mode === 'forgot') {
        if (!resetToken) {
          setResetToken(data.resetToken)
          setMessage(data.message)
          return
        }
        setResetToken('')
        setMode('login')
        setMessage(data.message)
        return
      }
      localStorage.setItem('jobekaa_token', data.token)
      localStorage.setItem('jobekaa_user', JSON.stringify(data.user))
      navigate(data.user.role === 'recruiter' ? '/recruiter' : '/job-seeker')
    } catch (error) { setMessage(error.message || 'Unable to continue. Please try again.') } finally { setLoading(false) }
  }

  return (
    <main className="relative h-screen px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-80" />
      <div className="aurora-ring" />

      <div className="relative mx-auto flex h-full w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/56 shadow-[0_35px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:flex-row">
        <section className="relative flex w-full flex-col justify-between overflow-hidden px-6 py-7 sm:px-8 lg:w-[45%] lg:px-10 lg:py-8">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(239,246,255,0.52))]" />
          <div className="relative z-10">
            <Logo />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.21, 1, 0.29, 1] }}
              className="mt-12 max-w-xl"
            >
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.02]">
                Find Your Dream Job with AI
              </h1>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.12 + index * 0.1}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <CareerFlowIllustration />
          </div>
        </section>

        <section className="relative flex w-full items-center justify-center overflow-hidden px-4 py-4 sm:px-8 sm:py-4 lg:w-[55%] lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.82),rgba(255,255,255,0.64))]" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-10 left-10 hidden h-24 w-24 rounded-full bg-blue-100/70 blur-2xl lg:block"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1 }}
            className="absolute right-10 bottom-12 hidden h-28 w-28 rounded-full bg-cyan-100/80 blur-2xl lg:block"
          />

          <div className="relative z-10 w-full">
            <AuthCard selectedRole={selectedRole} onRoleChange={setSelectedRole} mode={mode} onModeChange={handleModeChange} onSubmit={authenticate} loading={loading} message={message} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
