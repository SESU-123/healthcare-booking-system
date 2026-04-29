const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./client/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:5000/api')) {
    // Replace 'http://localhost:5000/api...' with `${import.meta.env.VITE_API_URL}/api...`
    // First, change any single quotes around http://localhost:5000/api to backticks if they aren't already.
    content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}$1`');
    content = content.replace(/"http:\/\/localhost:5000\/api([^"]*)"/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}$1`');
    // If it was already in a template literal (like `http://localhost:5000/api/...`)
    content = content.replace(/`http:\/\/localhost:5000\/api/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
