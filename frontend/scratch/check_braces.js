import fs from 'fs';
const content = fs.readFileSync('c:\\Users\\User\\Documents\\VeeduLedger\\frontend\\src\\pages\\Bills.jsx', 'utf8');

let balance = 0;
const lines = content.split('\n');
lines.forEach((line, i) => {
  const opening = (line.match(/\{/g) || []).length;
  const closing = (line.match(/\}/g) || []).length;
  balance += opening - closing;
  if (balance === 0 && i > 50 && i < lines.length - 10) {
    console.log(`Balance hit 0 at line ${i + 1}: ${line}`);
  }
});
console.log(`Final balance: ${balance}`);
