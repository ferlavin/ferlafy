# Migración de XAMPP a Firebase - Guía de Finalización

## ✅ Lo que ya está hecho

### Backend
- ✅ Instalado `firebase-admin`
- ✅ Creado archivo de configuración Firebase (`backend/config/firebase.js`)
- ✅ Migrado `auth.js` para usar Firebase Authentication
- ✅ Migrado `playlists.js` para usar Firestore
- ✅ Actualizado `package.json` (removidas dependencias de MySQL)
- ✅ Creado archivo `.env.example`

### Frontend
- ✅ Instalado `firebase`
- ✅ Creado archivo de configuración Firebase (`frontend/src/config/firebase.js`)
- ✅ Creado servicio de autenticación (`frontend/src/services/authService.js`)
- ✅ Creado servicio API (`frontend/src/services/apiService.js`)
- ✅ Migrado `Login.jsx` para usar Firebase Auth
- ✅ Migrado `Register.jsx` para usar Firebase Auth
- ✅ Actualizado `App.jsx` para escuchar cambios de autenticación
- ✅ Actualizado `Playlists.jsx` para usar apiService
- ✅ Actualizado `PlaylistDetail.jsx` para usar apiService
- ✅ Actualizado `Home.jsx` para usar apiService
- ✅ Actualizado `Contact.jsx` para usar apiService
- ✅ Actualizado `Messages.jsx` para usar apiService
- ✅ Actualizado `Upload.jsx` para usar apiService

## 🔧 Pasos finales necesarios

### 1. Configurar el Backend

#### A. Obtener las credenciales de Firebase Admin SDK

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "fermusic-eed71"
3. Ve a **Configuración del proyecto** → **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Se descargará un archivo JSON

#### B. Crear archivo `.env` en el backend

En `fermusic/backend/.env`, copia las credenciales descargadas:

```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=fermusic-eed71
FIREBASE_PRIVATE_KEY_ID=<cópia del archivo JSON>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<cópia del archivo JSON, reemplaza saltos de línea con \n>\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=<cópia del archivo JSON>
FIREBASE_CLIENT_ID=<cópia del archivo JSON>
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=<cópia del archivo JSON>
JWT_SECRET=tu_secreto_secreto_aqui_12345
```

### 2. Configurar Firebase Console

#### A. Habilitar Firestore Database

1. Ve a Firebase Console → **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Elige **Modo de producción** (o desarrollo si está en testing)
4. Selecciona tu región (ej: América del Sur - São Paulo)
5. Crea la base de datos

#### B. Habilitar Firebase Authentication

1. Ve a **Authentication** → **Configurar proveedor de signos**
2. Haz clic en **Email/Contraseña**
3. Habilita **Email/Contraseña** y **Email link (passwordless sign-in)**
4. Guarda

#### C. Crear índices de Firestore (si es necesario)

Cuando intentes hacer queries complejas, Firebase te pedirá crear índices. Simplemente haz clic en los links que te proporcionará.

### 3. Ejecutar la aplicación

#### Terminal 1 - Backend
```bash
cd fermusic/backend
npm install
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd fermusic/frontend
npm install
npm run dev
```

### 4. Pruebas finales

- [ ] Crear una nueva cuenta en http://localhost:5173/register
- [ ] Iniciar sesión con esa cuenta
- [ ] Crear una nueva playlist
- [ ] Agregar canciones a la playlist
- [ ] Eliminar canciones de la playlist
- [ ] Eliminar una playlist
- [ ] Enviar un mensaje de contacto
- [ ] Ver los mensajes (en /messages)

## 📋 Estructura de datos en Firestore

### Collection: `usuarios`
```
{
  nombre: string
  email: string
  createdAt: timestamp
  userId: string
}
```

### Collection: `playlists`
```
{
  nombre: string
  descripcion: string
  userId: string (referencia al usuario propietario)
  createdAt: timestamp
  
  subcollection: songs
  {
    cancionId: number
    orden: number
  }
}
```

## 🔐 Notas de seguridad

- Las reglas de Firestore están configuradas en modo de producción (requiere autenticación)
- Los tokens se almacenan en localStorage (considera usar httpOnly cookies en producción)
- El JWT_SECRET debe ser un valor fuerte y único

## 📞 Soporte

Si tienes errores:

1. **Error de credenciales Firebase**: Verifica que el archivo `.env` tiene los valores correctos
2. **Error de conexión al backend**: Asegúrate que el backend está corriendo en puerto 3000
3. **Error de autenticación**: Verifica que Firebase Authentication está habilitada
4. **Error de Firestore**: Verifica que la base de datos está creada y activa

