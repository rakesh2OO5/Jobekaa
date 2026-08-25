import { Router } from 'express'
import multer from 'multer'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 50 } })
const allowedFile = (file) => /\.(pdf|doc|docx)$/i.test(file.originalname)

async function callProvider(url, payload) {
  if (!url || url.includes('example.invalid')) return null
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY || ''}` }, body: JSON.stringify(payload) })
  if (!response.ok) throw new Error('The analysis provider could not process this request.')
  return response.json()
}

router.post('/recruiter/match', requireAuth, requireRole('recruiter'), upload.array('resumes', 50), async (req, res, next) => {
  try {
    const resumes = req.files || []
    if (!req.body.jobDescription?.trim()) return res.status(400).json({ message: 'A job description is required.' })
    if (!resumes.length || resumes.some((file) => !allowedFile(file))) return res.status(400).json({ message: 'Upload 1 to 50 PDF, DOC, or DOCX resumes.' })
    const provider = await callProvider(process.env.AI_RESUME_RANKING_URL, { jobDescription: req.body.jobDescription, resumes: resumes.map((file) => ({ name: file.originalname, content: file.buffer.toString('base64') })) })
    if (provider) return res.json(provider)
    return res.json({ mode: 'mock', rankedCandidates: resumes.map((file, index) => ({ name: file.originalname, score: Math.max(58, 96 - index * 4), highlights: ['Skills alignment pending provider configuration', 'Resume received successfully'] })).slice(0, 10), message: 'Provider URL is not configured, so these are development-only rankings.' })
  } catch (error) { return next(error) }
})

router.post('/job-seeker/analyze', requireAuth, requireRole('job-seeker'), upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file || !allowedFile(req.file)) return res.status(400).json({ message: 'Upload a PDF, DOC, or DOCX resume.' })
    const provider = await callProvider(process.env.AI_JOB_SEEKER_ANALYSIS_URL, { resume: { name: req.file.originalname, content: req.file.buffer.toString('base64') } })
    if (provider) return res.json(provider)
    return res.json({ mode: 'mock', matchScore: 72, closestRoles: ['Frontend Developer', 'UI Engineer', 'React Developer'], missingSections: ['Measurable impact in recent experience', 'Technical skills summary'], suggestions: ['Add one quantified achievement to each recent role.', 'Tailor your summary to the role you are applying for.'], message: 'Provider URL is not configured, so these are development-only recommendations.' })
  } catch (error) { return next(error) }
})

export default router
