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

A continuación se muestran ejemplos para probar las respuestas de error controladas desde Postman:

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

## Requisitos entrega 6
## Tests Funcionales Automatizados

El proyecto cuenta con pruebas funcionales automatizadas que validan los endpoints principales de la API.

### 1. Herramientas Utilizadas
* **Mocha :** Test runner y framework para organizar suites (`describe`) y casos de prueba (`it`) con soporte nativo de módulos ES.
* **Chai :** Librería de aserciones (`expect`) para validar códigos de respuesta, tipos de datos, headers y estructura detallada del body.
* **Supertest :** Cliente HTTP para simular peticiones contra la aplicación Express sin necesidad de abrir manualmente puertos de red.

### 2. Separación de Responsabilidades y Base de Datos de Test
* **App Express Aislada (`src/app.js`):** La definición de Express, middlewares y rutas se encuentra desacoplada de la ejecución del servidor (`src/index.js`), permitiendo a Supertest instanciar la app en memoria de forma segura y eficiente sin necesidad de abrir un puerto de red.
* **Base de Datos Exclusiva de Testing (`shipnow_test`):** Las pruebas se conectan automáticamente a una base de datos separada (se debe agregar `MONGODB_TEST_URI` en `.env` por ejemplo `mongodb://127.0.0.1:27017/shipnow_test`), manteniendo los datos de (`shipnow`) 100% intactos.
* **Estrategia de Limpieza :** En `test/index.js`, se conecta a la base de testing antes de iniciar y se limpian las colecciones antes de cada suite de pruebas (`clearDatabase()`), garantizando que ningún test dependa del orden de ejecución ni del estado previo.


### 3. Cómo Ejecutar los Tests
Para correr toda la suite de pruebas funcionales automatizadas:
```bash
npm test
```

### 4. Módulos y Escenarios Cubiertos

| Módulo | Endpoint / Recurso | Casos de Éxito Validados | Casos de Error y Códigos Validados |
| :--- | :--- | :--- | :--- |
| **Usuarios** | `/api/users` | • Listado de usuarios (200, array)<br>• Creación con datos válidos (201)<br>• Obtención por ID (200)<br>• Actualización (200)<br>• Eliminación (200) | • Datos incompletos (400 `VALIDATION_ERROR`)<br>• Email duplicado (409 `USER_ALREADY_EXISTS`)<br>• Usuario inexistente (404 `USER_NOT_FOUND`)<br>• ID con formato inválido (400 `INVALID_ID`) |
| **Pedidos** | `/api/orders` | • Listado de pedidos (200)<br>• Creación con cliente vinculado (201)<br>• Obtención por ID (200)<br>• Actualización de estado (200)<br>• Eliminación (200) | • Campos obligatorios faltantes (400 `VALIDATION_ERROR`)<br>• Pedido inexistente (404 `ORDER_NOT_FOUND`)<br>• ID con formato inválido (400 `INVALID_ID`) |
| **Productos** | `/api/products` | • Listado de productos (200)<br>• Creación con stock y precio válidos (201)<br>• Obtención por ID (200)<br>• Actualización (200)<br>• Eliminación (200) | • Precio negativo (400 `PRODUCT_PRICE_ERROR`)<br>• Nombre duplicado (409 `PRODUCT_ALREADY_EXISTS`)<br>• Producto inexistente (404 `PRODUCT_NOT_FOUND`) |
| **Entregas (Deliveries)** | `/api/deliveries` | • Listado de entregas (200)<br>• Creación vinculada a pedido (201)<br>• Obtención por ID (200)<br>• Actualización de estado (200)<br>• Eliminación (200) | • Falta `orderId` (400 `VALIDATION_ERROR`)<br>• Entrega inexistente (404 `DELIVERY_NOT_FOUND`) |
| **Documentos de Usuario** | `/api/users/:id/documents` | • Carga exitosa de documento y guardado de metadatos (200) | • Archivo faltante (400 `FILE_REQUIRED`)<br>• Tipo de documento inválido (400 `INVALID_DOCUMENT_TYPE`)<br>• Formato no permitido (400 `INVALID_FILE_TYPE`)<br>• Usuario no encontrado (404 `USER_NOT_FOUND`) |
| **Comprobantes de Entrega** | `/api/deliveries/:id/receipt` | • Carga exitosa de comprobante y guardado de metadatos (200) | • Entrega no encontrada (404 `DELIVERY_NOT_FOUND`)<br>• Archivo faltante o formato no permitido (400) |
| **Mocks** | `/api/mocks` | • Generación de usuarios en memoria (200)<br>• Generación de pedidos en memoria (200)<br>• Generación completa `generateData` (200)<br>• Persistencia `seed` y `seed-orders` (201) | • Cantidades negativas o <= 0 (400 `INVALID_MOCK_QUANTITY`)<br>• Cantidades que exceden el límite de 100 (400 `INVALID_MOCK_QUANTITY`) |
| **Logger** | `/api/mocks/loggerTest` | • Respuesta 200 y confirmación de ejecución de log multinivel | N/A |
| **Swagger** | `/api/docs/` | • Respuesta 200 y disponibilidad de HTML de Swagger UI | N/A |
| **Rutas No Encontradas** | `/api/*` (global) | N/A | • Ruta inexistente (404 `ROUTE_NOT_FOUND`) con formato estandarizado |

## Requisitos entrega 7
## Subida de Archivos y Registro de Metadatos con Multer

El proyecto integra **Multer** para el procesamiento, validación y almacenamiento de archivos subidos al servidor, registrando únicamente sus metadatos en la base de datos de MongoDB.

### 1. Configuración Centralizada de Multer
* **Ubicación:** [src/config/multer.config.js]
* **Motor de almacenamiento:** Utiliza `multer.diskStorage` configurado de forma independiente a los routers.
* **Nombres de archivo:** Nombre unico, al nombre original se añade un timestamp único (`<nombre_base>-<timestamp>.<ext>`) para evitar colisiones.
* **Tipos permitidos (MIME):** `image/jpeg`, `image/png`, `image/jpg` y `application/pdf`.
* **Tamaño máximo:** 5 MB (`5 * 1024 * 1024` bytes).
* **Manejo centralizado de errores:** Middleware `handleUpload` que captura errores propios de Multer (ej. `LIMIT_FILE_SIZE`, `LIMIT_UNEXPECTED_FILE`) y los transfiere al sistema central de errores `CustomError`.

### 2. Estructura de Carpetas e Ignorado en Repositorio
* **Directorio de destino:** Los archivos se organizan por tipo en la carpeta `/uploads`:
  * `uploads/documents/`: Documentos de usuario (DNI, licencias, etc.).
  * `uploads/receipts/`: Comprobantes de entregas y recibos.
* **Exclusión de Git:** La carpeta `uploads/` se encuentra agregada en el archivo [`.gitignore`] para impedir la subida de archivos cargados al repositorio.

### 3. Registro Exclusivo de Metadatos en MongoDB
En MongoDB no se almacena el contenido binario del archivo, únicamente sus metadatos representados por el esquema [src/models/document.schema.js]:
```json
{
  "originalName": "dni.pdf",
  "filename": "dni-1788613725030.pdf",
  "path": "uploads/documents/dni-1788613725030.pdf",
  "mimetype": "application/pdf",
  "size": 1024,
  "documentType": "identification",
  "uploadedAt": "2026-09-05T10:08:45.845Z"
}
```

### 4. Endpoints Implementados
* **`POST /api/users/:id/documents`**: Recibe el ID de usuario, el archivo en el campo `file` y opcionalmente `documentType` (`identification`, `license`, `receipt`, `invoice`, `delivery_proof`). Verifica la existencia del usuario, valida el archivo y registra los metadatos en la propiedad `documents` del usuario.
* **`POST /api/orders/:id/receipt`**: Recibe el ID del pedido, el archivo en el campo `file` y opcionalmente `documentType`. Valida la existencia de la entidad y registra los metadatos en la propiedad `receipts` del pedido.
* **`POST /api/deliveries/:id/receipt`**: Recibe el ID de la entrega y el archivo en el campo `file`. Valida la existencia de la entidad y registra los metadatos en la propiedad `receipts` de la entrega.

### 5. Errores Específicos de Archivos
Todos los errores responden con el formato unificado del proyecto (`{ status: "error", error: "...", message: "..." }`):
* `FILE_REQUIRED` (400): No se adjuntó ningún archivo en la petición.
* `INVALID_FILE_TYPE` (400): El tipo MIME o la extensión del archivo no está entre las permitidas (JPG, PNG, PDF).
* `FILE_TOO_LARGE` (400): El archivo supera el tamaño máximo permitido de 5MB.
* `INVALID_FILE_FIELD` (400): El campo del formulario no coincide con el esperado (`file`).
* `INVALID_DOCUMENT_TYPE` (400): El tipo de documento especificado no pertenece a los permitidos.
* `USER_NOT_FOUND` / `ORDER_NOT_FOUND` / `DELIVERY_NOT_FOUND` (404): La entidad indicada en los parámetros no existe.

### 6. Logging de Eventos de Carga
El logger registra automáticamente eventos clave:
* `[info]` Carga exitosa de documentos o comprobantes asociados a entidades.
* `[warning]` Intentos de subida con tipos de archivo no permitidos.
* `[warning]` Solicitudes sin archivo o excediendo el límite de tamaño.

### 7. Documentación en Swagger UI
Los endpoints de subida están especificados en `src/docs/users.yaml`, `src/docs/orders.yaml` y `src/docs/delivery.yaml` con el esquema `multipart/form-data`, definiendo el campo `file` en formato binario, los enumerados de `documentType` y las respuestas HTTP posibles (200, 400, 404, 500).

---

## Requisitos Entrega 8: Preparación para Producción, Performance y Docker

### 1. Variables de Entorno Necesarias
La API de ShipNow requiere la configuración de variables de entorno mediante un archivo `.env` en la raíz del proyecto. Si falta alguna variable crítica al arrancar, la aplicación abortará inmediatamente notificando cuál es la variable faltante.

| Variable | Tipo | Requerida | Valor por Defecto / Ejemplo | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Número | **Sí (Crítica)** | `3000` | Puerto en el que la API escucha las peticiones HTTP. |
| `NODE_ENV` | String | **Sí (Crítica)** | `development` (`development`, `test`, `production`) | Entorno de ejecución de la aplicación. |
| `MONGODB_URI` | String | **Sí (Crítica)** | `mongodb://127.0.0.1:27017/shipnow` | URI de conexión a la base de datos MongoDB. |
| `MONGODB_TEST_URI` | String | No | `mongodb://127.0.0.1:27017/shipnow_test` | URI de base de datos para la suite de pruebas unitarias/integración. |
| `JWT_SECRET` | String | No | `secreto_jwt_dev_123` | Clave secreta para la firma y verificación de tokens JWT. |
| `LOG_LEVEL` | String | No | `info` (`fatal`, `error`, `warning`, `info`, `http`, `debug`) | Nivel mínimo de registro para Winston Logger. |
| `EXTERNAL_SERVICE_URL` | String | No | `http://localhost:4000` | URL base de integración con servicios externos. |

El archivo `.env.example` contiene la plantilla actualizada.

---

### 2. Cómo Correr la API Localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el archivo `.env` agregar la configuracion de los parametros que indica:**
   ```bash
   (comando cmd) copy .env.example .env
   ```

3. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Iniciar en modo producción:**
   Configura `NODE_ENV=production` en tu archivo `.env` y ejecuta:
   ```bash
   npm start
   ```

---

### 3. Cómo Correr los Tests
La aplicación cuenta con una suite completa de pruebas de integración y unidad con Mocha, Chai y Supertest.

```bash
npm test
```

---

### 4. Acceso a Swagger y Endpoints Principales

- **Documentación Swagger UI:** `http://localhost:3000/api/docs` (o `/api/docs/`)
- **Health Check de la API:** `http://localhost:3000/health` (Retorna estado `"UP"`, entorno, uptime y timestamp sin exponer datos sensibles).
- **Criterio sobre Endpoints Internos (`/api/mocks`):** 
  - Los endpoints de generación de mocks y prueba del logger (`/api/mocks/*`) están restringidos y deshabilitados en entorno de producción (`NODE_ENV === 'production'`).
  - Swagger UI permanece activo en desarrollo y pruebas para auditoría de API.

---

### 5. Dockerización y Contenerización

El proyecto cuenta con la infraestructura completa para ejecutarse en contenedores mediante **`Dockerfile`**, **`.dockerignore`** y **`docker-compose.yml`**.

#### a. Archivos de Contenerización Incluidos
- **`Dockerfile`:** Utiliza la imagen oficial `node:20-alpine`, establece el directorio de trabajo en `/app`, instala dependencias de producción (`npm install`), copia el código fuente, expone el puerto `3000` y define el punto de entrada (`CMD ["node", "src/index.js"]`).
- **`.dockerignore`:** Garantiza que no se suban archivos innecesarios ni sensibles dentro de la imagen de Docker, ignorando: `node_modules/`, `.env`, `.git/`, `logs/`, `uploads/`.

#### b. Variables de Entorno Necesarias para Docker
Al ejecutar el contenedor, la API recibe sus variables de entorno mediante un archivo `.env` externo o por banderas `-e`. Las variables requeridas son:
- `PORT` (por defecto `3000`)
- `NODE_ENV` (`production` / `development`)
- `MONGODB_URI` (URI a la base de datos MongoDB)
- `JWT_SECRET`, `LOG_LEVEL` y `EXTERNAL_SERVICE_URL`

#### c. Construcción de la Imagen y Ejecución del Contenedor (Dockerfile individual)
1. **Construir la imagen Docker:**
   ```bash
   docker build -t shipnow-api .
   ```
2. **Ejecutar el contenedor:**
   ```bash
   docker run -d -p 3000:3000 --name shipnow-container --env-file .env -e MONGODB_URI=mongodb://host.docker.internal:27017/shipnow shipnow-api
   ```
   *(Nota: Se utiliza `host.docker.internal` para comunicar el contenedor de la API con el MongoDB que escucha en la máquina anfitriona)*.

#### d. Orquestación con `docker-compose.yml` (API + MongoDB)
Se incluye y documenta el archivo **`docker-compose.yml`**, el cual orquesta y levanta en conjunto todos los servicios necesarios para que la aplicación funcione de forma totalmente autónoma (servicio de **API** + servicio de **MongoDB** en un contenedor dedicado):

- **Comando para levantar todos los servicios:**
  ```bash
  docker-compose up -d --build
  ```
- **Servicios levantados:**
  - `shipnow_api`: Servicio de la API Node.js (escuchando en el puerto 3000).
  - `shipnow_mongo`: Servicio de la base de datos MongoDB (escuchando en el puerto 27017).
- **Verificar salud de los servicios:** `http://localhost:3000/health`
- **Detener los servicios:** `docker-compose down`

---

### 6. Performance, Logs y Almacenamiento de Uploads

- **Paginación y Filtros de Colecciones Grandes:**
  - Los endpoints de listas (`GET /api/users`, `GET /api/orders`, `GET /api/deliveries`, `GET /api/products`) soportan los parámetros de paginación `page` (por defecto 1), `limit` (por defecto 50, máximo 100) y filtros específicos (`role`, `status`, `search`).

- **Límites de Payload y Seguridad HTTP:**
  - Se limita el tamaño del cuerpo JSON a 1MB (`express.json({ limit: '1mb' })`).

- **Estrategia de Logging (Winston + Daily Rotate):**
  - Los logs se escriben en consola y se almacenan en rotación diaria dentro del directorio `logs/` (`error_YYYY-MM-DD.log` y `combined_YYYY-MM-DD.log`), conservándose por un máximo de 14 días (`maxFiles: '14d'`).

- **Carga Limitada y Almacenamiento Fuera del Repositorio:**
  - Los uploads están restringidos a un máximo de 5MB por archivo y tipos MIME autorizados (`image/jpeg`, `image/png`, `application/pdf`).
  - Se almacenan de forma local en la carpeta `/uploads` (la cual no se sube a Git ni se empaqueta en la imagen Docker) almacenando únicamente los metadatos descriptivos en MongoDB.





