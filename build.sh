cd ./frontend/ && npm i && npm run build
cd .. 
if [ ! -d ./backend/static ]; then
    mkdir ./backend/static
fi
cp -rf ./frontend/dist/. ./backend/static
