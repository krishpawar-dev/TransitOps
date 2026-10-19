const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/transitops');
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await Maintenance.deleteMany();
    await FuelLog.deleteMany();
    await Expense.deleteMany();

    console.log('🧹 Existing data cleared.');

    // 1. Users
    const users = await User.create([
      { name: 'Alex Johnson', email: 'admin@transitops.com', password: 'password123', role: 'Fleet Manager' },
      { name: 'David Miller', email: 'dispatcher@transitops.com', password: 'password123', role: 'Dispatcher' },
      { name: 'Sarah Connor', email: 'safety@transitops.com', password: 'password123', role: 'Safety Officer' },
      { name: 'Robert Vance', email: 'finance@transitops.com', password: 'password123', role: 'Financial Analyst' },
    ]);
    console.log(`👤 Created ${users.length} users.`);

    // 2. Drivers
    const drivers = await Driver.create([
      { name: 'Rajesh Kumar', licenseNumber: 'KA0120180004561', licenseCategory: 'HMV', licenseExpiry: new Date('2027-10-15'), phone: '+91 98765 43210', safetyScore: 94, status: 'Available' },
      { name: 'Suresh Verma', licenseNumber: 'KA0220190008923', licenseCategory: 'HMV', licenseExpiry: new Date('2026-11-20'), phone: '+91 98123 45678', safetyScore: 88, status: 'On Trip' },
      { name: 'Amit Singh', licenseNumber: 'MH1220170001234', licenseCategory: 'HTV', licenseExpiry: new Date('2027-05-10'), phone: '+91 97654 32109', safetyScore: 79, status: 'Available' },
      { name: 'Vikram Patel', licenseNumber: 'DL0420200005678', licenseCategory: 'LMV', licenseExpiry: new Date('2026-08-01'), phone: '+91 96543 21098', safetyScore: 91, status: 'On Trip' },
      { name: 'Manoj Sharma', licenseNumber: 'UP1420160009012', licenseCategory: 'HMV', licenseExpiry: new Date('2026-07-25'), phone: '+91 95432 10987', safetyScore: 65, status: 'Suspended' },
    ]);
    console.log(`👨‍✈️ Created ${drivers.length} drivers.`);

    // 3. Vehicles
    const vehicles = await Vehicle.create([
      { registrationNumber: 'KA-01-AB-1234', vehicleName: 'Tata Ace Gold', model: 'Ace Gold 2022', vehicleType: 'Mini Truck', maxLoadCapacity: 1.5, odometer: 45200, acquisitionCost: 650000, status: 'Available', currentDriver: null },
      { registrationNumber: 'KA-02-CD-5678', vehicleName: 'Ashok Leyland Dost', model: 'Dost+ 2023', vehicleType: 'Light Truck', maxLoadCapacity: 2.8, odometer: 62100, acquisitionCost: 850000, status: 'On Trip', currentDriver: drivers[1]._id },
      { registrationNumber: 'MH-12-EF-9012', vehicleName: 'Mahindra Bolero Maxi', model: 'Maxi Truck 2021', vehicleType: 'Pickup', maxLoadCapacity: 2.0, odometer: 88400, acquisitionCost: 720000, status: 'In Shop', currentDriver: null },
      { registrationNumber: 'DL-04-GH-3456', vehicleName: 'BharatBenz 1217C', model: '1217C 2023', vehicleType: 'Medium Truck', maxLoadCapacity: 10.0, odometer: 34100, acquisitionCost: 2400000, status: 'On Trip', currentDriver: drivers[3]._id },
      { registrationNumber: 'UP-14-IJ-7890', vehicleName: 'Eicher Pro 2049', model: 'Pro 2049 2020', vehicleType: 'Light Truck', maxLoadCapacity: 3.5, odometer: 112000, acquisitionCost: 1100000, status: 'Retired', currentDriver: null },
    ]);
    console.log(`🚛 Created ${vehicles.length} vehicles.`);

    // 4. Maintenance
    const maintenance = await Maintenance.create([
      { vehicle: vehicles[2]._id, title: 'Engine Overhaul & Oil Change', description: 'Scheduled major servicing and oil change', cost: 14500, priority: 'High', status: 'In Progress', technician: 'Service Center A', createdBy: users[0]._id },
      { vehicle: vehicles[0]._id, title: 'Brake Pad Replacement', description: 'Front brake pads worn out', cost: 3800, priority: 'Medium', status: 'Closed', closedAt: new Date(), technician: 'QuickAuto Repairs', createdBy: users[0]._id },
    ]);
    console.log(`🔧 Created ${maintenance.length} maintenance records.`);

    // 5. Trips
    const trips = await Trip.create([
      { source: 'Bengaluru', destination: 'Mysuru', vehicle: vehicles[1]._id, driver: drivers[1]._id, cargoWeight: 2.1, cargoDescription: 'Electronics', plannedDistance: 145, actualDistance: 148, fuelConsumed: 18, fuelCost: 1710, revenue: 8500, status: 'In Transit', dispatchDate: new Date(), createdBy: users[1]._id },
      { source: 'Mumbai', destination: 'Pune', vehicle: vehicles[3]._id, driver: drivers[3]._id, cargoWeight: 8.5, cargoDescription: 'Industrial Spares', plannedDistance: 150, actualDistance: 152, fuelConsumed: 38, fuelCost: 3610, revenue: 22000, status: 'In Transit', dispatchDate: new Date(), createdBy: users[1]._id },
      { source: 'Chennai', destination: 'Bengaluru', vehicle: vehicles[0]._id, driver: drivers[0]._id, cargoWeight: 1.2, cargoDescription: 'Textiles', plannedDistance: 345, actualDistance: 345, fuelConsumed: 32, fuelCost: 3040, revenue: 16000, status: 'Completed', dispatchDate: new Date(Date.now() - 2 * 86400000), completionDate: new Date(Date.now() - 86400000), createdBy: users[1]._id },
    ]);
    console.log(`🛣️ Created ${trips.length} trips.`);

    // 6. Fuel Logs
    await FuelLog.create([
      { vehicle: vehicles[0]._id, liters: 45, cost: 4275, odometer: 45200, distanceSinceLastFill: 420, fuelStation: 'HPCL Bengaluru Main', date: new Date(), loggedBy: users[1]._id },
      { vehicle: vehicles[1]._id, liters: 60, cost: 5700, odometer: 62100, distanceSinceLastFill: 510, fuelStation: 'IndianOil Mysuru Road', date: new Date(), loggedBy: users[1]._id },
    ]);
    console.log('⛽ Created fuel logs.');

    // 7. Expenses
    await Expense.create([
      { vehicle: vehicles[0]._id, category: 'Fuel', amount: 4275, description: 'Fuel refill', status: 'Approved', loggedBy: users[1]._id },
      { vehicle: vehicles[2]._id, category: 'Maintenance', amount: 14500, description: 'Engine service', status: 'Approved', loggedBy: users[0]._id },
      { vehicle: vehicles[1]._id, category: 'Toll', amount: 650, description: 'Highway Toll charges', status: 'Approved', loggedBy: users[1]._id },
    ]);
    console.log('💰 Created expenses.');

    console.log('🎉 Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
