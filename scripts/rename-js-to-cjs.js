const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../dist/server');

function renameJsToCjs(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      renameJsToCjs(fullPath);
    } else if (file.endsWith('.js')) {
      const newFilePath = fullPath.replace(/\.js$/, '.cjs');
      fs.renameSync(fullPath, newFilePath);
      console.log(`Renamed: ${fullPath} -> ${newFilePath}`);
    }
  });
}

if (fs.existsSync(directory)) {
  renameJsToCjs(directory);
} else {
  console.error(`Directory not found: ${directory}`);
  process.exit(1);
}
