# UCLan Movie Bookiing Ticket App

This repository contains a full-stack movie ticket booking application with a React + Vite frontend and an Express + MongoDB backend.

Repository layout

- **UCLanClient/** — React frontend (Vite). See [UCLanClient/package.json](UCLanClient/package.json).
- **UCLanServerDB/** — Express backend, MongoDB models and routes. See [UCLanServerDB/package.json](UCLanServerDB/package.json).

**Highlights**

- React 19 + Vite frontend with routing, seat selection, and a simple admin UI.
- Express (Node) backend with Mongoose models.
- Integrations for Stripe, Cloudinary, and email (nodemailer).

**Note:** Secrets and configuration (DB URI, Stripe keys, mail credentials, Clerk keys, etc.) should live in environment variables (create a `.env` in `UCLanServerDB/`).

**Quick start (local development)**

Prerequisites: Node.js (18+ recommended), npm, and a running MongoDB instance (local or Atlas).

1. Install dependencies for server and client:

```bash
cd "UCLanServerDB"
npm install

cd "UCLanClient"
npm install
```

2. Configure environment variables for the server (create `UCLanServerDB/.env`):

- `MONGO_URI` 
- `JWT_SECRET` 
- `STRIPE_SECRET_KEY`, `CLOUDINARY_URL`.

3. Run the backend and frontend in separate terminals:

```bash
# Terminal 1 (backend)
cd "UCLanServerDB"
npm run server   # uses nodemon (watching changes)

# Terminal 2 (frontend)
cd "/UCLanClient"
npm run dev      # starts Vite dev server
```

4. Open the frontend URL shown by Vite (usually `http://localhost:5173`) and use the API at the backend port (see server console for the running port).

Production build

- Build the client with `npm run build` inside `UCLanClient`.
- Start the server with `npm start` inside `UCLanServerDB` (this runs `node server.js`).

Troubleshooting & tips

- If the frontend can't reach the API, ensure the backend is running and CORS is enabled.
- Check `configs` for the expected in env var.
- If you use Clerk or other auth providers, follow their docs to configure environment variables and allowed origins.

Contributing

- Fork and open a pull request for feature work.
- Run linters: `npm run lint` from `UCLanClient`.

License & security

This repo should never contain production secrets. If a secret is accidentally committed, rotate it and remove it from history.

Maintainer: MochogeStanley
