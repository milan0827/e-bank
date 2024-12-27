import app from './app';
import Logger from './lib/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info('listening on port 3000...');
});
