import { microserviceRouter } from '../../lib/microservice-router';

export default async function handler(req, res) {
  const { service, action } = req.query;

  if (!service || !microserviceRouter[service as string]) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const svc = microserviceRouter[service as string];

  if (svc[action as string]) {
    try {
      const result = await svc[action as string](req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(400).json({ error: 'Action not found' });
}
