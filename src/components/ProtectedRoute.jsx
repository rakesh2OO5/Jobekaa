import { Navigate } from 'react-router-dom'

function ProtectedRoute({ role, children }) {
  try {
    const user = JSON.parse(localStorage.getItem('jobekaa_user'))
    if (user?.role === role && localStorage.getItem('jobekaa_token')) return children
  } catch {
    // Invalid cached data is treated as a signed-out session.
  }
  return <Navigate to="/" replace />
}

export default ProtectedRoute
