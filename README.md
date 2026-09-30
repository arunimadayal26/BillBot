# BillBot

An AI-powered invoice generator built on the MERN stack. Describe a job in plain text and BillBot turns it into an invoice draft, writes payment reminder emails, and summarizes your finances on a dashboard.

**Stack:** React 19 · Vite · Tailwind CSS 4 · Node.js · Express 5 · MongoDB (Mongoose) · Google Gemini · JWT

---

## Features

- **Authentication:** Register and log in with email and password. Passwords are hashed with bcrypt and sessions use JWT.
- **Invoice management:** Create, view, edit, and delete invoices, and toggle each one between Paid and Unpaid.
- **Automatic calculations:** Per-item tax percentages, subtotal, tax total, and grand total are computed for you. Invoice numbers auto-increment (`INV-001`, `INV-002`, ...).
- **AI invoice creation:** Paste unstructured text such as *"Invoice Rahul for 3 logo designs at 2000 each"* and Gemini extracts the client name, email, and line items to prefill the form.
- **AI payment reminders:** Generate a polite, ready-to-send reminder email for any invoice.
- **AI dashboard insights:** Short, actionable takeaways based on your paid and outstanding totals and recent invoices.
- **Business profile:** Store your business name, address, and phone number for use on invoices.
- **Print / PDF export:** Print an invoice or save it as a PDF through the browser's print dialog.
- **Responsive UI:** Landing page, dashboard, and invoice screens adapt to different screen sizes.

---

## Project Structure

```text
BillBot/
├── backend/
│   ├── config/db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js             # Gemini: parse text, reminders, insights
│   │   ├── authController.js           # Register, login, profile
│   │   └── invoiceController.js        # Invoice CRUD
│   ├── middlewares/authMiddleware.js   # JWT route protection
│   ├── models/                         # User and Invoice schemas
│   ├── routes/                         # auth, invoices, ai
│   └── server.js
└── frontend/
    └── src/
        ├── components/                 # auth, invoices, landing, layout, ui
        ├── context/AuthContext.jsx
        ├── pages/                      # Auth, Dashboard, Invoices, LandingPage, Profile
        └── utilis/                     # axios instance, API paths, helpers
```

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- A MongoDB database (local or MongoDB Atlas)
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/arunimadayal26/BillBot.git
cd BillBot
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

> The frontend calls the API at `http://localhost:8000`, so keep `PORT=8000`.

Start the server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To use a different API URL, change `BASE_URL` in `frontend/src/utilis/apiPaths.js`.

---

## API Reference

Routes marked 🔒 require an `Authorization: Bearer <token>` header.

### Auth: `/api/auth`

| Method | Endpoint    | Description                 | Auth |
| ------ | ----------- | --------------------------- | ---- |
| POST   | `/register` | Create a new account        |      |
| POST   | `/login`    | Log in and receive a JWT    |      |
| GET    | `/me`       | Get the current user        | 🔒   |
| PUT    | `/me`       | Update the business profile | 🔒   |

### Invoices: `/api/invoices`

| Method | Endpoint | Description          | Auth |
| ------ | -------- | -------------------- | ---- |
| POST   | `/`      | Create an invoice    | 🔒   |
| GET    | `/`      | List your invoices   | 🔒   |
| GET    | `/:id`   | Get a single invoice | 🔒   |
| PUT    | `/:id`   | Update an invoice    | 🔒   |
| DELETE | `/:id`   | Delete an invoice    | 🔒   |

### AI: `/api/ai`

| Method | Endpoint             | Description                                     | Auth |
| ------ | -------------------- | ----------------------------------------------- | ---- |
| POST   | `/parse-text`        | Convert plain text into structured invoice data | 🔒   |
| POST   | `/generate-reminder` | Generate a payment reminder email (`invoiceId`) | 🔒   |
| GET    | `/dashboard-summary` | Get AI-generated financial insights             | 🔒   |

---

## Data Models

**User:** `name`, `email` (unique), `password` (hashed, excluded from queries by default), `businessName`, `address`, `phone`

**Invoice:** `user`, `invoiceNumber`, `invoiceDate`, `dueDate`, `billFrom` (business name, email, address), `billTo` (client name, email, address, phone), `items[]` (name, quantity, unitPrice, taxPercent, total), `notes`, `paymentTerms`, `status` (`Paid` | `Unpaid`, default `Unpaid`), `subtotal`, `taxTotal`, `total`

---

## How the AI Features Work

BillBot calls the Gemini API (`gemini-flash-latest`) from the backend through the `@google/genai` SDK, so the API key is never exposed to the browser.

1. **Text to invoice:** The prompt asks Gemini to return only a JSON object with `clientName`, `email`, and `items`. The server strips code fences, parses the JSON, and returns it to prefill the invoice form.
2. **Reminders:** The invoice's client name, number, total, and due date go into a prompt that asks for a concise, friendly email starting with a subject line.
3. **Insights:** The server aggregates your totals (paid, unpaid, revenue, outstanding) and sends only that summary to Gemini, which returns a JSON array of short insights.

---

## Author

**Arunima Dayal** 
