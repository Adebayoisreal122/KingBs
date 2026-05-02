const Car = require('../models/Car');

exports.getCars = async (req, res, next) => {
  try {
    const {
      search, category, condition, make, transmission, fuelType,
      minPrice, maxPrice, minYear, maxYear, dealType,
      isFeatured, isAvailable, sortBy = '-createdAt',
      page = 1, limit = 12,
    } = req.query;

    const filter = {};

    // Text search across make, model, title, description
    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { bodyColor: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (make) filter.make = { $regex: make, $options: 'i' };
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (dealType) filter.dealType = dealType;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Year range
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = Number(minYear);
      if (maxYear) filter.year.$lte = Number(maxYear);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [cars, total] = await Promise.all([
      Car.find(filter).sort(sortBy).skip(skip).limit(Number(limit)),
      Car.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: cars,
    });
  } catch (error) { next(error); }
};

exports.getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    res.status(200).json({ success: true, data: car });
  } catch (error) { next(error); }
};

exports.createCar = async (req, res, next) => {
  try {
    const car = await Car.create({ ...req.body, createdBy: req.admin._id });
    res.status(201).json({ success: true, data: car });
  } catch (error) { next(error); }
};

exports.updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    res.status(200).json({ success: true, data: car });
  } catch (error) { next(error); }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    res.status(200).json({ success: true, message: 'Car deleted.' });
  } catch (error) { next(error); }
};
