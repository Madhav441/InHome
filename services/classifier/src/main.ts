import express from 'express';

const app = express();
app.use(express.json());

app.post('/v1/classify/text', (req, res) => {
  const { text } = req.body as { text: string };
  const score = Math.min(1, (text?.length ?? 0) / 100);
  res.json({ score, label: score > 0.7 ? 'high-risk' : 'low-risk' });
});

app.post('/v1/classify/image', (_req, res) => {
  res.json({ score: 0.1, label: 'low-risk' });
});

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT ?? 4300;
app.listen(port, () => {
  console.log(`Classifier service listening on ${port}`);
});
