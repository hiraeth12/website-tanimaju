// Script untuk memperbaiki route bibit dan panen dengan field mapping
import { readFileSync, writeFileSync } from 'fs';

// Fix bibit routes
function fixBibitRoutes() {
  const filePath = 'src/routes/mysql/bibitRoutes.ts';
  let content = readFileSync(filePath, 'utf-8');
  
  // Fix all adaptMySQLToMongo to adaptBibitMySQLToMongo
  content = content.replace(/adaptMySQLToMongo/g, 'adaptBibitMySQLToMongo');
  
  // Fix GET /:id
  content = content.replace(
    /const { id } = req\.params;/g,
    'const id = adaptMongoToMySQL(req.params.id);'
  );
  
  // Fix POST and PUT to handle field mapping if needed
  // Bibit structure should be compatible, so no field mapping needed for create/update
  
  writeFileSync(filePath, content);
  console.log('✅ Fixed bibit routes');
}

// Fix panen routes  
function fixPanenRoutes() {
  const filePath = 'src/routes/mysql/panenRoutes.ts';
  let content = readFileSync(filePath, 'utf-8');
  
  // Add import
  if (!content.includes('adaptPanenMySQLToMongo')) {
    content = content.replace(
      /import mysqlPool from "\.\.\/\.\.\/config\/mysql-database\.js";/,
      'import mysqlPool from "../../config/mysql-database.js";\nimport { adaptMongoToMySQL } from "../../utils/dataAdapter.js";\nimport { adaptPanenMySQLToMongo } from "../../utils/fieldAdapters.js";'
    );
  }
  
  // Fix all adaptMySQLToMongo to adaptPanenMySQLToMongo
  content = content.replace(/adaptMySQLToMongo/g, 'adaptPanenMySQLToMongo');
  
  // Fix ID parsing
  content = content.replace(
    /const { id } = req\.params;/g,
    'const id = adaptMongoToMySQL(req.params.id);'
  );
  
  writeFileSync(filePath, content);
  console.log('✅ Fixed panen routes');
}

function main() {
  console.log('🔄 Fixing bibit and panen routes...');
  
  try {
    fixBibitRoutes();
    fixPanenRoutes();
    console.log('✅ All routes fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing routes:', error);
  }
}

main();
