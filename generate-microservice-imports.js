// generate-microservice-imports.js
const fs = require('fs');
const path = require('path');

// Path to the unused microservices list
const unusedServicesFile = path.join(__dirname, 'packages/X-tweet/src/unused-microservices.txt');

// Read unused microservices
const unusedServices = fs.readFileSync(unusedServicesFile, 'utf-8')
  .split('\n')
  .filter(Boolean);

// Output file where import stubs will be written
const outputFile = path.join(__dirname, 'packages/X-tweet/src/lib/microservices.ts');

// Generate import lines
const importLines = unusedServices.map(s => {
  const variableName = s.replace(/-/g, '_');
  return `import * as ${variableName} from "@${s}/src";`;
}).join('\n');

// Write to output file
fs.writeFileSync(outputFile, importLines + '\n');
console.log(`Import stubs generated for ${unusedServices.length} microservices at ${outputFile}`);
