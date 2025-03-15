const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivitiesByOrder,
  getActivitiesByOperator,
  getActivityById,
  assignActivity,
  updateActivityStatus,
  updateActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getActivities);
router.route('/order/:orderId').get(protect, getActivitiesByOrder);
router.route('/operator/:operatorId').get(protect, getActivitiesByOperator);
router.route('/:id').get(protect, getActivityById).put(protect, updateActivity);
router.route('/:id/assign').put(protect, assignActivity);
router.route('/:id/status').put(protect, updateActivityStatus);

module.exports = router;
