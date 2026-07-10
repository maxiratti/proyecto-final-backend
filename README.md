# 💻 Proyecto Final - API REST de Productos (Node.js + Express + Firebase + JWT)

---
Proyecto realizado por **MAXIMILIANO CARLOS RATTI** para el curso de **Backend con Node JS** de **Talento Tech** 
---

Pasos realizados en el proyecto:

1) crear tu propio proyecto de Firebase, 
2) pegar credenciales en el `.env`, 
3) instalar dependencias,
4) probarlo con Postman.


## 🛠️ 1. Instalar dependencias

Abrír una terminal dentro de esta carpeta (`proyecto-final`) y correr:

```bash
npm install
```

Esto va a leer el `package.json` (ya armado) e instalar express, cors,
body-parser, dotenv, firebase y jsonwebtoken.

## 2. Crear proyecto de Firebase (Firestore)

1. Entrar a https://console.firebase.google.com/
2. "Agregar proyecto" → ponerle un nombre (ej: `proyecto-final-backend`) → seguir los pasos (desactivar Google Analytics).
3. Una vez creado, en el menú izquierdo ir a **Compilación → Firestore Database** → "Crear base de datos" → elegir modo **producción**  → elegir una región: la más cercana a Argentina, `southamerica-east1`.
4. Crear una colección llamada **`products`**.
5. Dentro de esa colección, agregar un primer documento manualmente con estos campos, para darle estructura:
   - `name` (string) → ej: "Zapatillas Running"
   - `price` (number) → ej: 25000
   - `stock` (number) → ej: 10
   - `category` (string) → ej: "Calzado"

## 3. Conectar Firebase con el proyecto (obtener las credenciales)

1. En la consola de Firebase, ir al ícono de engranaje (⚙️) → **Configuración del proyecto**.
2. Ir hasta "Tus apps" → hacer clic en el ícono `</>` (Web) para registrar una app web.
3. Ponerle un nombre (ej: "api-productos") y registrala. NO hace falta Firebase Hosting.
4. Firebase te va a mostrar un objeto `firebaseConfig` con estos datos:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

5. Copiar esos valores dentro del archivo `.env` ya creado en la raíz del proyecto, reemplazando los valores de ejemplo:

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

**Importante sobre las reglas de Firestore:** si elegimos "modo producción", las reglas
por defecto bloquean todas las lecturas/escrituras. Para que la API pueda leer y escribir
ir a **Firestore Database → Reglas** y poner temporalmente:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ En un proyecto real nunca dejar la base abierta así.

## 4. Variables de JWT y usuario de prueba

En el `.env` ya están precargadas estas variables (cambiarlas si es necesario):

```
JWT_SECRET=una_clave_secreta_bien_larga_y_dificil_de_adivinar
JWT_EXPIRES_IN=1h
ADMIN_USER=admin
ADMIN_PASSWORD=admin123
```

Estas son las credenciales que vamos a usar para hacer login (no hay una base de
usuarios, es un login simple contra estas variables).

## 5. Correr el servidor

```bash
npm run start
```

Si todo está bien configurado, se verá en la consola:

```
Servidor corriendo en http://localhost:3000
```

## 6. Probar con Postman

Importar el archivo `postman_collection.json` (incluido en esta carpeta) en Postman:
`File → Import → seleccioná el archivo`.

Orden para probar:

1. **Auth - Login** (`POST /auth/login`) con body:
   ```json
   { "username": "admin", "password": "admin123" }
   ```
   Devuelve un `token`. Copiar el valor (sin la palabra "Bearer") y pegarlo en la
   variable de colección `token`.

2. **Products - Get All** (`GET /api/products`) → debería devolver el producto que se creó manualmente en Firestore.

3. **Products - Create** (`POST /api/products/create`) → crea un producto nuevo.

4. **Products - Get By Id** (`GET /api/products/:id`) → reemplazar `:id` por el ID real de un producto (se ve en la respuesta del paso anterior o en Firestore).

5. **Products - Update** (`PUT /api/products/:id`).

6. **Products - Delete** (`DELETE /api/products/:id`).

7. Probar también sin el token (o con uno inventado) para ver los errores `401`/`403`.

8. Probar una ruta que no existe, por ejemplo `GET /api/lo-que-sea`, para ver el error `404`.

## Estructura del proyecto

```
proyecto-final/
├── index.js                  # Punto de entrada, configuración de Express
├── package.json
├── .env                       # Variables de entorno (Firebase, JWT, usuario)
├── postman_collection.json    # Colección para probar en Postman
└── src/
    ├── routes/                # Define los endpoints (products.routes.js, auth.routes.js)
    ├── controllers/            # Reciben la petición HTTP y llaman al servicio correspondiente
    ├── services/                # Lógica de negocio y validaciones
    ├── models/                  # Interactúan directamente con Firestore
    ├── middlewares/              # auth.middleware.js (JWT) y errorHandler.middleware.js
    └── config/                    # firebase.config.js (conexión a Firebase)
```

## Cómo se resuelve cada requerimiento

- **Capas separadas**: rutas → controladores → servicios → modelos. Cada uno tiene una sola responsabilidad.
- **Autenticación**: `auth.routes.js` + `auth.controller.js` + `auth.service.js` generan un JWT firmado con `JWT_SECRET`. El `auth.middleware.js` verifica ese token en las rutas de productos.
- **Errores**:
  - `404`: middleware al final de `index.js` para rutas no definidas.
  - `401`: no se envía token en el header `Authorization`.
  - `403`: se envía un token pero es inválido o expiró.
  - `400`: datos faltantes o mal formados en el body (ej: crear producto sin `name`/`price`, o login sin `username`/`password`).
  - `500`: cualquier error inesperado (ej: Firestore no responde) cae en el `errorHandler.middleware.js`.
- **Firebase/Firestore**: `firebase.config.js` inicializa la conexión; `products.model.js` tiene las funciones CRUD contra la colección `products`.
