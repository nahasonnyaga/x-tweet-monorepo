// src/lib/test-microservices.ts
import * as ms from './microservices';

console.log('Checking microservices...');

for (const [name, module] of Object.entries(ms.microservices)) {
  try {
    if (!module || Object.keys(module).length === 0) {
      console.warn(`⚠️ Microservice "${name}" is empty or failed to load`);
    } else {
      console.log(`✅ Microservice "${name}" loaded`);
    }
  } catch (err) {
    console.error(`❌ Microservice "${name}" threw an error:`, err);
  }
}
