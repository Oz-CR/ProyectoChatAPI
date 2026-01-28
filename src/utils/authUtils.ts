import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<Boolean> => {
    return await bcrypt.compare(hashedPassword, password)
}

export const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || '06ca9cd0eb1585401bbf0b7d4045b26dcd8281890fcb6c0642ee333b'
    return jwt.sign({userId}, secret, {expiresIn: '24h'})
}

export const verifyToken = (token: string): any => {
    try {
        const secret = process.env.JWT_SECRET || '06ca9cd0eb1585401bbf0b7d4045b26dcd8281890fcb6c0642ee333b'
        return jwt.verify(token, secret)
    } catch (error) {
        return null;
    }
}