export async function callAnalysisProvider(url, payload) {
  if (!url || url.includes('example.invalid')) return null
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY || ''}` }, body: JSON.stringify(payload) })
  if (!response.ok) throw new Error('The analysis provider could not process this request.')
  return response.json()
}

export const isSupportedResume = (file) => /\.(pdf|doc|docx)$/i.test(file.originalname)
