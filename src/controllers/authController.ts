import { Request, Response } from "express"
import { hashPassword, comparePasswords } from "../services/passwordservices";
import prisma from '../models/user'
import { generateToken } from "../services/authservice";
import jwt from 'jsonwebtoken';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidatedTokens: Set<string> = new Set(); // Esto debería almacenarse en una base de datos en producción

// REGISTRO
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' });
            return;
        }

        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'El email no tiene un formato válido' });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = generateToken(user);
        res.status(201).json({ token });

    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' });
        }
        console.log(error);
        res.status(500).json({ error: 'Hubo un error en el registro' });
    }
};

//LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' });
            return;
        }

        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'El email no tiene un formato válido' });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' });
            return;
        }

        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseñas no coinciden' });
            return;
        }

        const token = generateToken(user);
        res.status(200).json({ token });

    } catch (error: any) {
        console.log('Error: ', error);
        res.status(500).json({ error: 'Hubo un error en el login' });
    }
};

//MODIFICAR CONTRASEÑA
export const modifyPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        if (!email || !oldPassword || !newPassword) {
            res.status(400).json({ message: 'Todos los campos son obligatorios' });
            return;
        }

        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const passwordMatch = await comparePasswords(oldPassword, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'La contraseña antigua es incorrecta' });
            return;
        }

        const hashedPassword = await hashPassword(newPassword);
        await prisma.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error: any) {
        console.log('Error: ', error);
        res.status(500).json({ error: 'Hubo un error al actualizar la contraseña' });
    }
};

//ELIMINAR USUARIO
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400).json({ message: 'El email y el password son obligatorios' });
            return;
        }

        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseñas no coinciden' });
            return;
        }

        await prisma.delete({ where: { email } });

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });

    } catch (error: any) {
        console.log('Error: ', error);
        res.status(500).json({ error: 'Hubo un error al eliminar el usuario' });
    }
};
