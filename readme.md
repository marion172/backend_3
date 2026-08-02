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
| **POST** | `/api/mocks/generate-products` | Query Params: `?count=10&saveToDatabase=true`<br>o Body JSON: `{ "count": 10, "saveToDatabase": true }` | Genera productos ficticios y opcionalmente los guarda en MongoDB si `saveToDatabase` es `true`. |

