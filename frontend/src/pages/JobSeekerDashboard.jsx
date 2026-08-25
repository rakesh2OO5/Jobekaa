import { useState } from 'react'
import { CheckCircle2, Upload } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { api } from '../lib/api'

function JobSeekerDashboard() {
  const [resume, setResume] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); setError('')
    const data = new FormData(); data.append('resume', resume)
    try { setLoading(true); setResult(await api('/analysis/job-seeker/analyze', { method: 'POST', body: data })) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }
  return <DashboardShell title="Make your resume work harder" subtitle="Upload your resume for an AI-ready review of missing sections, role fit, and practical next steps.">
    <form onSubmit={submit} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8"><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center transition hover:border-blue-300 hover:bg-blue-50/40"><Upload className="mb-3 h-8 w-8 text-blue-600" /><span className="font-semibold text-slate-800">Upload your resume</span><span className="mt-1 text-sm text-slate-500">PDF, DOC, or DOCX. Maximum 10MB.</span><input required accept=".pdf,.doc,.docx" type="file" className="sr-only" onChange={(event) => setResume(event.target.files[0])} /><span className="mt-3 text-sm font-medium text-blue-700">{resume ? resume.name : 'Choose file'}</span></label>{error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}<button disabled={loading} className="mt-6 w-full cursor-pointer rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{loading ? 'Reviewing resume...' : 'Review my resume'}</button></form>
    {result ? <section className="mt-8 grid gap-5 md:grid-cols-3"><article className="rounded-2xl bg-blue-600 p-6 text-white"><p className="text-sm font-medium text-blue-100">Role match</p><p className="mt-2 text-5xl font-semibold">{result.matchScore}%</p><p className="mt-3 text-sm text-blue-100">Development-only score until your provider is configured.</p></article><article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold text-slate-900">Closest roles</h2><div className="mt-4 space-y-2">{result.closestRoles?.map((role) => <p key={role} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{role}</p>)}</div></article><article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold text-slate-900">Missing sections</h2><div className="mt-4 space-y-2">{result.missingSections?.map((section) => <p key={section} className="text-sm text-slate-600">{section}</p>)}</div></article><article className="rounded-2xl border border-slate-200 bg-white p-6 md:col-span-3"><h2 className="font-semibold text-slate-900">Recommended next steps</h2><div className="mt-3 space-y-2">{result.suggestions?.map((suggestion) => <p key={suggestion} className="text-sm text-slate-600">{suggestion}</p>)}</div></article></section> : null}
  </DashboardShell>
}
export default JobSeekerDashboard
