const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'Admin') {
      query = Appointment.find().populate({ path: 'doctor', populate: { path: 'user' } }).populate('patient');
    } else if (req.user.role === 'Doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      query = Appointment.find({ doctor: doctor._id }).populate('patient');
    } else {
      query = Appointment.find({ patient: req.user.id }).populate({ path: 'doctor', populate: { path: 'user' } });
    }
    const appointments = await query;
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.createAppointment = async (req, res, next) => {
  try {
    req.body.patient = req.user.id;
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, error: 'Appointment not found' });

    // Make sure user is appointment owner or doctor
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'Doctor' && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this appointment' });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};
