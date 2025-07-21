import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET 


export function generateToken (user ) {
    return jwt.sign({
        userId : user.id , role : user.role
    },
    JWT_SECRET, {
        expiresIn : '1d'
    }
)
}



export function verifyToken (token) {
    return jwt.verify(token , JWT_SECRET)
}