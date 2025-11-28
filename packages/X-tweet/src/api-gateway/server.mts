import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { microservices } from '../lib/microservices.mts';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper to wrap async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

// Dynamically register microservice endpoints
for (const [name, loader] of Object.entries(microservices)) {
  app.use(
    `/api/${name}`,
    asyncHandler(async (req: Request, res: Response) => {
      const service = await loader();

      // If service exports a handler function, call it with req/res
      if (typeof service.handler === 'function') {
        return service.handler(req, res);
      }

      // Otherwise return service metadata
      res.json({ service: name, ready: !!service });
    })
  );
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Catch-all 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 X-Tweet API Gateway running on http://localhost:${PORT}`);
});
