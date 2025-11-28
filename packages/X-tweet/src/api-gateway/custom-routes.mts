// packages/X-tweet/src/api-gateway/custom-routes.mts
import type { Request, Response } from 'express';
import { app } from './server.mts'; // Ensure you export `app` from server.mts
import { microservices } from '../lib/microservices.mts';

/**
 * Helper to call a microservice by name
 */
async function callService(name: string) {
  const loader = microservices[name];
  if (!loader) throw new Error(`Microservice "${name}" not found`);
  const service = await loader();
  return service;
}

/**
 * Example custom route to check all microservices
 */
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

/**
 * Example: get info from a specific microservice
 */
app.get('/api/custom/:serviceName', async (req: Request, res: Response) => {
  const { serviceName } = req.params;
  try {
    const service = await callService(serviceName);
    if (!service) return res.status(404).json({ error: 'Service not ready' });

    // If the service has a handler, call it with fake req/res
    if (typeof service.handler === 'function') {
      return service.handler(req, res);
    }

    // Otherwise return metadata
    res.json({ service: serviceName, ready: !!service });
  } catch (err: any) {
    res.status(500).json({ service: serviceName, error: err.message });
  }
});

/**
 * Add your own custom endpoints here
 */
app.get('/api/custom/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from X-Tweet custom routes!' });
});
