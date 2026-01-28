import mongoose from "mongoose";

export const connectDB = async(): Promise<void> => {
    try {
        const mongoURI = process.env.DATABASE_URL || '';
        
        if (!mongoURI) {
            throw new Error("DATABASE_URL No esta definida en las variables de entorno")
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB Conectado exitosamente!")
        console.log(`Base de datos: ${mongoose.connection.name}`)
    } catch (error) {
        console.error("Error al conectarse a MongoDB: ", error)
        process.exit(1)
    }
}

mongoose.connection.on('connected', () => {
    console.log("Mongoose conectado a MongoDB")
})

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose desconectado de MongoDB")
})

mongoose.connection.on("error", (err) => {
    console.error("Error en la conexion a MongoDB: ", err)
})

process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("Conexion a MongoDB cerrada por terminacion de la app")
    process.exit(0)
})