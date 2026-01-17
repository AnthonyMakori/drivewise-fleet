const fs = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    const frontendDist = path.resolve(__dirname, '..', 'dist');
    const backendPublic = path.resolve(__dirname, '..', '..', 'drive wise backend', 'public');

    if (!fs.existsSync(frontendDist)) {
      console.error('dist/ not found. Run `npm run build` first.');
      process.exit(1);
    }

    console.log('Copying', frontendDist, '->', backendPublic);
    await copyDir(frontendDist, backendPublic);
    console.log('Copy complete. Frontend deployed to Laravel public/.');
  } catch (err) {
    console.error('Copy failed:', err);
    process.exit(1);
  }
})();
