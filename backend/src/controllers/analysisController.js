import { contextualAnalysis, deterministicMatches, extractResumeText, isSupportedResume, normalizeResume, parseResume } from '../services/resumePipelineService.js'

export async function matchCandidates(req, res, next) {
  try {
    const resumes = req.files || []
    if (!req.body.jobDescription?.trim()) return res.status(400).json({ message: 'A job description is required.' })
    if (!resumes.length || resumes.some((file) => !isSupportedResume(file))) return res.status(400).json({ message: 'Upload 1 to 50 PDF, DOC, or DOCX resumes.' })
    return res.status(501).json({ message: 'Recruiter matching is not implemented in the current Job Seeker release.' })
  } catch (error) { return next(error) }
}

export async function analyzeResume(req, res, next) {
  try {
    if (!req.file || !isSupportedResume(req.file)) return res.status(400).json({ message: 'Upload a PDF, DOC, or DOCX resume.' })
    console.info('[Analysis] File received'); const text = await extractResumeText(req.file); console.info(`[Analysis] Text extracted: ${text.length} characters`); const resume = normalizeResume(await parseResume(text)); console.info(`[Analysis] Normalized skills: ${resume.skills.length}`); const matches = deterministicMatches(resume); const ai = await contextualAnalysis(resume, matches); const roles = matches.map((match, index) => ({ title: match.role.title, score: Math.round(match.score + Math.max(0, Math.min(100, ai.semanticScores?.[index] || 0)) * 0.3), reason: index ? 'Combined structured and contextual relevance.' : 'Best combined structured and contextual relevance.' }));
    // Development-only shape logging: enough to diagnose contracts without exposing resume data.
    console.info('[Analysis Debug]', {
      skills: { type: Array.isArray(resume.skills) ? 'array' : typeof resume.skills, length: resume.skills.length, sample: resume.skills.slice(0, 3) },
      missingSkills: { type: Array.isArray(ai.missingSkills) ? 'array' : typeof ai.missingSkills, length: ai.missingSkills.length, sample: ai.missingSkills.slice(0, 2).map(({ skill }) => skill) },
      missingSections: { type: Array.isArray(ai.missingSections) ? 'array' : typeof ai.missingSections, length: ai.missingSections.length, sample: ai.missingSections.slice(0, 2).map(({ section }) => section) },
      improvementSuggestions: { type: Array.isArray(ai.improvementSuggestions) ? 'array' : typeof ai.improvementSuggestions, length: ai.improvementSuggestions.length, sample: ai.improvementSuggestions.slice(0, 2).map(({ category }) => category) },
    })
    console.info(`[Analysis] Final response prepared; alternatives: ${roles.length - 1}`)
    return res.json({ success: true, data: { resume, bestJobRole: roles[0] || { title: 'No recommended role', score: 0, reason: '' }, alternativeRoles: roles.slice(1), strengths: ai.strengths, missingSkills: ai.missingSkills, missingSections: ai.missingSections, improvementSuggestions: ai.improvementSuggestions, overallSummary: ai.overallSummary } })
  } catch (error) { if (error.status) return res.status(error.status).json({ success: false, message: error.message }); return next(error) }
}
