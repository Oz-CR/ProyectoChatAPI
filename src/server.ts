import dotenv from 'dotenv'
import app from './app'
import { connectDB } from './config/database'

dotenv.config()

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectDB()

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📝 Endpoints disponibles:`);
            console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
            console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
            console.log(`   - GET  http://localhost:${PORT}/api/messages/:userId`);
            console.log(`   - POST http://localhost:${PORT}/api/messages`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer()