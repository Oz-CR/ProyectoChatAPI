import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            res.status(400).json({
                error: 'Fields username and password are required'
            })
            return
        }

        if (password.length < 6) {
            res.status(400).json({
                error: 'Field password must have more than 6 characters'
            })
            return
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            res.status(400).json({
                error: 'Already existing user'
            })
            return
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            username,
            password: hashedPassword
        })

        const token = await generateToken(user._id.toString())

        res.status(200).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                createdAt: user.createdAt
            },
            token: token
        })
    } catch (error) {
        console.error('Error registering user: ', error)
        res.status(400).json({
            error: 'Error registering user'
        })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                error: 'Username y password son requeridos'
            });
            return;
        }

        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({
                error: 'Credenciales inválidas'
            });
            return;
        }

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                error: 'Credenciales inválidas'
            });
            return;
        }

        // Generar token
        const token = generateToken(user._id.toString());

        res.json({
            message: 'Login exitoso',
            user: {
                id: user._id,
                username: user.username
            },
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error al iniciar sesión'
        });
    }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .select('_id username createdAt')
            .sort({ username: 1 });

        res.json({
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                createdAt: user.createdAt
            }))
        });
    } catch (error) {
        console.error('Error en listUsers:', error);
        res.status(500).json({
            error: 'Error al listar usuarios'
        });
    }
};