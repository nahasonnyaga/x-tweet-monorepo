import type { Request, Response } from 'express';
import { app } from '../server.mts';

app.get('/api/custom/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from X-Tweet custom routes!' });
});
