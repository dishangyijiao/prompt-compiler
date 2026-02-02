/**
 * Cross-platform build script: copies src and package.json to dist/
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

copyRecursive(path.join(root, 'src'), path.join(dist, 'src'));
fs.copyFileSync(path.join(root, 'package.json'), path.join(dist, 'package.json'));

const entry = "module.exports = require('./src');\n";
fs.writeFileSync(path.join(dist, 'index.js'), entry, 'utf8');

console.log('Build complete: dist/');
