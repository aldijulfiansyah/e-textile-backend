import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    } else {
      const user = await prisma.users.findMany({
        where: {
          refresh_token: refreshToken,
        },
      });

      if (!user || user.length === 0) {
        return res.sendStatus(403);
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }

        const userId = user[0].id;
        const username = user[0].username;
        const email = user[0].email;
        const jwtToken = jwt.sign({ userId, username, email }, process.env.JWT_SECRET, {
          expiresIn: '15s',
        });

        res.json({ jwtToken });
      });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
