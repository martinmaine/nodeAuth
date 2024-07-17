import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
const app = express ()

app.use(express.json())

// 1- ROUTES

// a) Autenticación
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
// b) Uso

console.log("Esto esto se está ejecutando")

export default app