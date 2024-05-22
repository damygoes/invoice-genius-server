import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { createNewUserInDatabase } from "../entities/user/user.actions";
import { redisClient } from "../services/redis";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET!;
const register = async (req: Request, res: Response) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await createNewUserInDatabase({
      ...req.body,
      password: hashedPassword,
    });
    if (!newUser) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json({
      message: "User created successfully",
      userId: newUser.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  console.log("login req:", req);
};

// const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const existingUser = await getUserWithEmail(email);
//     if (existingUser && existingUser !== null) {
//       const comparePassword = await bcrypt.compare(
//         password,
//         existingUser.password
//       );
//       if (comparePassword) {
//         // Generate JWT token

//         const tokenPayload = {
//           id: existingUser.id,
//           email: existingUser.email,
//         };
//         const token = jwt.sign(tokenPayload, JWT_SECRET_KEY, {
//           expiresIn: '1h',
//         });
//         // Store token in Redis
//         redisClient.set(tokenPayload.id, token);
//         return res.json({ message: 'Login successful', token });
//       } else {
//         return res.status(400).json({ error: 'Wrong password' });
//       }
//     } else {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error logging in: ', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const logout = async (req: Request, res: Response) => {
  const { id, email } = req.body;
  try {
    const result = await redisClient.del(id);
    if (result === 1) {
      return res.json({ message: "Logout successful" });
    } else {
      return res.status(400).json({ error: "Logout failed" });
    }
  } catch (error) {
    console.error("Error logging out: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { login, logout, register };
