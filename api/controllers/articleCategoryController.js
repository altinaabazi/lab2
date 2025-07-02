import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Krijo një kategori të re
export const createCategory = async (req, res) => {
  try {
    const category = await prisma.articleCategory.create({
      data: { name: req.body.name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Merr të gjitha kategoritë
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.articleCategory.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await prisma.articleCategory.update({
      where: { id },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Fshi kategori me id
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Fshi artikujt që i përkasin kësaj kategorie
    await prisma.article.deleteMany({
      where: { categoryId: id },
    });

    // Pastaj fshi kategorinë
    await prisma.articleCategory.delete({
      where: { id },
    });

    res.json({ message: 'Kategoria dhe artikujt e saj u fshinë me sukses' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
