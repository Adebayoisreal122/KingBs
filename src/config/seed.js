require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');

const AdminSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: { type: String, default: 'admin' },
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const CarSchema = new mongoose.Schema({
  title: String, make: String, model: String, year: Number,
  price: Number, mileage: Number, condition: String, category: String,
  transmission: String, fuelType: String, bodyColor: String,
  engine: String, horsepower: Number, doors: Number, seats: Number,
  description: String, features: [String], images: [String],
  isFeatured: Boolean, isAvailable: Boolean,
  dealType: String, previousPrice: Number, location: String, vin: String,
}, { timestamps: true });
const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);

const sampleCars = [
  {
    title: '2024 BMW 5 Series xDrive',
    make: 'BMW', model: '5 Series', year: 2024,
    price: 62500, mileage: 0, condition: 'New', category: 'Sedan',
    transmission: 'Automatic', fuelType: 'Petrol',
    bodyColor: 'Alpine White', engine: '3.0L Twin-Turbo I6',
    horsepower: 375, doors: 4, seats: 5,
    description: 'The ultimate executive sedan. Combining athletic performance with luxurious comfort, the 2024 BMW 5 Series redefines what a premium sedan can be.',
    features: ['Panoramic Sunroof', 'Leather Seats', 'Adaptive Cruise Control', 'Heated Seats', 'Wireless Charging', 'Surround View Camera', 'BMW Live Cockpit Professional', 'Harman Kardon Audio'],
    images: [], isFeatured: true, isAvailable: true,
    dealType: 'New Arrival', location: 'Motor City, USA',
  },
  {
    title: '2023 Mercedes-Benz GLE 450',
    make: 'Mercedes', model: 'GLE 450', year: 2023,
    price: 74900, previousPrice: 79900, mileage: 8500, condition: 'Used', category: 'SUV',
    transmission: 'Automatic', fuelType: 'Hybrid',
    bodyColor: 'Obsidian Black', engine: '3.0L I6 EQ Boost',
    horsepower: 362, doors: 4, seats: 7,
    description: 'A stunning SUV with hybrid efficiency and Mercedes-Benz luxury. Low mileage, single owner, full service history.',
    features: ['MBUX Infotainment', 'Air Suspension', 'Burmester Audio', 'Driver Assistance Package', 'Third Row Seating', 'Heated & Ventilated Seats', 'Head-Up Display'],
    images: [], isFeatured: true, isAvailable: true,
    dealType: 'Price Drop', location: 'Motor City, USA',
  },
  {
    title: '2024 Tesla Model 3 Performance',
    make: 'Tesla', model: 'Model 3', year: 2024,
    price: 48990, mileage: 0, condition: 'New', category: 'Electric',
    transmission: 'Automatic', fuelType: 'Electric',
    bodyColor: 'Deep Blue Metallic', engine: 'Dual Motor AWD',
    horsepower: 510, doors: 4, seats: 5,
    description: 'Experience the future of performance. 0-60 in 3.1 seconds with over 315 miles of range. The Model 3 Performance is in a class of its own.',
    features: ['Autopilot', '15" Touchscreen', 'Over-the-Air Updates', 'Supercharger Access', 'Glass Roof', 'Premium Audio System', 'Mobile App Control'],
    images: [], isFeatured: true, isAvailable: true,
    dealType: 'New Arrival', location: 'Motor City, USA',
  },
  {
    title: '2022 Ford F-150 Raptor',
    make: 'Ford', model: 'F-150 Raptor', year: 2022,
    price: 68500, mileage: 22000, condition: 'Used', category: 'Truck',
    transmission: 'Automatic', fuelType: 'Petrol',
    bodyColor: 'Velocity Blue', engine: '3.5L EcoBoost V6',
    horsepower: 450, doors: 4, seats: 6,
    description: 'The most capable F-150 ever. Off-road ready with on-road refinement. Fox Racing Shox, 37" tires, and the power to conquer anything.',
    features: ['Fox Racing Shox', '37" All-Terrain Tires', 'Trail Control', 'Pro Trailer Backup Assist', 'B&O Sound System', 'Heated Seats', '360-Degree Camera'],
    images: [], isFeatured: true, isAvailable: true,
    dealType: 'Hot Deal', location: 'Motor City, USA',
  },
  {
    title: '2023 Porsche 911 Carrera S',
    make: 'Porsche', model: '911 Carrera S', year: 2023,
    price: 134500, mileage: 3200, condition: 'Certified Pre-Owned', category: 'Coupe',
    transmission: 'Automatic', fuelType: 'Petrol',
    bodyColor: 'GT Silver Metallic', engine: '3.0L Twin-Turbo Flat-6',
    horsepower: 443, doors: 2, seats: 4,
    description: 'The legend continues. A barely-used 992-generation 911 Carrera S with every option. Porsche Certified Pre-Owned with full warranty.',
    features: ['PDK Transmission', 'Sport Chrono Package', 'PASM Sport Suspension', 'Porsche Ceramic Composite Brakes', 'Bose Audio', 'Sport Exhaust', 'Rear-Axle Steering'],
    images: [], isFeatured: true, isAvailable: true,
    dealType: '', location: 'Motor City, USA',
  },
  {
    title: '2024 Toyota Land Cruiser',
    make: 'Toyota', model: 'Land Cruiser', year: 2024,
    price: 56900, mileage: 0, condition: 'New', category: 'SUV',
    transmission: 'Automatic', fuelType: 'Hybrid',
    bodyColor: 'Magnetic Gray', engine: '2.4L Twin-Turbo Hybrid',
    horsepower: 326, doors: 4, seats: 8,
    description: 'A legendary nameplate reborn. The 2024 Land Cruiser combines legendary off-road capability with modern hybrid efficiency.',
    features: ['Multi-Terrain Select', 'Crawl Control', 'Apple CarPlay', 'JBL Premium Audio', 'Heated 3rd Row', 'Digital Rearview Mirror', 'E-KDSS'],
    images: [], isFeatured: false, isAvailable: true,
    dealType: 'New Arrival', location: 'Motor City, USA',
  },
  {
    title: '2021 Audi Q7 S-Line',
    make: 'Audi', model: 'Q7', year: 2021,
    price: 52000, previousPrice: 58000, mileage: 31000, condition: 'Used', category: 'SUV',
    transmission: 'Automatic', fuelType: 'Petrol',
    bodyColor: 'Navarra Blue', engine: '3.0L TFSI V6',
    horsepower: 335, doors: 4, seats: 7,
    description: 'A premium 3-row SUV with S-Line sport package. One owner, full Audi service history, no accidents.',
    features: ['S-Line Sport Package', 'Virtual Cockpit', 'Bang & Olufsen Audio', 'Quattro AWD', 'Air Suspension', 'Adaptive Cruise Control', 'Night Vision Assist'],
    images: [], isFeatured: false, isAvailable: true,
    dealType: 'Price Drop', location: 'Motor City, USA',
  },
  {
    title: '2023 Honda Civic Type R',
    make: 'Honda', model: 'Civic Type R', year: 2023,
    price: 42995, mileage: 5400, condition: 'Used', category: 'Coupe',
    transmission: 'Manual', fuelType: 'Petrol',
    bodyColor: 'Championship White', engine: '2.0L VTEC Turbo',
    horsepower: 315, doors: 4, seats: 5,
    description: 'The fastest front-wheel-drive car ever at the Nurburgring. Low mileage, perfect condition, six-speed manual.',
    features: ['6-Speed Manual', 'Brembo Brakes', 'Adaptive Dampers', 'Type R Exclusive Mode', 'HESD Electronic Steering Damper', 'Rev Match Control', 'Honda Sensing'],
    images: [], isFeatured: false, isAvailable: true,
    dealType: 'Hot Deal', location: 'Motor City, USA',
  },
];

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting AutoElite database seed...\n');

  await Promise.all([Admin.deleteMany({}), Car.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // Create admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await Admin.create({
    name: process.env.ADMIN_NAME || 'AutoElite Admin',
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
  });
  console.log(`👤 Admin created: ${process.env.ADMIN_EMAIL}`);

  // Seed cars
  await Car.insertMany(sampleCars);
  console.log(`🚗 ${sampleCars.length} sample cars seeded`);

  console.log('\n✅ Seed complete!\n');
  console.log('──────────────────────────────────');
  console.log(`Admin Email:    ${process.env.ADMIN_EMAIL}`);
  console.log(`Admin Password: ${process.env.ADMIN_PASSWORD}`);
  console.log(`Admin Panel:    http://localhost:5173/admin/login`);
  console.log('──────────────────────────────────\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
