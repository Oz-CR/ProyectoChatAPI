import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import messageRoutes from './routes/messageRoutes'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Encrypted messages app',
        version: '1.0.0',
        status: 'Running'
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});


export default app