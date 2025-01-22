import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

dotenv.config();

const doc = {
  info: {
    version: "0.0.0",
    title: "My API",
    description: "Description",
  },
  servers: [
    {
      url: process.env.API_HOST || "http://localhost:3000",
    },
  ],
  schemes: ["http"],
  definitions: {
    Contact: {
      $fname: "John",
      $lname: "Doe",
      dob: "1990-01-01",
      website: "https://example.com",
      personal_email: "john.doe@example.com",
      personal_phone: "+1 (123) 456-7890",
      work_email: "jdoe@work.com",
      work_phone: "+1 (987) 654-3210",
      is_favorite: false,
    },
    Roles: {
      id: 1,
      name: "Admin",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
