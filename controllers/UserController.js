import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const upload = multer().none();
const prisma = new PrismaClient();



export const getUsers = async (req, res) => {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });
  
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };





export const register = async (req, res) => {
    
  
  
  try {
      await upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: 'Terjadi kesalahan saat mengunggah file' });
        }
      const { username, email, password, confPassword } = req.body;

      if (!username || !email || !password || !confPassword) {
        return res.status(400).json({ error: 'Please insert the form completely' });
      }

      if (password !== confPassword) {
        return res.status(400).json({ error: 'Password and confirmation password does not match' });
      }
  
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email is already registered' });
      }
  
      const hashedPassword = await argon2.hash(password);
  
      const newUser = await prisma.users.create({
        data: {
          username:username,
          email: email,
          password: hashedPassword
        }
      });
  
      res.status(201).json({ message: 'User created successfully', newUser });
    });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };
  


  export const login = async (req, res) => {
    try {
      await upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: 'Terjadi kesalahan saat mengunggah file' });
        }
  
        const { email, password } = req.body;
  
        const user = await prisma.users.findUnique({ where: { email: email } });
  
        
        if (!user || !(await argon2.verify(user.password, password))) {
          return res.status(401).json({ error: 'Email atau password salah' });
        }
  
        const jwt_token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: '30s',
        });
        const refresh_token = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '1d',
        });
  
        await prisma.users.update({
          where: { id: user.id },
          data: { refresh_token },
        });
  
        res.cookie('refreshToken', refresh_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, 
        });
  
        res.status(200).json({ jwt_token });
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat login' });
    }
  };
  

  export const logout = async (req, res) => {
    try {
      res.clearCookie('refreshToken'); 
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error during logout:', error);
      res.sendStatus(500);
    }
  };
  