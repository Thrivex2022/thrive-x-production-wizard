const express = require('express');
const router = express.Router();
const {
  getOperators,
  getOperatorById,
  createOperator,
  updateOperator,
  deleteOperator,
  getOperatorWorkload,
} = require('../controllers/operatorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getOperators).post(protect, createOperator);
router
  .route('/:id')
  .get(protect, getOperatorById)
  .put(protect, updateOperator)
  .delete(protect, deleteOperator);
router.route('/:id/workload').get(protect, getOperatorWorkload);

module.exports = router;
