import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Old URL -> New URL mapping
const redirects = {
  // Group pages - redirect to new direct paths
  'aespa-name-generator': '/aespa-name-generator/',
  'blackpink-name-generator': '/blackpink-name-generator/',
  'bts-name-generator': '/bts-name-generator/',
  'huntrix-name-generator': '/huntrix-name-generator/',
  'ive-name-generator': '/ive-name-generator/',
  'newjeans-name-generator': '/newjeans-name-generator/',
  'plave-name-generator': '/plave-name-generator/',
  'riize-name-generator': '/riize-name-generator/',
  'sajaboys-name-generator': '/sajaboys-name-generator/',
  'seventeen-name-generator': '/seventeen-name-generator/',
  'stray-kids-name-generator': '/stray-kids-name-generator/',
  
  // Aesthetic/Stage name generators - redirect to main group pages
  'blackpink-aesthetic-name-generator': '/blackpink-name-generator/',
  'blackpink-stage-name-generator': '/blackpink-name-generator/',
  'bts-aesthetic-name-generator': '/bts-name-generator/',
  'bts-stage-name-generator': '/bts-name-generator/',
  'huntrix-stage-name-generator': '/huntrix-name-generator/',
  'ive-aesthetic-name-generator': '/ive-name-generator/',
  'ive-stage-name-generator': '/ive-name-generator/',
  'newjeans-aesthetic-name-generator': '/newjeans-name-generator/',
  'newjeans-stage-name-generator': '/newjeans-name-generator/',
  'sajaboys-stage-name-generator': '/sajaboys-name-generator/',
  'seventeen-aesthetic-name-generator': '/seventeen-name-generator/',
  'seventeen-stage-name-generator': '/seventeen-name-generator/',
  'stray-kids-aesthetic-name-generator': '/stray-kids-name-generator/',
  'stray-kids-stage-name-generator': '/stray-kids-name-generator/',
  
  // Generic pages - redirect to homepage
  'korean-name-generator': '/',
  'korean-romanized-name-generator': '/',
  'kpop-name-generator': '/',
  'kpop-aesthetic-name-generator': '/',
  'kpop-badass-name-generator': '/',
  'kpop-bio-hashtag-generator': '/',
  'kpop-couple-name-combiner': '/',
  'kpop-cute-name-generator': '/',
  'kpop-nickname-generator': '/',
  'kpop-ship-name-generator': '/',
  'kpop-stage-name-generator': '/',
  'kpop-stage-name-generator-female': '/',
  'kpop-stage-name-generator-male': '/',
  'kpop-username-generator': '/',
  'kpop-username-generator-female': '/',
  'kpop-username-generator-male': '/',
  'idol-chemistry-name': '/',
  
  // Static pages
  'about': '/about/',
  'contact': '/contact/',
};

function createRedirectHTML(targetUrl, title = 'KPOP Name Generator') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <link rel="canonical" href="https://kpopnamegenerator.com${targetUrl}">
  <title>Redirecting...</title>
  <script>window.location.replace('${targetUrl}');</script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${title}</a>...</p>
</body>
</html>`;
}

const publicPagesDir = path.join(__dirname, '..', 'public', 'pages');

// Create directories and files
Object.entries(redirects).forEach(([oldPath, newUrl]) => {
  const dirPath = path.join(publicPagesDir, oldPath);
  const filePath = path.join(dirPath, 'index.html');
  
  // Create directory if it doesn't exist
  fs.mkdirSync(dirPath, { recursive: true });
  
  // Write redirect file
  fs.writeFileSync(filePath, createRedirectHTML(newUrl, oldPath));
  console.log(`Created: public/pages/${oldPath}/index.html -> ${newUrl}`);
});

// Also create legal redirects
const legalDir = path.join(__dirname, '..', 'public', 'legal');
fs.mkdirSync(legalDir, { recursive: true });

fs.writeFileSync(
  path.join(legalDir, 'terms.html'),
  createRedirectHTML('/terms/', 'Terms of Service')
);
console.log('Created: public/legal/terms.html -> /terms/');

fs.writeFileSync(
  path.join(legalDir, 'privacy.html'),
  createRedirectHTML('/privacy/', 'Privacy Policy')
);
console.log('Created: public/legal/privacy.html -> /privacy/');

console.log('\n✅ All redirects created!');
