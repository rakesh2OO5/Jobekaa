const cache = new Map()
const clean = (text = '') => text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const normalizedSkill = (skill = '') => skill.toLowerCase().replace(/react\s*\.?(js)?/g, 'react').replace(/node\s*\.?(js)?/g, 'node').replace(/mongo\s*db/g, 'mongodb').replace(/type\s*script/g, 'typescript').replace(/java\s*script/g, 'javascript').replace(/\W/g, '')
const roleWords = (role = '') => role.toLowerCase().split(/\W+/).filter((word) => word.length > 2 && !['developer', 'engineer', 'software', 'senior', 'junior', 'full', 'stack'].includes(word))

export async function findRecommendedJobs({ role, skills = [], location = 'india', tag = '' }) {
  const key = JSON.stringify({ role, location, tag }); const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) return cached.value
  const params = new URLSearchParams({ count: '50', tag: tag || role })
  try {
    const response = await fetch(`https://jobicy.com/api/v2/remote-jobs?${params}`); if (!response.ok) throw new Error('Jobicy unavailable')
    const jobs = (await response.json()).jobs || []; const candidateSkills = skills.filter((skill) => typeof skill === 'string' && skill.trim()).map((skill) => ({ label: skill.trim(), normalized: normalizedSkill(skill) })).filter((skill) => skill.normalized)
    const value = jobs.map((job) => {
      const title = job.jobTitle || ''; const text = clean(`${title} ${job.jobDescription || ''}`).toLowerCase(); const normalizedText = normalizedSkill(text); const originalLocation = job.jobGeo || ''; const geographicScore = geographyScore(originalLocation, location)
      const matchedSkills = candidateSkills.filter((skill) => normalizedText.includes(skill.normalized)).map((skill) => skill.label)
      const relevantWords = roleWords(role); const titleWords = title.toLowerCase(); const matchedRoleWords = relevantWords.filter((word) => titleWords.includes(word) || text.includes(word)); const roleScore = relevantWords.length ? Math.round((matchedRoleWords.length / relevantWords.length) * 30) : 0
      const skillScore = candidateSkills.length ? Math.round((matchedSkills.length / candidateSkills.length) * 70) : null
      const calculatedScore = skillScore === null ? roleScore : Math.min(100, skillScore + roleScore)
      // A zero provides no useful matching evidence, so it is intentionally unavailable to the UI.
      const matchScore = calculatedScore > 0 ? calculatedScore : null
      const rankingScore = (matchScore ?? 0) * 0.6; const daysOld = Math.max(0, (Date.now() - new Date(job.pubDate || 0)) / 86400000); const recencyScore = Math.max(0, 100 - daysOld * 3)
      return { id: job.id, title, company: job.companyName, location: originalLocation, originalLocation, type: job.jobType || [], level: job.jobLevel, excerpt: job.jobExcerpt || clean(job.jobDescription), publishedAt: job.pubDate, url: job.url, source: 'Jobicy', matchScore, geographicScore, matchedSkills, missingSkills: [], finalScore: Math.round(rankingScore + geographicScore * 0.25 + recencyScore * 0.15) }
    }).filter((job) => job.geographicScore > 0).sort((a, b) => b.finalScore - a.finalScore).slice(0, 8)
    const result = { source: 'Jobicy', jobs: value, fallbackSearchLinks: fallbackLinks(role) }; cache.set(key, { value: result, expires: Date.now() + 15 * 60 * 1000 }); return result
  } catch { return { source: null, jobs: [], fallbackSearchLinks: fallbackLinks(role) } }
}
function geographyScore(location, scope) { if (scope === 'global') return 70; const value = location.toLowerCase(); const foreignOnly = /united states|\busa\b|canada|united kingdom|\buk\b|europe only|us only/.test(value); if (foreignOnly) return 0; if (/india|\bin\b/.test(value)) return 100; if (/anywhere|worldwide|global/.test(value)) return scope === 'remote-india' ? 70 : 70; return scope === 'remote-india' && /remote/.test(value) ? 70 : 0 }
function fallbackLinks(role) { const query = encodeURIComponent(`${role} India`); return [{ name: 'LinkedIn Jobs', url: `https://www.linkedin.com/jobs/search/?keywords=${query}` }, { name: 'Naukri', url: 'https://www.naukri.com/' }, { name: 'Indeed India', url: `https://in.indeed.com/jobs?q=${query}` }, { name: 'Internshala', url: 'https://internshala.com/jobs' }, { name: 'Wellfound', url: 'https://wellfound.com/jobs' }, { name: 'Cutshort', url: 'https://cutshort.io/jobs' }] }
