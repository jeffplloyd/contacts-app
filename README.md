# Just a Contacts App

## Developing Locally
This project is a mono-repo consisting of a NodeJS backend, React UI front-end and a shared schema package.

**Prerequisites**
- NodeJS knowledge
- Some Docker knowledge
- Some Postgres or SQL knowledge
- React and Typescript knowledge

**Project Structure**
| Directory | Description |
| --------- | ----------- |
| **api** | NodeJS API back-end |
| **packages** | Shared packages |
| **ui** | React front-end application |

### **1. Install dependencies:**
```bash
npm install
```

### **2. Run API and Postgress DB:**
```bash
docker-compose up -d
```
This process will create docker images/containers for the Node.js API abck-end and the Postgres database, generate the API Swagger docs and run the API and DB on their respective ports. The database is prepopulated with contacts and roles.

| Layer | Port |
| ----- | ---- |
| **API** | 3000 |
| **Postgres** | 5432 |

#### API Location
You use the APIs locally via the `http://localhost:3000/{endpoint}` URL.

#### Swagger Docs
To access the Swagger Docs page to test the APIs, go to http://localhost:3000/docs in your browser. 

#### Shutting Down the Docker Containers
```bash
docker-compose down
```
This will stop the conainers and remove them from docker.

### **3. Run React UI:**
```bash
npm run start:ui
```
The React UI application is a vite-react application. When running the above command, it will serve the UI at http://localhost:5174 in development mode.

## Schema Based Architecture

This project uses a schema middleware powered by [zod](https://zod.dev/) to ensure sycronization of data between the React application (ui) and NodeJS API back-end (api). The zod schemas can be found in the [packages/schema](./packages/schema/src) directory in this project. 