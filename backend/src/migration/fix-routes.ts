// Script untuk memperbaiki semua routes MySQL agar kompatibel dengan frontend
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const routesDir = 'src/routes/mysql';
const routes = ['petaniRoutes.ts', 'productRoutes.ts', 'postRoutes.ts', 'bibitRoutes.ts', 'tanamanRoutes.ts', 'panenRoutes.ts'];

interface RoutePattern {
  oldPattern: RegExp;
  newPattern: string;
}

const patterns: RoutePattern[] = [
  // Pattern untuk GET /:id
  {
    oldPattern: /const id = parseInt\(req\.params\.id\);\s*if \(isNaN\(id\)\) \{\s*return res\.status\(400\)\.json\(\{ error: "[^"]*" \}\);\s*\}/g,
    newPattern: 'const id = adaptMongoToMySQL(req.params.id);'
  },
  
  // Pattern untuk response dengan data langsung
  {
    oldPattern: /res\.json\(([^)]+)\);(?!\s*\/\/)/g,
    newPattern: 'const adaptedData = adaptMySQLToMongo($1);\n    res.json(adaptedData);'
  },
  
  // Add import
  {
    oldPattern: /import.*from.*"\.\.\/\.\.\/repositories\/.*\.js";/,
    newPattern: '$&\nimport { adaptMySQLToMongo, adaptMongoToMySQL } from "../../utils/dataAdapter.js";'
  }
];

function updateRouteFile(filePath: string) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    
    // Add import if not exists
    if (!content.includes('adaptMySQLToMongo')) {
      content = content.replace(
        /import.*from.*"\.\.\/\.\.\/repositories\/.*\.js";/,
        '$&\nimport { adaptMySQLToMongo, adaptMongoToMySQL } from "../../utils/dataAdapter.js";'
      );
    }
    
    // Fix ID parsing
    content = content.replace(
      /const id = parseInt\(req\.params\.id\);\s*if \(isNaN\(id\)\) \{\s*return res\.status\(400\)\.json\(\{ error: "[^"]*" \}\);\s*\}/g,
      'const id = adaptMongoToMySQL(req.params.id);'
    );
    
    // Fix responses (but avoid replacing already adapted ones)
    content = content.replace(
      /res\.json\(([^)]+)\);(?!\s*\/\/.*adapted)/g,
      (match, dataVar) => {
        if (dataVar.includes('adaptMySQLToMongo') || dataVar.includes('message') || dataVar.includes('error')) {
          return match; // Don't modify error responses or already adapted
        }
        return `const adaptedData = adaptMySQLToMongo(${dataVar});\n    res.json(adaptedData);`;
      }
    );
    
    writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error);
    return false;
  }
}

function main() {
  console.log('🔄 Updating all MySQL routes...');
  
  let updatedCount = 0;
  for (const route of routes) {
    const filePath = join(process.cwd(), routesDir, route);
    if (updateRouteFile(filePath)) {
      updatedCount++;
    }
  }
  
  console.log(`✅ Updated ${updatedCount}/${routes.length} route files`);
}

main();
