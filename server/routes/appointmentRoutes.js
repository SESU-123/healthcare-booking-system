const express = require('express');
const { getAppointments, createAppointment, updateAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .put(updateAppointment);

module.exports = router;
