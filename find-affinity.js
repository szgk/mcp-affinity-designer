#!/usr/bin/env node

/**
 * Find Affinity Designer installation
 * Affinity Designerインストールを検索
 */

const fs = require('fs');
const path = require('path');

console.log('Searching for Affinity Designer installation...');
console.log('Affinity Designerインストールを検索中...\n');

// Load configured paths from JSON
const configPaths = JSON.parse(fs.readFileSync('affinity-install-paths.json', 'utf8'));
const windowsPaths = configPaths.windows.affinityInstallPaths;

console.log('Checking configured paths / 設定されたパスを確認中:');
console.log('=====================================');

let foundPath = null;

for (const installPath of windowsPaths) {
  // Convert Windows path to WSL path
  const wslPath = installPath.replace('C:\\', '/mnt/c/').replace(/\\/g, '/');
  const exists = fs.existsSync(wslPath);
  
  console.log(`${exists ? '✓' : '✗'} ${installPath}`);
  if (exists && !foundPath) {
    foundPath = installPath;
  }
}

console.log('\nSearching additional common locations / 追加の一般的な場所を検索中:');
console.log('========================================');

// Additional paths to check
const additionalPaths = [
  'C:\\Program Files\\Affinity\\Designer\\Designer.exe',
  'C:\\Program Files\\Affinity\\Photo 2\\Photo.exe',
  'D:\\Program Files\\Affinity\\Designer 2\\Designer.exe',
  'D:\\Program Files\\Affinity\\Affinity Designer 2\\Affinity Designer 2.exe'
];

for (const installPath of additionalPaths) {
  const wslPath = installPath.replace(/([CD]):\\/g, '/mnt/$1/').toLowerCase().replace(/\\/g, '/');
  const exists = fs.existsSync(wslPath);
  
  console.log(`${exists ? '✓' : '✗'} ${installPath}`);
  if (exists && !foundPath) {
    foundPath = installPath;
  }
}

if (foundPath) {
  console.log('\n✓ Found Affinity Designer at / Affinity Designerが見つかりました:');
  console.log(`  ${foundPath}`);
  console.log('\nTo use this path, update affinity-install-paths.json');
  console.log('このパスを使用するには、affinity-install-paths.jsonを更新してください');
} else {
  console.log('\n✗ Affinity Designer not found in standard locations');
  console.log('✗ 標準的な場所にAffinity Designerが見つかりませんでした');
  console.log('\nPlease check:');
  console.log('確認してください:');
  console.log('1. Is Affinity Designer installed? / Affinity Designerはインストールされていますか？');
  console.log('2. Is it installed in a custom location? / カスタムの場所にインストールされていますか？');
  console.log('3. Update affinity-install-paths.json with the correct path');
  console.log('   正しいパスでaffinity-install-paths.jsonを更新してください');
}