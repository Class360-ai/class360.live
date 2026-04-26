import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 4000;

connectDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`Class360 learning API running on port ${PORT}`);
  });
});
