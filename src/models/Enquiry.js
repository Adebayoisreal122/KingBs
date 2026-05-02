const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  carId: { type: String, default: '' },
  carTitle: { type: String, default: 'General Enquiry', trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' },
  type: { type: String, enum: ['General', 'Test Drive', 'Finance', 'Trade-in'], default: 'General' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

enquirySchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
