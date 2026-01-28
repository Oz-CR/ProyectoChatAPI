import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Invalid or not sent token'
            })
            return
        }

        const token = authHeader.split(' ')[1]

        const decoded = verifyToken(token)

        if (!decoded) {
            res.status(401).json({
                error: 'Failed to validate token'
            })
            return
        }

        req.userId = decoded.userId

        next()
    } catch(error) {
        res.status(401).json({
            error: 'Unauthorized'
        })
    }
}