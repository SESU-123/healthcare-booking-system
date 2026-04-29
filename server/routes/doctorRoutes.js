const express = require('express');
const { getDoctors, getDoctor, createDoctor, updateDoctor } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('Doctor', 'Admin'), createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(protect, authorize('Doctor', 'Admin'), updateDoctor);

module.exports = router;
