const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email phone');
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new doctor profile
// @route   POST /api/doctors
// @access  Private (Doctor, Admin)
exports.createDoctor = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for published doctor
    const publishedDoctor = await Doctor.findOne({ user: req.user.id });
    if (publishedDoctor && req.user.role !== 'Admin') {
      return res.status(400).json({ success: false, error: 'Doctor already has a profile' });
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Doctor, Admin)
exports.updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    // Make sure user is doctor owner
    if (doctor.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this profile' });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};
