import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info('listening on port 3000...');
});
