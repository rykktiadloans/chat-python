FROM python:3.12-trixie

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y nodejs npm

RUN pip install --no-cache-dir --upgrade -r /app/backend/requirements.txt

RUN chmod +x /app/build.sh

RUN cd /app && bash ./build.sh

EXPOSE 8000

WORKDIR /app/backend

CMD ["fastapi", "run", "--port", "8000", "main.py"]
