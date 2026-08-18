import swaggerJSDoc from "swagger-jsdoc";
import { envConfig } from "../config/index.js";
import schemas from "./swagger/schemas.js";
import responses from "./swagger/responses.js";
import parameters from "./swagger/parameters.js";

const swaggerSpecs = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API para el manejo de entregas',
    },
    servers: [
      {
        url: `http://localhost:${envConfig.PORT ?? 3000}`,
        description: 'Development Server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Service status related endpoints' },
      { name: 'Users', description: 'Endpoints related to users' },
      { name: 'Products', description: 'Endpoints related to products' },
      { name: 'Orders', description: 'Endpoints related to orders' },
      { name: 'Deliveries', description: 'Endpoints related to delivery' },
      { name: 'Mocks', description: 'Endpoints related to mocks' },
      { name: 'Logger', description: 'Endpoints related to logging' },
    ],
    components: {
      schemas,
      responses,
      parameters,
    }
  },
  apis: ['./src/docs/**/*.yaml'],
});

export default swaggerSpecs;