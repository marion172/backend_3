# ShipNow API

API REST modular desarrollada con Node.js, Express y Mongoose, implementando una arquitectura en 3 capas.

## Instrucciones para Correr el Proyecto Localmente

### 1. Clonar e Instalar Dependencias
Asegúrate de tener instalado [Node.js](https://nodejs.org/). En la terminal del proyecto, ejecuta:
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo de plantilla [.env.example] para crear tu propio archivo de configuración local:

Abre el archivo `.env` recién creado y completa las variables de entorno con los valores de tu entorno. Por ejemplo:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
```

### 3. Iniciar el Servidor de Desarrollo
Para correr la aplicación con reinicio automático al guardar cambios, ejecuta:
```bash
npm run dev
```

El servidor estará escuchando en el puerto configurado (ej. `http://localhost:3000`). 

## Separación de Responsabilidades: Service vs. Repository

Se separa la lógica de la aplicación en capas diferenciadas para cumplir con el **Principio de Responsabilidad Única (SRP)** y facilitar la mantenibilidad del código:

### Capa de Repositorio (Repository)
* **Ubicación:** [src/repositories/]
* **Responsabilidad:** Encapsula **únicamente** el acceso a los datos directos en MongoDB.
* **Por qué existe:** Es la única capa que interactúa con los Modelos de Mongoose.

### Capa de Servicio (Service)
* **Ubicación:** [src/services/]
* **Responsabilidad:** Aloja toda la **lógica de negocio** y las validaciones de dominio.
* **Por qué existe:** El servicio no sabe si los datos se guardan en MongoDB, en un archivo de texto o en otra base de datos; simplemente interactúa con el Repositorio a través de métodos limpios de Javascript. 

## Estructura del Proyecto

```text
src/
├── config/          # Configuración del entorno (dotenv, db connection)
├── constants/       # Constantes globales de dominio
├── controllers/     # Controladores (manejo de req y res)
├── models/          # Esquemas y modelos de Mongoose
├── repositories/    # Capa de datos (queries a MongoDB)
├── routes/          # Enrutadores minimalistas (conector Path -> Controller)
├── services/        # Capa de negocio (cálculos, validaciones, lógica)
└── index.js         # Punto de entrada de la aplicación
```

## Requisitos entrega 2

### Guía para probar los endpoints en Postman

**Base URL:** `http://localhost:3000` 

#### 1. Mocks (Generación de datos sin o con persistencia)

| Método | Endpoint | Query Params / Body | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/mocks/mocking-users` | `?count=10` | Genera usuarios ficticios en memoria. |
| **GET** | `/api/mocks/mocking-orders` | `?count=10` | Genera pedidos ficticios en memoria con items, dirección y total. |
| **GET** | `/api/mocks/generateData` | `?users=10&orders=5` | Genera un conjunto completo en memoria (`users`, `orders` relacionados con clientes, y `deliveries` vinculadas a pedidos y repartidores). |
| **POST** | `/api/mocks/seed` | `?count=10` | Genera e inserta usuarios de prueba en MongoDB mediante el repositorio. Devuelve `{ "insertados": X, "coleccion": "usuarios" }`. |
| **POST** | `/api/mocks/seed-orders` | `?count=10` | Genera e inserta pedidos de prueba en MongoDB mediante el repositorio. Devuelve `{ "insertados": X, "coleccion": "pedidos" }`. |
| **POST** | `/api/mocks/seed-deliveries` | `?count=10` | Genera e inserta entregas de prueba en MongoDB mediante el repositorio. Devuelve `{ "insertados": X, "coleccion": "entregas" }`. |
| **POST** | `/api/mocks/seed-data` | `?users=10&orders=10` | Genera e inserta usuarios, pedidos y entregas de prueba relacionados en MongoDB. |
| **POST** | `/api/mocks/generate-products` | Query Params: `?count=10&saveToDatabase=true`<br>o Body JSON: `{ "count": 10, "saveToDatabase": true }` | Genera productos ficticios y opcionalmente los guarda en MongoDB si `saveToDatabase` es `true`. |
| **POST** | `/api/mocks/generate-orders` | Query Params: `?count=10&saveToDatabase=true`<br>o Body JSON: `{ "count": 10, "saveToDatabase": true }` | Genera pedidos ficticios y opcionalmente los guarda en MongoDB si `saveToDatabase` es `true`. |

## Requisitos entrega 3
## Manejo Centralizado de Errores

El proyecto implementa un sistema centralizado de gestión de errores compuesto por la clase personalizada `CustomError`, el diccionario `ERROR_CODES` y el middleware global `errorHandler`.

### Estructura Uniforme de Respuesta HTTP
Todas las respuestas de error emitidas por la API siguen una estructura unificada y predecible:

```json
{
  "status": "error",
  "error": "CODIGO_DE_ERROR",
  "message": "Mensaje descriptivo del error"
}
```

### Guía para Probar el Comportamiento ante Casos Inválidos

A continuación se muestran ejemplos para probar las respuestas de error controladas desde Postman o cURL:

#### 1. Módulo de Mocks - Cantidad Inválida o Valores Negativos
* **Endpoint:** `GET /api/mocks/mocking-users?count=-5`
* **Resultado:** HTTP 400 Bad Request
* **Respuesta:**
  ```json
  {
    "status": "error",
    "error": "INVALID_MOCK_QUANTITY",
    "message": "Invalid mock quantity. Must be between 1 and 100."
  }
  ```
* **Endpoint:** `GET /api/mocks/mocking-orders?count=500` (excede el límite máximo de 100)
* **Resultado:** HTTP 400 Bad Request (`INVALID_MOCK_QUANTITY`)

#### 2. Módulo de Mocks - Generación Completa con Valores Negativos
* **Endpoint:** `GET /api/mocks/generateData?users=-10&orders=5`
* **Resultado:** HTTP 400 Bad Request (`INVALID_MOCK_QUANTITY`)

#### 3. Búsqueda de Recurso Inexistente (404)
* **Endpoint:** `GET /api/users/64f1a2b3c4d5e6f7a8b9c0d1`
* **Resultado:** HTTP 404 Not Found
* **Respuesta:**
  ```json
  {
    "status": "error",
    "error": "USER_NOT_FOUND",
    "message": "User not found"
  }
  ```

#### 4. ID de MongoDB con Formato Inválido (400)
* **Endpoint:** `GET /api/users/invalid-id-format`
* **Resultado:** HTTP 400 Bad Request
* **Respuesta:**
  ```json
  {
    "status": "error",
    "error": "INVALID_ID",
    "message": "Invalid id"
  }
  ```

#### 5. Validación de Negocio (Producto con Precio Negativo)
* **Endpoint:** `POST /api/products`
* **Body JSON:**
  ```json
  {
    "name": "Producto Invalido",
    "description": "Test",
    "price": -50,
    "stock": 10
  }
  ```
* **Resultado:** HTTP 400 Bad Request
* **Respuesta:**
  ```json
  {
    "status": "error",
    "error": "PRODUCT_PRICE_ERROR",
    "message": "Product price error price must be grater than 0"
  }
  ```

#### 6. Ruta Inexistente (404 Global)
* **Endpoint:** `GET /api/ruta-inexistente`
* **Resultado:** HTTP 404 Not Found
* **Respuesta:**
  ```json
  {
    "status": "error",
    "error": "ROUTE_NOT_FOUND",
    "message": "Route not found"
  }
  ```


