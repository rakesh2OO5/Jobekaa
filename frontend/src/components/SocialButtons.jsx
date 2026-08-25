function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.72-.06-1.25-.19-1.8H12v3.4h5.52c-.11.84-.73 2.1-2.1 2.95l-.02.11 3.05 2.37.21.02c1.95-1.8 2.94-4.45 2.94-7.05Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.16-2.5c-.85.6-1.99 1.02-3.47 1.02-2.64 0-4.88-1.74-5.68-4.14l-.1.01-3.17 2.46-.03.09A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.32 13.93A6.05 6.05 0 0 1 6 12c0-.67.11-1.32.3-1.93l-.01-.13-3.2-2.5-.1.04A10 10 0 0 0 2 12c0 1.62.39 3.16 1.09 4.52l3.23-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.93c1.87 0 3.13.8 3.85 1.46l2.81-2.74C16.96 3.06 14.69 2 12 2a10 10 0 0 0-8.91 5.48l3.31 2.59c.81-2.4 3.05-4.14 5.6-4.14Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.84 3.38-1.84 3.62 0 4.29 2.38 4.29 5.48v6.25ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.1 20.45H3.54V9H7.1v11.45Z"
      />
    </svg>
  )
}

function SocialButtons({ onUnavailable }) {
  const buttonClass =
    'inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'

  return (
    <div className="space-y-3">
      <button type="button" className={buttonClass} onClick={() => onUnavailable('Google')}>
        <GoogleIcon />
        Continue with Google
      </button>
      <button type="button" className={buttonClass} onClick={() => onUnavailable('LinkedIn')}>
        <LinkedInIcon />
        Continue with LinkedIn
      </button>
    </div>
  )
}

export default SocialButtons
