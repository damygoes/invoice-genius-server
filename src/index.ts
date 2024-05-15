import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();
const prisma = new PrismaClient();

const app = express();

const port = process.env.PORT || 3000;

app.get("/users", async (req, res) => {
    const users = await prisma.User.findMany();
    res.json(users);
  });


// start the server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}...`);
});
