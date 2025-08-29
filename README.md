# Chat

A messaging app made in Python using FastAPI and React

## Features
- Registering new users
- Authorization using OAuth2
- Logging out
- Getting a list of contacts based on the most recent messages sent to all users
- Filtering contacts
- Finding new contacts
- Bidirectional chat 
- File and image attachments
- Delete and edit messages with double click

## Running with Docker
1. Set up a `.env` file like this
```bash
SECRET_KEY=sdhfajfghadhfgjahdfo # Generate with openssl rand -hex 32
HASH_ALGORITHM="HS256"          # Hashing algorithm, can stay like this
EXPIRATION_MINUTES=10           # Minutes after which JWT tokens run out
DB_NAME=chat                    # Name of the database
DB_USER=admin                   # Database user
DB_PASSWORD=password            # Database password
DB_URL=localhost                # Database URL
```
2. `docker compose --env-file=.env up --build`
