import type { Request, Response } from 'express';
import { app } from '../server.mts';
import { microservices } from '../lib/microservices.mts';

async function callService(name: string) {
  const loader = microservices[name];
  if (!loader) throw new Error(`Microservice "${name}" not found`);
  return await loader();
}

// All services status
app.get('/api/custom/all-services', async (_req: Request, res: Response) => {
  const results: Record<string, { ready: boolean; error?: string }> = {};
  for (const name of Object.keys(microservices)) {
    try {
      const service = await callService(name);
      results[name] = { ready: !!service };
    } catch (err: any) {
      results[name] = { ready: false, error: err.message };
    }
  }
  res.json(results);
});

// Specific service status
app.get('/api/custom/:serviceName', async (req: Request, res: Response) => {
  const { serviceName } = req.params;
  try {
    const service = await callService(serviceName);
    if (!service) return res.status(404).json({ error: 'Service not ready' });

    if (typeof service.handler === 'function') {
      return service.handler(req, res);
    }

    res.json({ service: serviceName, ready: !!service });
  } catch (err: any) {
    res.status(500).json({ service: serviceName, error: err.message });
  }
});
