import express from "express";
import {register, getUsers, login, logout} from "../controllers/UserController.js"
import verifyToken from "../middleware/Auth.js"
import { refreshToken } from "../controllers/RefreshToken.js";
const router = express.Router();

router.post('/register',  register)
router.get('/users',verifyToken,  getUsers)
router.post('/login',  login)
router.delete('/logout',  logout)
router.get('/token',  refreshToken)

export default router