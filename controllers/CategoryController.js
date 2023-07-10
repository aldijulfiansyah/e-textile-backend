import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  const { name, icon } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: name,
        icon: icon,
      },
    });
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const response = await prisma.category.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { name, icon } = req.body;
  try {
    const response = await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        icon: icon,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const response = await prisma.category.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
