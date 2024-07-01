import { Router, Request, Response } from "express";
import { prisma } from "./database";
import { z } from "zod";

const router = Router();

// CREATE READ UPDATE DELETE

// GET ALL
router.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.send(users);
});

// GET UNIQUE
router.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const uniqueUser = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (uniqueUser === null) {
    throw new Error("Usuario nao existe");
  }

  res.send(uniqueUser);
});

// POST
router.post("/users", async (req: Request, res: Response) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  });

  const newUser = createUserSchema.parse(req.body);

  const user = await prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    },
  });

  res.status(201).json(user);
});

// UPDATE / PUT
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
  });
  const { name, email, password } = updateUserSchema.parse(req.body);
  const updateUser = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (updateUser === null) {
    throw new Error("Usuario nao existe");
  }

  const updatedUser = await prisma.user.update({
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(password !== undefined && { password }),
    },
    where: { id: parseInt(id) },
  });

  res.status(200).send(updatedUser);
});

// DELETE
router.delete("/users/:id", async (req, res) => {
  const deleteUserSchema = z.object({
    id: z.number(),
  });
  const { id } = deleteUserSchema.parse(req.params);
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (existingUser === null) {
    throw new Error("Usuario nao existe");
  }

  await prisma.user.delete({
    where: {
      id: existingUser.id,
    },
  });

  res.status(200).send({ message: "Usuario deletado" });
});

export default router;
