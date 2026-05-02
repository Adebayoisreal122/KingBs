const Enquiry = require('../models/Enquiry');

exports.submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, type, carId, carTitle } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required.' });
    const enquiry = await Enquiry.create({ name, email, phone, message, type, carId, carTitle });
    res.status(201).json({ success: true, message: 'Enquiry submitted! We will be in touch soon.', data: enquiry });
  } catch (error) { next(error); }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) { next(error); }
};

exports.deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.status(200).json({ success: true, message: 'Enquiry deleted.' });
  } catch (error) { next(error); }
};
