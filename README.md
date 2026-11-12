# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

# GuitarsLA API (Backend)

API RESTful con Node.js, Express, Sequelize y PostgreSQL para el catálogo de guitarras de GuitarsLA. Solo implementa **Crear** y **Leer**.

## Requisitos
- Node.js 18 o superior
- PostgreSQL (local o en la nube, por ejemplo Render)

## 1. Instalar dependencias
```bash
npm install
```

## 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```env
DATABASE_URL=postgresql://USUARIO:PASSWORD@HOST:5432/NOMBRE_DB
PORT=4002
FRONTEND_URL=http://localhost:5173
```

- `DATABASE_URL`: cadena de conexión a PostgreSQL. Si la base está en Render, agrega `?ssl=true` al final.
- `PORT`: puerto de la API (por defecto 4002).
- `FRONTEND_URL`: origen permitido por CORS (el de React). Acepta varios separados por coma.

> El archivo `.env` está en `.gitignore`. No lo subas a GitHub.

## 3. Cargar datos iniciales (opcional)
```bash
npm run seed
```
Crea la tabla `guitars` y carga 12 guitarras de ejemplo. Solo inserta si la tabla está vacía.

## 4. Arrancar el servidor
```bash
npm run dev
```
La API queda disponible en `http://localhost:4002`. Al iniciar, Sequelize crea o actualiza las tablas automáticamente.

## Endpoints

| Método | Ruta           | Descripción                     |
|--------|----------------|---------------------------------|
| GET    | `/api/guitars` | Devuelve todas las guitarras    |
| POST   | `/api/guitars` | Registra una nueva guitarra     |

### Modelo `guitars`
| Campo         | Tipo           | Reglas                                    |
|---------------|----------------|-------------------------------------------|
| `brand`       | STRING(100)    | Obligatorio (marca)                       |
| `name`        | STRING(100)    | Obligatorio (modelo)                      |
| `description` | STRING(500)    | Obligatorio                               |
| `price`       | DECIMAL(8,2)   | Obligatorio, numérico y mayor a 0         |
| `image`       | STRING(255)    | Obligatorio (nombre de archivo o URL)     |

### Ejemplo POST
```bash
curl -X POST http://localhost:4002/api/guitars \
  -H "Content-Type: application/json" \
  -d '{"brand":"Fender","name":"Stratocaster","description":"Clásica de seis cuerdas","price":899.99,"image":"guitarra_01"}'
```
Respuestas: `201 { "data": {...} }` si se guardó, `400 { "errors": [...] }` si falla la validación.

## CORS
Configurado con el paquete `cors`. Solo permite los orígenes de `FRONTEND_URL` y los métodos `GET`, `POST` y `OPTIONS`.

## Estructura
```
src/
├── config/db.ts          # Conexión Sequelize
├── models/Guitar.model.ts
├── handlers/guitar.ts    # Validaciones y controladores
├── router.ts             # Rutas
├── server.ts             # Express + CORS
├── seed.ts               # Datos iniciales
└── index.ts              # Arranque
```
