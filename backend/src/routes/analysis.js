import { Router } from 'express'
import multer from 'multer'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { analyzeResume, matchCandidates } from '../controllers/analysisController.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 50 } })
router.post('/recruiter/match', requireAuth, requireRole('recruiter'), upload.array('resumes', 50), matchCandidates)
router.post('/job-seeker/analyze', requireAuth, requireRole('job-seeker'), upload.single('resume'), analyzeResume)

export default router
