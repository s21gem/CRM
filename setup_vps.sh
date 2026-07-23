#!/bin/bash
set -e

echo "Updating packages..."
sudo apt update -y

echo "Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y

echo "Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE fonebox;" || true
sudo -u postgres psql -c "CREATE USER fonebox_user WITH ENCRYPTED PASSWORD 'fonebox_pass';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fonebox TO fonebox_user;" || true
sudo -u postgres psql -d fonebox -c "GRANT ALL ON SCHEMA public TO fonebox_user;" || true
# For Prisma shadow DB
sudo -u postgres psql -c "ALTER USER fonebox_user CREATEDB;" || true

echo "Installing PM2..."
sudo npm install -g pm2 || true

echo "Setting up CRM folder..."
sudo mkdir -p /var/www/CRM
sudo chown -R $USER:$USER /var/www/CRM
cd /var/www/CRM

if [ ! -d ".git" ]; then
  echo "Cloning repository..."
  git clone https://github.com/s21gem/CRM.git .
else
  echo "Pulling latest code..."
  git pull origin main
fi

echo "Creating .env..."
cat <<EOF > .env
DATABASE_URL="postgresql://fonebox_user:fonebox_pass@localhost:5432/fonebox"
JWT_SECRET="super-secure-jwt-secret-key-12345"
PORT=5000
EOF

echo "Installing dependencies..."
npm install

echo "Pushing Prisma Schema..."
npx prisma db push --accept-data-loss

echo "Building React App..."
npm run build

echo "VPS Setup Script Finished Successfully."
