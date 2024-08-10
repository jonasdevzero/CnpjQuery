<h1 align="center">Cnpj Query</h1>

## Summary

* [About](#about)
  * [Challenge](#challenge)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Config Docker](#config-docker)
* [Load all data](#load-all-data)
* [Start server](#start-server)

## About

This project is an API responsible for querying data from Brazilian companies.

The API is responsible for processing, storing and making available information from Brazilian companies. The data is made available in raw form through a public API from the Brazilian government, where the information is arranged in multiple zipped CSV files.

🔥 Some numbers highlight the scale of this challenge:

✨ **38GB** of data processed <br />
✨ Over **200 MILLION** CSV lines processed <br />
✨ Low RAM consumption

### Challenge

The biggest challenge was to ensure that the process was efficient in terms of performance and memory management.
To achieve this, I chose to develop most of the solution natively in Node.js. I used the http module to download files, the npm unzipper package for unzipping, and the npm package "postgres" for interacting with the database.
All queries and table creation were manually optimized to achieve maximum performance.

During development, I created an innovative solution called "stream iterator", designed to process data in blocks that came in a data stream, basically: it divides the data blocks into smaller and equal sub-blocks,
pauses the stream, processes the data, stores it in the database, and continues the stream. This technique significantly reduced RAM consumption and improved the overall performance of the system.

## Prerequisites
* NPM
* Node.js
* Docker

To install NPM and Node.js you can use the following website: [Install Node.js](https://nodejs.org/en/download/package-manager).
To install Docker access this website: [Install Docker](https://docs.docker.com/engine/install/)

## Installation

1. Clone the repository
    ```sh
   git clone https://github.com/jonasdevzero/CnpjQuery
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Config Env file. To this create a file called '.env' from the '.env.example' file. Inside the new file, set all the necessary variables.
   
## Config Docker

The Docker compose contains a PostgreSQL database and Redis. To start the service use the following command:

```sh
docker compose up -d
```

When the database service is running run this command to create the API database and the tables:

```sh
npm run db:migrations:up
```

Created the database, run this command to generate the seed:

```sh
npm run db:seed
```

## Load all data

To load, process and store all data from Brazilian companies run this command:

```sh
npm run query
```

**Att: This command will take hours to complete**

## Start server

When all data is loaded, it's time to make available the refined data, to do this run this command:

```sh
npm run dev
```

Endpoint: Method GET and path **/:cnpj**


