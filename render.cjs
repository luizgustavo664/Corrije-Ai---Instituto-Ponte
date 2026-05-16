const plantumlEncoder = require('plantuml-encoder');
const https = require('https');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, 'documentos', 'wad.md'), 'utf-8');

const start = source.indexOf('@startuml');
const end = source.indexOf('@enduml', start) + '@enduml'.length;
const plantumlCode = source.slice(start, end);

const encoded = plantumlEncoder.encode(plantumlCode);
const url = `https://www.plantuml.com/plantuml/png/${encoded}`;

console.log('Downloading...');

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed:', res.statusCode, res.statusMessage);
    process.exit(1);
  }
  const chunks = [];
  res.on('data', (c) => chunks.push(c));
  res.on('end', () => {
    const outputPath = path.join(__dirname, 'assets', 'diagrama_classes_dominio.png');
    fs.writeFileSync(outputPath, Buffer.concat(chunks));
    console.log('Saved PNG:', Buffer.concat(chunks).length, 'bytes');
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
