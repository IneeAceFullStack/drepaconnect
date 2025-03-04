$env:DATABASE_URL="postgresql://postgres:*Amenadiel5@localhost:5432/drepaconnect"
$env:JWT_SECRET="drepaconnect_secret_key_2026"
$env:PORT="3001"
cd C:\Users\IneeAce_Scale\Desktop\drepaconnect\artifacts\api-server
node --enable-source-maps ./dist/index.mjs