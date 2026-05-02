const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  previousPrice: { type: Number },
  mileage: { type: Number, default: 0, min: 0 },
  condition: { type: String, enum: ['New', 'Used', 'Certified Pre-Owned'], default: 'Used' },
  category: {
    type: String,
    enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Van', 'Electric', 'Luxury'],
    required: true,
  },
  transmission: { type: String, enum: ['Automatic', 'Manual', 'CVT'], default: 'Automatic' },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'], default: 'Petrol' },
  bodyColor: { type: String, trim: true, default: '' },
  engine: { type: String, trim: true, default: '' },
  horsepower: { type: Number, default: 0 },
  doors: { type: Number, default: 4 },
  seats: { type: Number, default: 5 },
  description: { type: String, trim: true, default: '' },
  features: [{ type: String }],
  images: [{ type: String }], // base64 strings
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  dealType: { type: String, enum: ['Hot Deal', 'New Arrival', 'Price Drop', ''], default: '' },
  location: { type: String, trim: true, default: '' },
  vin: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

// Indexes for filtering
carSchema.index({ condition: 1, category: 1, price: 1 });
carSchema.index({ isFeatured: 1, isAvailable: 1 });
carSchema.index({ dealType: 1 });
carSchema.index({ make: 1, model: 1, year: -1 });

module.exports = mongoose.model('Car', carSchema);
