# MySQL Migration Setup Script

# Install MySQL dependencies
echo "Installing MySQL dependencies..."
npm install mysql2 @types/mysql2

# Optional: Install Sequelize for ORM (alternative approach)
# npm install sequelize @types/sequelize

echo "Dependencies installed successfully!"

# Create environment variables template
echo "Creating MySQL environment template..."
cat >> .env.mysql.example << 'EOL'

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=website_tanijuu
MYSQL_PORT=3306

# Toggle between MongoDB and MySQL
DATABASE_TYPE=mysql  # or mongodb

EOL

echo "✅ MySQL setup completed!"
echo ""
echo "Next steps:"
echo "1. Install MySQL server on your system"
echo "2. Create database: CREATE DATABASE website_tanijuu;"
echo "3. Run schema: mysql -u root -p website_tanijuu_mysql < src/database/mysql-schema.sql"
echo "4. Copy .env.mysql.example to .env and configure your settings"
echo "5. Run migration: npm run migrate"
