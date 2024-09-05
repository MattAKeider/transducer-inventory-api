# transducer-inventory-api
Transducer Inventory RESTful API build using Express.js and connecting to a MongoDB database.

## Run unit tests

Type `npm test` in terminal

## Setup local environment

1. Add a nodemon.json file to root of repository
2. Add environment variables to created file:

```
{
  "env": {
    "MONGODB_URL": "...add connection string URL to created MongoDB database",
    "JWT_KEY": "...add secret key for auth"
  }
}
```


3. Type `npm start` in terminal to start server

