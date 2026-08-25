import { useState } from 'react'
import { FileText, Upload } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { api } from '../lib/api'

function RecruiterDashboard() {
  const [resumes, setResumes] = useState([])
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    const data = new FormData()
    data.append('jobDescription', jobDescription)
    resumes.forEach((file) => data.append('resumes', file))
    try {
      setLoading(true)
      setResult(await api('/analysis/recruiter/match', { method: 'POST', body: data }))
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  return <DashboardShell title="Find the strongest candidates" subtitle="Upload up to 50 resumes and a job description. Jobekaa will return the ten closest matches.">
    <form onSubmit={submit} className="grid gap-6 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
      <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Job description</span><textarea required value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows="7" placeholder="Paste the role, responsibilities, requirements, and must-have skills..." className="w-full cursor-text rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" /></label>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-9 text-center transition hover:border-blue-300 hover:bg-blue-50/40"><Upload className="mb-3 h-7 w-7 text-blue-600" /><span className="font-semibold text-slate-800">Upload resumes</span><span className="mt-1 text-sm text-slate-500">PDF, DOC, or DOCX. Maximum 50 files, 10MB each.</span><input required multiple accept=".pdf,.doc,.docx" type="file" className="sr-only" onChange={(event) => setResumes([...event.target.files])} /><span className="mt-3 text-sm font-medium text-blue-700">{resumes.length ? `${resumes.length} resume(s) selected` : 'Choose files'}</span></label>
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      <button disabled={loading} className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{loading ? 'Ranking resumes...' : 'Find top 10 matches'}</button>
    </form>
    {result ? <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="mb-5 text-sm text-amber-700">{result.message}</p><div className="space-y-3">{result.rankedCandidates?.map((candidate, index) => <article key={candidate.name} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{index + 1}</span><FileText className="h-5 w-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900">{candidate.name}</p><p className="text-sm text-slate-500">{candidate.highlights?.join(' · ')}</p></div><span className="font-bold text-emerald-600">{candidate.score}%</span></article>)}</div></section> : null}
  </DashboardShell>
}
export default RecruiterDashboard
