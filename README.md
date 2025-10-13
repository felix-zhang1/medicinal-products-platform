Medicinal Products Platform

A bilingual (English / Chinese) web app showcasing New Zealand’s plant- and animal-based medicinal products with simulated trading features — catalog, cart, orders, supplier map, and role-based access.

Live Demo: not yet (coming soon)
License: MIT

Features

🌐 Bilingual UI with i18next (English / Chinese toggle)

🧭 Modern frontend: React + Vite + React Router v7 (SSR-friendly)

🛒 E-commerce basics: product listing, detail page, cart, checkout (Stripe Test)

👤 Auth & RBAC: JWT login; roles (buyer / supplier / admin) with gated navigation

🗺️ Supplier address UX: Google Places autocomplete + Maps visualization

🗃️ Relational backend: Node.js + Express + Sequelize (MySQL)

📦 Image management: product image upload / serve

🔐 Secure configuration: environment-based secrets & DB SSL toggle

Tech Stack

Frontend: React, Vite, TypeScript, React Router v7, i18next
Backend: Node.js, Express, Sequelize (MySQL)
Payments: Stripe (test mode)
Maps: Google Maps JavaScript API + Places
Deploy: Vercel (frontend), any Node host/MySQL (backend)

Project Structure
medicinal-products-platform/
├─ client/   # React + Vite frontend
└─ server/   # Express + Sequelize backend (MySQL)

Quick Start
1 Prerequisites

Node.js ≥ 20

MySQL 8.x (local or cloud e.g. Railway)

Stripe test account (optional)

Google Maps API key (optional)

2 Backend Setup (server/.env)
PROTOCOL=http
HOST=localhost
PORT=8000

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medicinal
DB_SSL=false

# Auth
JWT_SECRET=your_jwt_secret


Install and run:

cd server
npm install
npm run dev      # or npm start / node src/index.js

3 Frontend Setup (client/.env)
SERVER_API_ORIGIN=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...


Install and run:

cd client
npm install
npm run dev


Frontend: http://localhost:5173
Backend: http://localhost:8000

Useful Scripts
Location	Command	Description
client	npm run dev	start dev server
client	npm run build	build for production
server	npm run dev	run Express in dev mode
server	npm start	run Express in prod mode
Environment Notes

For cloud MySQL (e.g. Railway), replace DB fields with the service credentials and set DB_SSL=true.

Stripe payments run in Test Mode only.

Never commit your .env file to Git — configure environment variables in your hosting platform.

Roadmap

✅ Catalog / Cart / Checkout (Test payment)

✅ Supplier map + address autocomplete

✅ JWT & role-based navigation

⏳ Admin and supplier dashboards

⏳ Expanded product data & search

⏳ Improved UI design & testing

License

MIT © Gongfan Zhang
