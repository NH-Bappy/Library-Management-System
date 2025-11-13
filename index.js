require('dotenv').config();
const { app } = require('./app');
const { connectDatabase } = require('./src/database/db.config');

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error from index.js / Database connection failed:", error);
  });
