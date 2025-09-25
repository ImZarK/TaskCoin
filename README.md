# TaskCoin

TaskCoin es una app web full-stack para gestionar tareas y controlar finanzas personales (movimientos y deudas).  
Proyecto orientado a práctica y aprendizaje: frontend en React y backend en Node.js/Express con MongoDB.

---

## Qué hace
- Registro e inicio de sesión (JWT).  
- CRUD de tareas (crear, listar, editar, borrar).  
- Registro de movimientos financieros: ingresos y gastos.  
- Gestión de deudas (crear, listar, actualizar, marcar como pagada).  
- Separación frontend / backend para trabajar con APIs REST.

---

## Tecnologías
**Backend**
- Node.js + Express  
- MongoDB (Mongoose)  
- JWT para autenticación  
- bcryptjs para hash de contraseñas  
- Middlewares: cors, express-validator, express-mongo-sanitize, express-rate-limit

**Frontend**
- React (create-react-app / react-scripts)  
- react-router-dom  
- Axios para llamadas a la API  
- CSS para estilos

---

## Estructura del repo
TaskCoin/
├─ backend/ # API REST (Express + Mongoose)
├─ frontend/ # Cliente React
└─ README.md

---

## Cómo levantarlo en local (lo mínimo)
1. Clona el repo:

git clone https://github.com/ImZarK/TaskCoin.git
cd TaskCoin
Backend:

--

cd backend
npm install
# crear backend/.env con las variables (ver ejemplo más abajo)
npm run dev   # arranca con nodemon
Frontend:

--

cd ../frontend
npm install
npm start
Por defecto el frontend corre en http://localhost:3000 y el backend en http://localhost:5000 (si no cambias las variables).

Endpoints principales
Todos los endpoints que requieren usuario autenticado esperan el header: Authorization: Bearer <token>

Autenticación

POST /api/auth/register
Payload: { username, email, password }

POST /api/auth/login
Payload: { email, password }
Respuesta: { token, user }

Usuarios

Rutas en /api/users (perfil / actualización)

Tareas

GET /api/tasks — listar tareas del usuario

POST /api/tasks — crear { title, description }

PUT /api/tasks/:id — actualizar

DELETE /api/tasks/:id — eliminar

Finanzas

GET /api/finance — listar movimientos

POST /api/finance — crear { amount, type, description }

PUT /api/finance/:id — actualizar

DELETE /api/finance/:id — eliminar

Deudas

GET /api/debt — listar deudas

POST /api/debt — crear { debtor, creditor, amount, description }

PUT /api/debt/:id — actualizar / marcar pagada

(Para payloads exactos y validaciones revisa backend/routes/*.js y backend/controllers/*.js.)

Scripts útiles
Backend (dentro de /backend)

npm run dev — iniciar en modo desarrollo (nodemon)

npm start — iniciar con node index.js

Frontend (dentro de /frontend)

npm start — iniciar app React

npm run build — build para producción

Estado / notas
Proyecto funcional como ejercicio full-stack.

Autor / contacto
Kevin Herrera — herrerakevin83@gmail.com
