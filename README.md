# Jobekaa

## Local setup

1. Copy `.env.example` to `.env` and replace the placeholder values with your MongoDB connection string and a long JWT secret.
2. Start the full app with `npm run dev:full`.
3. Open `http://127.0.0.1:5173`.

The frontend proxies `/api` calls to the Express server on port `5000`.

## Required API Configuration

Keep all credentials in `backend/.env`; they are never sent to React. The job-seeker pipeline requires `AFFINDA_API_KEY`, `AFFINDA_WORKSPACE_ID`, and `AFFINDA_DOCUMENT_TYPE_ID` because Affinda v3 document upload requires a Bearer token plus `workspace` and `documentType` form fields. Obtain them from Affinda Settings -> API Keys, Workspace -> Workflow -> Integrations, and the Resume Parser document type settings.

`GEMINI_API_KEY` is required for contextual resume reasoning and is created in Google AI Studio. `GEMINI_MODEL` is optional because the backend defaults to `gemini-2.0-flash`.

The runtime pipeline is: Multer upload -> Affinda v3 parsing -> stable resume normalization -> transparent role matching -> Gemini structured JSON reasoning -> React result data. Missing keys return a clear configuration error without producing fake analysis.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
