# Jobekaa

## Local setup

1. Copy `.env.example` to `.env` and replace the placeholder values with your MongoDB connection string and a long JWT secret.
2. Start the full app with `npm run dev:full`.
3. Open `http://127.0.0.1:5173`.

The frontend proxies `/api` calls to the Express server on port `5000`.

## AI provider configuration

`AI_RESUME_RANKING_URL` and `AI_JOB_SEEKER_ANALYSIS_URL` are optional provider endpoints. Until configured, uploads return clearly labelled development-only mock analysis while preserving the API integration.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
