import app from './index.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3100;
app.listen(port, () => {
  console.log(`Server listening on :${port}`);
});
