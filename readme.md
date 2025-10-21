# ChyChy Agent Platform

A full-stack platform for managing blogs, admin dashboards, and AI-powered content, built with React (Vite) for the frontend and Node.js/Express/MongoDB for the backend.

---

## 📁 Folder Structure

```
Agent_Site/
│
├── api/                # Backend (Node.js/Express)
│   ├── controllers/    # Route controllers (blog, auth, AI, etc.)
│   ├── libs/           # Utility libraries (db, cloudinary, redis)
│   ├── middlewares/    # Express middlewares (auth, upload, validation)
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point for backend
│
├── client/             # Frontend (React + Vite)
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── admin/      # Admin dashboard (pages, components, hooks)
│   │   ├── assets/     # Images and static files
│   │   ├── components/ # Shared components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Public pages
│   │   ├── stores/     # Zustand stores
│   │   ├── utils/      # Utility functions
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point for React
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .env                # Environment variables for backend
├── README.md           # Project documentation
└── ...
```

---

## 🚀 Getting Started

### 1. **Clone the repository**

```sh
git clone https://github.com/yourusername/Agent_Site.git
cd Agent_Site
```

### 2. **Install dependencies**

#### Backend (API)

```sh
cd api
npm install
```

#### Frontend (Client)

```sh
cd ../client
npm install
```

### 3. **Set up environment variables**

Create a `.env` file in the `api/` folder with the following (example):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
UPSTASH_REDIS_URL=your_upstash_redis_url
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GOOGLE_API_KEY=your_google_api_key
```

### 4. **Start the servers**

#### Backend

```sh
cd api
npm run dev
```

#### Frontend

```sh
cd ../client
npm run dev
```

- The frontend will run at [http://localhost:5173](http://localhost:5173)
- The backend will run at [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing

### UI Testing (Cypress)

1. **Install Cypress in the client:**

   ```sh
   cd client
   npm install --save-dev cypress
   ```

2. **Open Cypress UI:**

   ```sh
   npx cypress open
   ```

   - Write your tests in `client/cypress/e2e/`
   - Example test file: `client/cypress/e2e/blog.cy.js`

3. **Run Cypress tests in headless mode:**
   ```sh
   npx cypress run
   ```

### API Testing (Recommended: Jest + Supertest)

1. **Install Jest and Supertest in the api:**

   ```sh
   cd api
   npm install --save-dev jest supertest
   ```

2. **Add a test script to `api/package.json`:**

   ```json
   "scripts": {
     "test": "jest"
   }
   ```

3. **Write your API tests in `api/tests/` (e.g., `api/tests/blog.test.js`):**

   ```js
   import request from "supertest";
   import app from "../server"; // or wherever your Express app is exported

   describe("Blog API", () => {
     it("should get all blogs", async () => {
       const res = await request(app).get("/api/v1/blog");
       expect(res.statusCode).toBe(200);
       expect(res.body.blogs).toBeInstanceOf(Array);
     });
   });
   ```

4. **Run API tests:**
   ```sh
   npm test
   ```

---

## 🛠️ Useful Scripts

| Command            | Location | Description           |
| ------------------ | -------- | --------------------- |
| `npm run dev`      | api      | Start backend (dev)   |
| `npm run dev`      | client   | Start frontend (dev)  |
| `npx cypress open` | client   | Open Cypress UI       |
| `npx cypress run`  | client   | Run Cypress tests     |
| `npm test`         | api      | Run backend API tests |

---

## 📝 Notes

- **Frontend** uses Zustand for state management, React Router for routing, and React Toastify for notifications.
- **Backend** uses Express, Mongoose, JWT authentication, Cloudinary for image uploads, and Redis for refresh token storage.
- **Environment variables** must be set for both MongoDB, Cloudinary, Redis, and Google AI API.
- **CORS** is configured to allow frontend-backend communication in development.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)
