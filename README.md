# Spoticord Database

> [!WARNING]
> This application is obsolete. Database communication will flow directly between the target application and the database using native calls, thereby making this middleman no longer necessary.

This is the primary way for all Spoticord related services to communicate with the backend database and some third party APIs.

Spoticord is currently designed around MySQL, but [any database supported by Prisma](https://www.prisma.io/docs/reference/database-reference/supported-databases) should work just fine.

## Setting up for development

```sh
git clone https://github.com/SpoticordMusic/spoticord-database.git

# Install packages
cd spoticord-database
yarn

# (Optional) copy example .env file to modify
cp .env.example .env
```

Before you can run `yarn dev` you should first set up your [Environment variables](#environment-variables). A .env.example file has been provided for users to fill out themselves. Further explaination can be found below.

After you've set up your environment you can run the code by using `yarn dev`, building can be done by running `yarn build`.

## Environment variables

| Environment variables | Description                                                                                                                                                            |              Required               |  Default  |
| :-------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------: | :-------: |
|         PORT          | The port number to listen on                                                                                                                                           |                 No                  |   3000    |
|   DISCORD_CLIENT_ID   | Your Discord application's Client ID                                                                                                                                   |                 Yes                 |   _N/A_   |
| DISCORD_CLIENT_SECRET | Your Discord applications' Client Secret                                                                                                                               |                 Yes                 |   _N/A_   |
|     DISCORD_TOKEN     | Your Discord bot's token                                                                                                                                               |                 Yes                 |   _N/A_   |
|   SPOTIFY_CLIENT_ID   | Your Spotify application's Client ID                                                                                                                                   |                 Yes                 |   _N/A_   |
| SPOTIFY_CLIENT_SECRET | Your Spotify application's Client Secret                                                                                                                               |                 Yes                 |   _N/A_   |
|     DATABASE_URL      | The connection string for connecting to your database                                                                                                                  |                 Yes                 |   _N/A_   |
|    MYSQL_DATABASE     | The name of the database your data should be stored in (MySQL). Only used when deploying using docker-compose.                                                         |                 No                  | spoticord |
|      MYSQL_USER       | The name of the user account that should be used when initially creating your database (MySQL, Only used when deploying using docker-compose, first-time only).        |                 No                  | spoticord |
|    MYSQL_PASSWORD     | The password of the user account that should be used when initially creating to your database (MySQL, Only used when deploying using docker-compose, first-time only). | When deploying using docker-compose |   _N/A_   |

## Deploy using Docker

This repository comes with a `docker-compose.yml`. You can deploy this project simply by running `docker-compose up -d` (as long as all required environment variables have been provided).
