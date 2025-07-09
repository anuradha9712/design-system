import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing SSR Setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server.js',
  'components.js',
  'README.md'
];

const publicFiles = [
  'public/index.umd.js',
  'public/index.css'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📦 Checking design system files:');
publicFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`      Size: ${(stats.size / 1024).toFixed(2)} KB`);
  }
});

// Check if source files exist in parent dist directory
console.log('\n📂 Checking source files in parent dist directory:');
const sourceFiles = [
  '../../dist/index.umd.js',
  '../../dist/index.umd.css'
];

sourceFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`      Size: ${(stats.size / 1024).toFixed(2)} KB`);
  }
});

// Check package.json dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('\n📋 Package.json validation:');
  console.log(`  ✅ Name: ${packageJson.name}`);
  console.log(`  ✅ Type: ${packageJson.type || 'commonjs'}`);
  console.log(`  ✅ Scripts: ${Object.keys(packageJson.scripts).join(', ')}`);
  console.log(`  ✅ Dependencies: ${Object.keys(packageJson.dependencies).length} packages`);
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
const nodeModulesExists = fs.existsSync(nodeModulesPath);
console.log(`\n📦 Dependencies: ${nodeModulesExists ? '✅ Installed' : '❌ Not installed'}`);

// Summary
console.log('\n🎯 Setup Summary:');
console.log('  To complete setup:');
console.log('    1. Run: cd examples/ssr && npm install');
console.log('    2. Run: npm run build');
console.log('    3. Run: npm run dev');
console.log('    4. Visit: http://localhost:3000');

console.log('\n✨ SSR setup is ready for testing your design system UMD build!'); 