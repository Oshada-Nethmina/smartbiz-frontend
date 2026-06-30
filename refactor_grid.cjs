const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<Grid')) return;

  const regex = /<Grid\s+(?:item\s+)?((?:(?:xs|sm|md|lg|xl)=\{[^\}]+\}\s*|(?:xs|sm|md|lg|xl)=\d+\s*)+)([^>]*)>/g;
  
  let newContent = content.replace(regex, (match, sizes, rest) => {
    let sizeObj = [];
    const sizeRegex = /(xs|sm|md|lg|xl)=({([^}]+)}|\d+)/g;
    let sizeMatch;
    while ((sizeMatch = sizeRegex.exec(sizes)) !== null) {
      const val = sizeMatch[3] !== undefined ? sizeMatch[3] : sizeMatch[2];
      sizeObj.push(`${sizeMatch[1]}:${val}`);
    }
    
    return `<Grid size={{ ${sizeObj.join(', ')} }} ${rest.trim()}>`.replace(/ >$/, '>');
  });

  const regexSelf = /<Grid\s+(?:item\s+)?((?:(?:xs|sm|md|lg|xl)=\{[^\}]+\}\s*|(?:xs|sm|md|lg|xl)=\d+\s*)+)([^>]*)\/>/g;
  newContent = newContent.replace(regexSelf, (match, sizes, rest) => {
    let sizeObj = [];
    const sizeRegex = /(xs|sm|md|lg|xl)=({([^}]+)}|\d+)/g;
    let sizeMatch;
    while ((sizeMatch = sizeRegex.exec(sizes)) !== null) {
      const val = sizeMatch[3] !== undefined ? sizeMatch[3] : sizeMatch[2];
      sizeObj.push(`${sizeMatch[1]}:${val}`);
    }
    return `<Grid size={{ ${sizeObj.join(', ')} }} ${rest.trim()} />`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated ' + filePath);
  }
}

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('./src');
files.filter(f => f.endsWith('.jsx') || f.endsWith('.js')).forEach(processFile);
