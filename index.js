require('dotenv').config();
const { app } = require('./app');
const { connectDatabase } = require('./src/database/db.config');
const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server because DB connection failed:", error.message);
    process.exit(1);
  }
})();
