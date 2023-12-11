# Node-TypeScript Starter with Postgres

A dockerized starter Node-Express-TS project with Postgres and MikroORM. Has example user Authentication.

## Setup

`npm i`

## Development

`docker compose -f docker-compose.dev.yml up`
`docker compose -f docker-compose.dev.yml up --build`

## Production

`docker compose up`

## MikroORM create migration files

`npm run create-migration`

## MikroORM migrate to DB

`npm run migrate`
