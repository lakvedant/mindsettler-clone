import fs from 'fs';
import path from 'path';

const dirs = ['client/src'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dirs[0]);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('react-router-dom')) {
    content = content.replace(/['"]react-router-dom['"]/g, "'react-router'");
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
