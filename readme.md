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
## Requisitos entrega 4
## Sistema de Logging Centralizado (Winston)

El proyecto utiliza **Winston** y **winston-daily-rotate-file** para gestionar el registro centralizado de eventos y errores de la aplicación.

### Herramientas Utilizadas
* **Winston:** Logger profesional configurable para salidas multinivel (consola y archivos).
* **winston-daily-rotate-file:** Estrategia de rotación diaria de archivos de logs para evitar archivos de tamaño excesivo.

### Niveles de Log Configurados
Los niveles de log personalizados definidos son los siguientes:
1. `fatal`: Fallas críticas de la aplicación (ej. fallo al conectar a MongoDB al iniciar).
2. `error`: Errores inesperados del servidor (status 500).
3. `warning`: Advertencias y errores de negocio / cliente (status 4xx, validaciones, recurso no encontrado).
4. `info`: Información general sobre eventos importantes del sistema (inicio de servidor, conexión exitosa a DB, generación de mocks, creación de pedidos).
5. `http`: Logs relacionados con solicitudes HTTP.
6. `debug`: Información detallada para depuración durante el desarrollo.

### Comportamiento según el Entorno (`NODE_ENV`)
* **Desarrollo (`NODE_ENV=development`):** El logger se configura en nivel `debug`. Muestra en consola todos los niveles de log (`debug`, `http`, `info`, `warning`, `error`, `fatal`).
* **Producción (`NODE_ENV=production`):** El logger se restringe al nivel `info`. Muestra e informa únicamente los registros de nivel `info`, `warning`, `error` y `fatal`, omitiendo mensajes de depuración (`debug` y `http`).

### Persistencia y Rotación de Logs
* **Directorio de logs:** Todos los archivos persistidos se almacenan en la carpeta `/logs` ubicada en la raíz del proyecto.
* **Archivos generados:**
  * `error_%DATE%.log`: Almacena únicamente los eventos de nivel `error` y `fatal`.
  * `combined_%DATE%.log`: Almacena todos los eventos registrados a partir del nivel `info`.
* **Rotación:** Se conserva un historial máximo de 14 días (`maxFiles: '14d'`) con nombres rotados por fecha (`YYYY-MM-DD`).
* **Ignorados en Git:** La carpeta `/logs` está incluida en el archivo `.gitignore` para evitar subir logs al repositorio.

### Endpoints para Probar Registros de Eventos

1. **Usuarios (`/api/users`)**:
   * **Creación exitosa (`POST /api/users`):** Genera `[info] Usuario #<id> creado correctamente`.
   * **Usuario existente (`POST /api/users`):** Genera `[warning] El usuario con email <email> ya existe`.
   * **Usuario no encontrado (`GET /api/users/<id_inexistente>`):** Genera `[warning] Usuario #<id> no encontrado`.

2. **Productos (`/api/products`)**:
   * **Creación exitosa (`POST /api/products`):** Genera `[info] Producto #<id> creado correctamente`.
   * **Validación de precio/stock inválido (`POST /api/products`):** Genera `[warning] Precio inválido para el producto: <precio>`.
   * **Producto no encontrado (`GET /api/products/<id_inexistente>`):** Genera `[warning] Producto #<id> no encontrado`.
3. **Pedidos (`/api/orders`)**:
   * **Creación exitosa (`POST /api/orders`):** Genera `[info] Pedido #<id> creado correctamente`.
   * **Campos requeridos faltantes (`POST /api/orders`):** Genera `[warning] Missing required order fields`.
   * **Pedido no encontrado (`GET /api/orders/<id_inexistente>`):** Genera `[warning] Pedido #<id> no encontrado`.

4. **Entregas / Deliveries (`/api/deliveries`)**:
   * **Creación exitosa (`POST /api/deliveries`):** Genera `[info] Delivery #<id> creado correctamente`.
   * **Delivery no encontrado (`GET /api/deliveries/<id_inexistente>`):** Genera `[warning] Delivery #<id> no encontrado`.

5. **Endpoint de Prueba del Logger (`GET /api/mocks/loggerTest`)**:
   * **Prueba global de todos los niveles (`GET /api/mocks/loggerTest`):** Genera registros de prueba en todos los niveles (`fatal`, `error`, `warning`, `info`, `http`, `debug`).

## Requisitos entrega 5
## Documentación de API con Swagger / OpenAPI 3.0

El proyecto cuenta con documentación desarrollada bajo **OpenAPI 3.0** e integrada con **Swagger UI**.

### Acceso a la Documentación
Una vez iniciado el servidor (`npm run dev`), puedes acceder a Swagger UI a través del navegador web en:

**`http://localhost:3000/api/docs`**

### Módulos Documentados
La configuración de Swagger se encuentra en `src/config/swagger.js` y submódulos en `src/config/swagger/`. La documentación está organizada en las siguientes secciones (tags):

1. **`Health`**: Estado de salud del servidor (`GET /health`).
2. **`Users`**: Operaciones CRUD para gestión de usuarios (`/api/users`).
3. **`Products`**: Operaciones CRUD para productos (`/api/products`).
4. **`Orders`**: Operaciones CRUD para pedidos (`/api/orders`).
5. **`Deliveries`**: Operaciones CRUD para el seguimiento de entregas (`/api/deliveries`).
6. **`Mocks`**: Endpoints para generación de usuarios, productos, pedidos y entregas ficticios en memoria o persistidos en MongoDB (`/api/mocks`).
7. **`Logger`**: Endpoint de prueba (`GET /api/mocks/loggerTest`) destinado exclusivamente a la verificación del sistema de logs.

### Componentes y Esquemas Reutilizables
Se han definido componentes centralizados reutilizables en Swagger:
* **Schemas:** `User`, `UserCreateRequest`, `Product`, `ProductCreateRequest`, `Order`, `OrderItem`, `OrderCreateRequest`, `Delivery`, `DeliveryCreateRequest`, `MockDataPayload`, `MockResult`, `SuccessResponse` y `ErrorResponse`.
* **Responses:** Respuestas estandarizadas para `200`, `201`, `400 Bad Request`, `404 Not Found` y `409 Conflict`.
* **Parameters:** Parámetros de ruta reutilizables para IDs en MongoDB (`UserIdParam`, `ProductIdParam`, `OrderIdParam`, `DeliveryIdParam`).

### Aclaraciones para Probar en Swagger UI
* **Creación / Edición:** Al crear o actualizar usuarios/productos/pedidos, asegúrate de enviar datos válidos y no repetir emails o nombres únicos existentes para evitar colisiones 409.
* **Logger:** El endpoint `GET /api/mocks/loggerTest` es una herramienta de prueba interna para verificar la salida en los archivos `/logs` y la consola, no una funcionalidad de negocio.


