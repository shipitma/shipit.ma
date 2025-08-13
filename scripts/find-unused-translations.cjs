const fs = require('fs');
const path = require('path');

// Function to read translation file
function readTranslationFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Function to extract all keys from a nested object
function extractKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, currentKey));
    } else {
      keys.push(currentKey);
    }
  }
  return keys;
}

// Function to find translation usage in code files
function findTranslationUsage(searchPath, translationKeys) {
  const usedKeys = new Set();
  
  function searchInDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        searchInDirectory(fullPath);
      } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Look for t('key') patterns
          const tFunctionMatches = content.match(/t\(['"`]([^'"`]+)['"`]/g);
          if (tFunctionMatches) {
            tFunctionMatches.forEach(match => {
              const keyMatch = match.match(/t\(['"`]([^'"`]+)['"`]/);
              if (keyMatch) {
                const key = keyMatch[1];
                if (translationKeys.includes(key)) {
                  usedKeys.add(key);
                }
              }
            });
          }
        } catch (error) {
          console.error(`Error reading ${fullPath}:`, error.message);
        }
      }
    }
  }
  
  searchInDirectory(searchPath);
  return usedKeys;
}

// Function to remove unused keys from translation object
function removeUnusedKeys(obj, unusedKeys, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const cleanedValue = removeUnusedKeys(value, unusedKeys, currentKey);
      if (Object.keys(cleanedValue).length > 0) {
        result[key] = cleanedValue;
      }
    } else if (!unusedKeys.includes(currentKey)) {
      result[key] = value;
    }
  }
  
  return result;
}

// Main function
function findUnusedTranslations() {
  const translationFiles = [
    'public/messages/en.json',
    'public/messages/fr.json',
    'public/messages/ar.json'
  ];
  
  // Read all translation files and extract keys
  const allTranslationKeys = new Set();
  const translationObjects = {};
  
  for (const file of translationFiles) {
    const obj = readTranslationFile(file);
    if (obj) {
      const keys = extractKeys(obj);
      keys.forEach(key => allTranslationKeys.add(key));
      translationObjects[file] = obj;
    }
  }
  
  console.log(`Found ${allTranslationKeys.size} total translation keys`);
  
  // Find used keys in codebase
  const usedKeys = findTranslationUsage('.', Array.from(allTranslationKeys));
  console.log(`Found ${usedKeys.size} used translation keys`);
  
  // Find unused keys
  const unusedKeys = Array.from(allTranslationKeys).filter(key => !usedKeys.has(key));
  console.log(`Found ${unusedKeys.length} unused translation keys:`);
  
  unusedKeys.forEach(key => {
    console.log(`  - ${key}`);
  });
  
  // Remove unused keys from each translation file
  for (const [file, obj] of Object.entries(translationObjects)) {
    const cleanedObj = removeUnusedKeys(obj, unusedKeys);
    
    // Write cleaned file
    const cleanedContent = JSON.stringify(cleanedObj, null, 2);
    fs.writeFileSync(file, cleanedContent, 'utf8');
    console.log(`Cleaned ${file}`);
  }
  
  console.log('\nTranslation cleanup completed!');
}

// Run the script
findUnusedTranslations(); 