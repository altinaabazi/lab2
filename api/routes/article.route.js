import express from 'express';
import {
  createCategory,
  getCategories,
  createArticle,
  getArticles,
  deleteArticle,
  updateArticle
} from '../controllers/articleController.js';

const router = express.Router();

// Rrugë për kategoritë
router.post('/categories', createCategory);
router.get('/categories', getCategories);

// Rrugë për artikujt
router.post('/', createArticle);
router.get('/', getArticles);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);


export default router;
