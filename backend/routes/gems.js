const express = require('express');
const router = express.Router();
const {
  getGems,
  getGemById,
  getGemsByType,
  createGem,
  updateGem,
  deleteGem,
  getDashboardStats
} = require('../controllers/gemController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGems);
router.get('/type/:gemType', getGemsByType);
router.get('/admin/stats', auth, getDashboardStats);
router.get('/:id', getGemById);
router.post('/', auth, upload.array('images', 5), createGem);
router.put('/:id', auth, upload.array('images', 5), updateGem);
router.delete('/:id', auth, deleteGem);

module.exports = router;
