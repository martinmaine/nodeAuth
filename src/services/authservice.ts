import { User } from '../models/user.iterface'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'Default-secret'

export const generateToken = (user: User): string => {
    return jwt.sign({
        id: user.id,
        email: user.email,
    }, JWT_SECRET, 
    {
        expiresIn: '1h',
    }
)
}

