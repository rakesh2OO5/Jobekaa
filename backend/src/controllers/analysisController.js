import { callAnalysisProvider, isSupportedResume } from '../services/analysisService.js'

export async function matchCandidates(req, res, next) {
  try {
    const resumes = req.files || []
    if (!req.body.jobDescription?.trim()) return res.status(400).json({ message: 'A job description is required.' })
    if (!resumes.length || resumes.some((file) => !isSupportedResume(file))) return res.status(400).json({ message: 'Upload 1 to 50 PDF, DOC, or DOCX resumes.' })
    const provider = await callAnalysisProvider(process.env.AI_RESUME_RANKING_URL, { jobDescription: req.body.jobDescription, resumes: resumes.map((file) => ({ name: file.originalname, content: file.buffer.toString('base64') })) })
    if (provider) return res.json(provider)
    return res.json({ mode: 'mock', rankedCandidates: resumes.map((file, index) => ({ name: file.originalname, score: Math.max(58, 96 - index * 4), highlights: ['Skills alignment pending provider configuration', 'Resume received successfully'] })).slice(0, 10), message: 'Provider URL is not configured, so these are development-only rankings.' })
  } catch (error) { return next(error) }
}

export async function analyzeResume(req, res, next) {
  try {
    if (!req.file || !isSupportedResume(req.file)) return res.status(400).json({ message: 'Upload a PDF, DOC, or DOCX resume.' })
    const provider = await callAnalysisProvider(process.env.AI_JOB_SEEKER_ANALYSIS_URL, { resume: { name: req.file.originalname, content: req.file.buffer.toString('base64') } })
    if (provider) return res.json(provider)
    return res.json({ mode: 'mock', matchScore: 72, closestRoles: ['Frontend Developer', 'UI Engineer', 'React Developer'], missingSections: ['Measurable impact in recent experience', 'Technical skills summary'], suggestions: ['Add one quantified achievement to each recent role.', 'Tailor your summary to the role you are applying for.'], message: 'Provider URL is not configured, so these are development-only recommendations.' })
  } catch (error) { return next(error) }
}
