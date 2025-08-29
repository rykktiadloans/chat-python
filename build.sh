cd ./frontend/ && npm install && npm run build
cd .. 
rm -rf ./backend/static
mkdir ./backend/static
cp -rf frontend/dist/. ./backend/static
