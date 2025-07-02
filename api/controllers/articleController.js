import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Krijo kategori artikulli
export const createCategory = async (req, res) => {
  try {
    const category = await prisma.articleCategory.create({
      data: { name: req.body.name }
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

// Krijo artikull
export const createArticle = async (req, res) => {
  try {
    const article = await prisma.article.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        categoryId: req.body.categoryId,
      }
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//get
// // Merr të gjithë artikujt me kategorinë e lidhur
// export const getArticles = async (req, res) => {
//   try {
//     const articles = await prisma.article.findMany({
//       include: { category: true },
//       orderBy: { createdAt: 'desc' }
//     });
//     res.json(articles);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//get me filterkategori
// export const getArticles = async (req, res) => {
//   try {
//     const { categoryId } = req.query;

//     // Nëse ka categoryId, filtro artikujt sipas saj, përndryshe kthe të gjithë
//     const where = categoryId ? { categoryId } : {};

//     const articles = await prisma.article.findMany({
//       where,
//       include: { category: true },
//       orderBy: { createdAt: 'desc' }
//     });

//     res.json(articles);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//get me data dhe kategori
export const getArticles = async (req, res) => {
  try {
    const { categoryId, fromDate } = req.query;

    // Ndërto filter-in
    const filters = {};

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (fromDate) {
      filters.createdAt = {
        gte: new Date(fromDate),
      };
    }

    const articles = await prisma.article.findMany({
      where: filters,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Fshi artikull sipas ID
export const deleteArticle = async (req, res) => {
  try {
    await prisma.article.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Artikulli u fshi me sukses' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, categoryId } = req.body;

  if (!title || !content || !categoryId) {
    return res.status(400).json({ error: "Title, content dhe categoryId janë të detyrueshme." });
  }

  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        image,
        category: { connect: { id: categoryId } }, // lidhje me kategorinë
      },
    });
    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
