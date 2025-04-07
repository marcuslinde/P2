import connectDB from "./config/db.js";
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import staticRoutes from './routes/staticRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import setupWebhooks from './webhooks.js';

const app = express();
const PORT = process.env.PORT || 4000;
// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



//----------MIDDLEWARE----------
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'frontend')));


//----------ROUTES----------
// static pages navigation routes:
app.use(staticRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

// Initialize webhooks AFTER app is created
setupWebhooks(app);


// 404 handler should come last
app.use((req, res) => {
    res.status(404).send("Page not found");
});


//----------SERVER CONNECTION----------
(async () => {
  await connectDB(); // Wait for DB connection before starting the server

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`);
  });
})();



