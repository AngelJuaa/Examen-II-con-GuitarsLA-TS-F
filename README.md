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

# GuitarsLA (Frontend)

Tienda de guitarras hecha con React + TypeScript + Vite. El catálogo se consume desde la API de GuitarsLA y permite registrar nuevas guitarras.

## Requisitos
- Node.js 18 o superior
- El backend de GuitarsLA corriendo (ver el README del proyecto `PERN`)

## 1. Instalar dependencias
```bash
npm install
```

## 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz :

```env
VITE_API_URL=http://localhost:4002
```

`VITE_API_URL` es la URL del backend. Si no se define, usa `http://localhost:4002`.

## 3. Arrancar el servidor de desarrollo
```bash
npm run dev
```
Abre `http://localhost:5173`.

> Levanta primero el backend y después el frontend. El backend debe permitir el origen `http://localhost:5173` en su variable `FRONTEND_URL`.

## Scripts
| Comando           | Descripción                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Servidor de desarrollo               |
| `npm run build`   | Compila TypeScript y genera `dist/`  |
| `npm run preview` | Previsualiza el build                |
| `npm run lint`    | Ejecuta ESLint                       |

## Funcionalidades
- **Catálogo (Read):** lista las guitarras desde `GET /api/guitars`, con estados de carga y error.
- **Formulario (Create):** envía `POST /api/guitars` con validaciones en el cliente (campos vacíos, precio no numérico o menor o igual a 0) y muestra los errores del servidor.
- **Carrito:** agregar, quitar, cambiar cantidades y vaciar, guardado en `localStorage`.

## Estructura
```
src/
├── api/guitars.ts            # Llamadas fetch a la API
├── components/
│   ├── Guitar.tsx
│   ├── GuitarForm.tsx
│   └── Header.tsx
├── hooks/useCart.ts          # Catálogo + carrito
├── App.tsx
└── types.d.ts
```

