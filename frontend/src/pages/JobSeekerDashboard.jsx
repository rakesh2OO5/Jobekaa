import { useRef, useState } from 'react'
import { CheckCircle2, ExternalLink, Upload } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { api } from '../lib/api'

const meaningfulText = (value) => typeof value === 'string' && value.trim() && !/^\.+$/.test(value.trim())
const normalizeStringArray = (value) => (Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,;\n]/) : []).map((item) => typeof item === 'string' ? item.trim() : '').filter(meaningfulText)
const list = (value) => Array.isArray(value) ? value : []
const normalizeNamedItems = (value, field, extras = []) => list(value).filter((item) => item && typeof item === 'object' && meaningfulText(item[field])).map((item) => Object.fromEntries([[field, item[field].trim()], ...extras.map((key) => [key, meaningfulText(item[key]) ? item[key].trim() : ''])]))

function JobSeekerDashboard() {
  const [resume, setResume] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobs, setJobs] = useState([])
  const [links, setLinks] = useState([])
  const [location, setLocation] = useState(() => sessionStorage.getItem('jobekaa_job_location') || 'india')
  const jobsSectionRef = useRef(null)

  async function loadJobs(data, scope = location) {
    setJobsLoading(true)
    try {
      const query = new URLSearchParams({ role: data.bestJobRole?.title || '', skills: normalizeStringArray(data.resume?.skills).slice(0, 5).join(','), location: scope })
      const response = await api(`/jobs/recommended?${query}`)
      setJobs(list(response.jobs)); setLinks(list(response.fallbackSearchLinks))
    } catch { setJobs([]) } finally { setJobsLoading(false) }
  }

  async function submit(event) {
    event.preventDefault(); setError(''); setJobs([])
    const body = new FormData(); body.append('resume', resume)
    try {
      setLoading(true)
      const response = await api('/analysis/resume', { method: 'POST', body })
      if (!response.success || !response.data) throw new Error(response.message || 'The analysis response was incomplete.')
      setAnalysis(response.data); await loadJobs(response.data)
    } catch (requestError) { setError(requestError.message || 'We could not complete the resume analysis.') } finally { setLoading(false) }
  }

  function changeLocation(event) { const next = event.target.value; setLocation(next); sessionStorage.setItem('jobekaa_job_location', next); if (analysis) loadJobs(analysis, next) }
  const strengths = normalizeStringArray(analysis?.strengths); const gaps = normalizeNamedItems(analysis?.missingSkills, 'skill', ['reason']); const improvements = normalizeNamedItems(analysis?.improvementSuggestions, 'category', ['suggestion']).filter((item) => item.suggestion); const alternatives = list(analysis?.alternativeRoles).filter((item) => item && meaningfulText(item.title) && Number.isFinite(Number(item.score))).map((item) => ({ title: item.title.trim(), score: Number(item.score) })); const missingSections = normalizeNamedItems(analysis?.missingSections, 'section', ['reason'])

  return <DashboardShell title={analysis ? 'Your career fit' : 'Make your resume work harder'} subtitle={analysis ? 'AI-powered analysis and India-focused job discovery.' : 'Upload your resume for an AI-ready review of missing sections, role fit, and practical next steps.'}>
    <form onSubmit={submit} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8"><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center"><Upload className="mb-3 h-8 w-8 text-blue-600" /><span className="font-semibold text-slate-800">Upload your resume</span><span className="mt-1 text-sm text-slate-500">PDF or DOCX. Maximum 10MB.</span><input required accept=".pdf,.docx" type="file" className="sr-only" onChange={(event) => setResume(event.target.files[0])} /><span className="mt-3 text-sm font-medium text-blue-700">{resume ? resume.name : 'Choose file'}</span></label>{error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}<button disabled={loading} className="mt-5 w-full cursor-pointer rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70">{loading ? 'Analyzing your resume...' : 'Review my resume'}</button></form>
    {analysis ? <section className="mt-8 space-y-5"><article className="rounded-[28px] bg-blue-600 p-6 text-white sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Best career match</p><h2 className="mt-2 text-3xl font-semibold">{analysis.bestJobRole?.title}</h2><p className="mt-3 text-5xl font-semibold">{analysis.bestJobRole?.score}% <span className="text-base font-medium">match</span></p><p className="mt-4 max-w-2xl text-sm text-blue-100">{analysis.bestJobRole?.reason}</p><button type="button" onClick={() => jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="mt-5 cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700">Find matching jobs</button></article>
      {strengths.length ? <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Why this role?</h2><div className="mt-4 flex flex-wrap gap-2">{strengths.map((strength) => <span key={strength} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800"><CheckCircle2 className="h-3.5 w-3.5" />{strength}</span>)}</div></article> : null}
      <section ref={jobsSectionRef} className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-950">Recommended jobs</h2><p className="mt-1 text-sm text-slate-500">Latest available opportunities for Indian job seekers.</p></div><label className="text-sm font-medium text-slate-600">Location <select value={location} onChange={changeLocation} className="ml-2 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2"><option value="india">India</option><option value="remote-india">Remote India</option><option value="global">Global</option></select></label></div>{jobsLoading ? <p className="mt-5 text-sm text-slate-500">Finding matching opportunities...</p> : jobs.length ? <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">{jobs.slice(0, 6).map((job) => <article key={job.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{job.title}</h3><p className="text-sm text-slate-600">{job.company}</p></div><b className="text-blue-700">{Number.isFinite(Number(job.matchScore)) ? `${job.matchScore}%` : 'Match unavailable'}</b></div><p className="mt-3 text-sm text-slate-500">{job.originalLocation} · {list(job.type).join(', ')}</p>{normalizeStringArray(job.matchedSkills).length ? <p className="mt-2 text-xs text-emerald-700">Matched: {normalizeStringArray(job.matchedSkills).slice(0, 4).join(', ')}</p> : null}<div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Source: Jobicy</span><a href={job.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-blue-700">Apply <ExternalLink className="h-3.5 w-3.5" /></a></div></article>)}</div> : <p className="mt-5 text-sm text-slate-500">No India-eligible opportunities are available from the current source. Try the job boards below.</p>}</section>
      {gaps.length ? <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Skills to improve</h2>{gaps.map((gap) => <p key={gap.skill} className="mt-3 text-sm text-slate-600"><b>{gap.skill}</b>{gap.reason ? ` · ${gap.reason}` : ''}</p>)}<p className="mt-4 text-xs text-slate-500">Only add skills after you genuinely acquire or demonstrate them.</p></article> : null}
      {improvements.length ? <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Resume improvements</h2>{improvements.slice(0, 3).map((item, index) => <p key={`${item.category}-${index}`} className="mt-3 text-sm text-slate-600"><b className="text-blue-700">{item.category}</b><br />{item.suggestion}</p>)}</article> : null}
      {missingSections.length ? <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Resume sections to consider</h2>{missingSections.map((item) => <p key={item.section} className="mt-3 text-sm text-slate-600"><b>{item.section}</b> · {item.reason}</p>)}</article> : null}
      {alternatives.length ? <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Other roles worth exploring</h2><div className="mt-4 grid items-start gap-3 sm:grid-cols-3">{alternatives.map((role) => <p key={role.title} className="rounded-xl bg-slate-50 p-3 text-sm"><b>{role.title}</b><span className="float-right text-blue-700">{role.score}%</span></p>)}</div></article> : null}
      {links.length ? <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">More places to apply</h2><div className="mt-3 flex flex-wrap gap-2">{links.map((link) => <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-blue-100">{link.name}</a>)}</div></article> : null}
      {normalizeStringArray(analysis.resume?.skills).length || list(analysis.resume?.projects).length || list(analysis.resume?.education).length || list(analysis.resume?.experience).length ? <details className="rounded-2xl border border-slate-200 bg-white p-6"><summary className="cursor-pointer font-semibold">View extracted resume details</summary><div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">{normalizeStringArray(analysis.resume?.skills).length ? <p><b>Skills:</b> {normalizeStringArray(analysis.resume.skills).join(', ')}</p> : null}{list(analysis.resume?.projects).length ? <p><b>Projects:</b> {analysis.resume.projects.length}</p> : null}{list(analysis.resume?.education).length ? <p><b>Education:</b> {analysis.resume.education.length}</p> : null}{list(analysis.resume?.experience).length ? <p><b>Experience:</b> {analysis.resume.experience.length}</p> : null}</div></details> : null}</section> : null}
  </DashboardShell>
}

export default JobSeekerDashboard
