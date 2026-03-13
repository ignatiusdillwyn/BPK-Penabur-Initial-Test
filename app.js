const express = require('express')
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const app = express()
const port = 3000
const routes = require('./routes')
require('dotenv').config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          in: "header",
          name: "access_token"
        }
      }
    }
  },
  apis: ["./routes/*.js"],
};

const swaggerDoc = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(express.json()); // ← HARUS ADA ini
app.use(express.urlencoded({ extended: true })); // ← Untuk form data

const cors = require('cors');

// Untuk mengizinkan semua origin
app.use(cors());

app.use(routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
