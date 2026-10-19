/* ===================================================
   Static Data – TransitOps
   All dummy data for the frontend application
   =================================================== */

// ──────────────────────────────────────────────────
// VEHICLES
// ──────────────────────────────────────────────────
export const vehicles = [
  { id: 1, reg: 'KA-01-AB-1234', name: 'Tata Ace Gold', model: 'Ace Gold 2022', type: 'Mini Truck', capacity: '1T', status: 'Active', odometer: 45200, fuel: 'Diesel', lastService: '2025-06-10', driver: 'Ravi Kumar' },
  { id: 2, reg: 'MH-12-CD-5678', name: 'Ashok Leyland Dost', model: 'Dost+ 2021', type: 'Light Truck', capacity: '1.25T', status: 'Active', odometer: 78400, fuel: 'Diesel', lastService: '2025-05-20', driver: 'Suresh Patel' },
  { id: 3, reg: 'DL-08-EF-9012', name: 'Mahindra Bolero', model: 'Bolero Pik-Up 2023', type: 'Pickup', capacity: '1.5T', status: 'Maintenance', odometer: 32100, fuel: 'Diesel', lastService: '2025-07-01', driver: 'Amit Singh' },
  { id: 4, reg: 'TN-22-GH-3456', name: 'Eicher Pro 2049', model: 'Pro 2049 2022', type: 'Medium Truck', capacity: '5T', status: 'Active', odometer: 112000, fuel: 'Diesel', lastService: '2025-04-15', driver: 'Karthik R' },
  { id: 5, reg: 'GJ-05-IJ-7890', name: 'Tata 407', model: '407 Gold SFC 2021', type: 'Light Truck', capacity: '3.5T', status: 'Idle', odometer: 89500, fuel: 'Diesel', lastService: '2025-06-01', driver: 'Mehul Shah' },
  { id: 6, reg: 'RJ-14-KL-2345', name: 'Bharat Benz 1415', model: '1415R 2020', type: 'Heavy Truck', capacity: '15T', status: 'Active', odometer: 205000, fuel: 'Diesel', lastService: '2025-03-22', driver: 'Raman Sharma' },
  { id: 7, reg: 'UP-80-MN-6789', name: 'Leyland Lynx', model: 'Lynx 1215 2023', type: 'Truck', capacity: '12T', status: 'Active', odometer: 56700, fuel: 'Diesel', lastService: '2025-07-05', driver: 'Pradeep Yadav' },
  { id: 8, reg: 'WB-20-OP-1234', name: 'Tata Prima 4028', model: 'Prima 4028.S 2022', type: 'Heavy Truck', capacity: '28T', status: 'Idle', odometer: 178900, fuel: 'Diesel', lastService: '2025-05-12', driver: 'Biplab Das' },
  { id: 9, reg: 'AP-29-QR-5678', name: 'Force Traveller', model: 'Traveller 3700 2021', type: 'Van', capacity: '2T', status: 'Active', odometer: 67300, fuel: 'Diesel', lastService: '2025-06-28', driver: 'Nagaraju K' },
  { id: 10, reg: 'TS-09-ST-9012', name: 'Mahindra Supro', model: 'Supro Profit Truck 2023', type: 'Mini Truck', capacity: '0.75T', status: 'Maintenance', odometer: 23400, fuel: 'Petrol', lastService: '2025-07-08', driver: 'Venkat R' },
  { id: 11, reg: 'KL-07-UV-3456', name: 'Eicher Pro 6025', model: 'Pro 6025 2022', type: 'Heavy Truck', capacity: '25T', status: 'Active', odometer: 145600, fuel: 'Diesel', lastService: '2025-04-30', driver: 'Sreekumar M' },
  { id: 12, reg: 'PB-10-WX-7890', name: 'Tata Signa 4923', model: 'Signa 4923.S 2021', type: 'Heavy Truck', capacity: '23T', status: 'Active', odometer: 234000, fuel: 'Diesel', lastService: '2025-02-18', driver: 'Gurpreet Singh' },
];

// ──────────────────────────────────────────────────
// DRIVERS
// ──────────────────────────────────────────────────
export const drivers = [
  { id: 1, name: 'Ravi Kumar', license: 'KA0120234567', category: 'HMV', expiry: '2027-08-15', phone: '+91 98765 43210', status: 'On Duty', safetyScore: 94, trips: 142, experience: '8 years', address: 'Bangalore, KA' },
  { id: 2, name: 'Suresh Patel', license: 'MH0220215432', category: 'LMV', expiry: '2026-03-22', phone: '+91 87654 32109', status: 'Available', safetyScore: 88, trips: 98, experience: '5 years', address: 'Pune, MH' },
  { id: 3, name: 'Amit Singh', license: 'DL0820229876', category: 'HMV', expiry: '2028-11-30', phone: '+91 76543 21098', status: 'On Duty', safetyScore: 76, trips: 210, experience: '12 years', address: 'Delhi, DL' },
  { id: 4, name: 'Karthik R', license: 'TN2220231234', category: 'HMV', expiry: '2027-06-18', phone: '+91 65432 10987', status: 'Available', safetyScore: 92, trips: 175, experience: '9 years', address: 'Chennai, TN' },
  { id: 5, name: 'Mehul Shah', license: 'GJ0520205678', category: 'LMV', expiry: '2025-12-05', phone: '+91 54321 09876', status: 'Leave', safetyScore: 85, trips: 67, experience: '3 years', address: 'Ahmedabad, GJ' },
  { id: 6, name: 'Raman Sharma', license: 'RJ1420199012', category: 'HMV', expiry: '2026-09-14', phone: '+91 43210 98765', status: 'On Duty', safetyScore: 90, trips: 312, experience: '15 years', address: 'Jaipur, RJ' },
  { id: 7, name: 'Pradeep Yadav', license: 'UP8020213456', category: 'HMV', expiry: '2027-02-28', phone: '+91 32109 87654', status: 'On Duty', safetyScore: 81, trips: 189, experience: '7 years', address: 'Lucknow, UP' },
  { id: 8, name: 'Biplab Das', license: 'WB2020207890', category: 'HMV', expiry: '2026-07-19', phone: '+91 21098 76543', status: 'Available', safetyScore: 79, trips: 234, experience: '10 years', address: 'Kolkata, WB' },
  { id: 9, name: 'Nagaraju K', license: 'AP2920221234', category: 'LMV', expiry: '2027-04-11', phone: '+91 10987 65432', status: 'On Duty', safetyScore: 96, trips: 88, experience: '4 years', address: 'Hyderabad, AP' },
  { id: 10, name: 'Venkat R', license: 'TS0920235678', category: 'LMV', expiry: '2028-01-25', phone: '+91 09876 54321', status: 'Suspended', safetyScore: 62, trips: 45, experience: '2 years', address: 'Hyderabad, TS' },
];

// ──────────────────────────────────────────────────
// TRIPS
// ──────────────────────────────────────────────────
export const trips = [
  { id: 'TR-001', source: 'Mumbai', destination: 'Pune', driver: 'Ravi Kumar', vehicle: 'KA-01-AB-1234', cargo: '850 kg', distance: '149 km', status: 'Completed', startDate: '2025-07-01', endDate: '2025-07-01', duration: '3h 20m', cost: 4500 },
  { id: 'TR-002', source: 'Delhi', destination: 'Agra', driver: 'Amit Singh', vehicle: 'DL-08-EF-9012', cargo: '1.2T', distance: '206 km', status: 'In Transit', startDate: '2025-07-10', endDate: '2025-07-10', duration: '4h 10m', cost: 5800 },
  { id: 'TR-003', source: 'Chennai', destination: 'Bangalore', driver: 'Karthik R', vehicle: 'TN-22-GH-3456', cargo: '4.8T', distance: '346 km', status: 'Scheduled', startDate: '2025-07-15', endDate: '2025-07-15', duration: '6h 30m', cost: 9200 },
  { id: 'TR-004', source: 'Ahmedabad', destination: 'Surat', driver: 'Mehul Shah', vehicle: 'GJ-05-IJ-7890', cargo: '2.1T', distance: '266 km', status: 'Completed', startDate: '2025-06-28', endDate: '2025-06-28', duration: '4h 45m', cost: 6800 },
  { id: 'TR-005', source: 'Jaipur', destination: 'Jodhpur', driver: 'Raman Sharma', vehicle: 'RJ-14-KL-2345', cargo: '12T', distance: '332 km', status: 'Completed', startDate: '2025-07-05', endDate: '2025-07-05', duration: '5h 15m', cost: 11500 },
  { id: 'TR-006', source: 'Kolkata', destination: 'Bhubaneswar', driver: 'Biplab Das', vehicle: 'WB-20-OP-1234', cargo: '20T', distance: '444 km', status: 'In Transit', startDate: '2025-07-10', endDate: '2025-07-11', duration: '8h 00m', cost: 15200 },
  { id: 'TR-007', source: 'Bangalore', destination: 'Hyderabad', driver: 'Nagaraju K', vehicle: 'AP-29-QR-5678', cargo: '1.8T', distance: '570 km', status: 'Scheduled', startDate: '2025-07-16', endDate: '2025-07-16', duration: '9h 30m', cost: 13400 },
  { id: 'TR-008', source: 'Pune', destination: 'Mumbai', driver: 'Suresh Patel', vehicle: 'MH-12-CD-5678', cargo: '1T', distance: '149 km', status: 'Cancelled', startDate: '2025-07-08', endDate: '2025-07-08', duration: '3h 20m', cost: 4200 },
  { id: 'TR-009', source: 'Lucknow', destination: 'Varanasi', driver: 'Pradeep Yadav', vehicle: 'UP-80-MN-6789', cargo: '10T', distance: '320 km', status: 'Completed', startDate: '2025-07-03', endDate: '2025-07-03', duration: '5h 40m', cost: 9800 },
  { id: 'TR-010', source: 'Kochi', destination: 'Trivandrum', driver: 'Sreekumar M', vehicle: 'KL-07-UV-3456', cargo: '22T', distance: '208 km', status: 'In Transit', startDate: '2025-07-10', endDate: '2025-07-11', duration: '4h 00m', cost: 8600 },
];

// ──────────────────────────────────────────────────
// MAINTENANCE
// ──────────────────────────────────────────────────
export const maintenance = [
  { id: 1, vehicle: 'KA-01-AB-1234', vehicleName: 'Tata Ace Gold', issue: 'Oil Change', cost: 3500, date: '2025-07-08', status: 'Completed', priority: 'Low', technician: 'Ram Mechanic', description: 'Routine engine oil replacement' },
  { id: 2, vehicle: 'DL-08-EF-9012', vehicleName: 'Mahindra Bolero', issue: 'Brake Pad Replacement', cost: 8200, date: '2025-07-10', status: 'In Progress', priority: 'High', technician: 'Shyam Auto Works', description: 'Front and rear brake pad worn out' },
  { id: 3, vehicle: 'TS-09-ST-9012', vehicleName: 'Mahindra Supro', issue: 'Engine Overhaul', cost: 45000, date: '2025-07-05', status: 'In Progress', priority: 'Critical', technician: 'Service Center', description: 'Major engine repair required after breakdown' },
  { id: 4, vehicle: 'TN-22-GH-3456', vehicleName: 'Eicher Pro 2049', issue: 'Tyre Replacement', cost: 12000, date: '2025-07-12', status: 'Scheduled', priority: 'Medium', technician: 'Tyre Shop', description: 'All 4 tyres need replacement' },
  { id: 5, vehicle: 'MH-12-CD-5678', vehicleName: 'Ashok Leyland Dost', issue: 'AC Service', cost: 2800, date: '2025-07-02', status: 'Completed', priority: 'Low', technician: 'Cool Zone AC', description: 'Annual AC service and gas refill' },
  { id: 6, vehicle: 'RJ-14-KL-2345', vehicleName: 'Bharat Benz 1415', issue: 'Gearbox Issue', cost: 22000, date: '2025-07-15', status: 'Scheduled', priority: 'High', technician: 'Gear Masters', description: 'Gear slipping issue at high speeds' },
  { id: 7, vehicle: 'WB-20-OP-1234', vehicleName: 'Tata Prima 4028', issue: 'Battery Replacement', cost: 15000, date: '2025-07-06', status: 'Completed', priority: 'Medium', technician: 'Exide Service', description: '24V battery replacement' },
  { id: 8, vehicle: 'GJ-05-IJ-7890', vehicleName: 'Tata 407', issue: 'Suspension Repair', cost: 18500, date: '2025-07-18', status: 'Scheduled', priority: 'High', technician: 'Autofix', description: 'Front suspension damaged' },
];

// ──────────────────────────────────────────────────
// FUEL LOGS
// ──────────────────────────────────────────────────
export const fuelLogs = [
  { id: 1, vehicle: 'KA-01-AB-1234', vehicleName: 'Tata Ace Gold', liters: 45, cost: 4590, mileage: 14.2, date: '2025-07-10', station: 'HP Petrol, Bangalore', odometer: 45200 },
  { id: 2, vehicle: 'MH-12-CD-5678', vehicleName: 'Ashok Leyland Dost', liters: 60, cost: 6120, mileage: 12.8, date: '2025-07-09', station: 'Indian Oil, Pune', odometer: 78400 },
  { id: 3, vehicle: 'TN-22-GH-3456', vehicleName: 'Eicher Pro 2049', liters: 120, cost: 12240, mileage: 9.5, date: '2025-07-08', station: 'BPCL, Chennai', odometer: 112000 },
  { id: 4, vehicle: 'RJ-14-KL-2345', vehicleName: 'Bharat Benz 1415', liters: 200, cost: 20400, mileage: 7.2, date: '2025-07-07', station: 'HP Petrol, Jaipur', odometer: 205000 },
  { id: 5, vehicle: 'UP-80-MN-6789', vehicleName: 'Leyland Lynx', liters: 85, cost: 8670, mileage: 10.5, date: '2025-07-06', station: 'Essar, Lucknow', odometer: 56700 },
  { id: 6, vehicle: 'KL-07-UV-3456', vehicleName: 'Eicher Pro 6025', liters: 175, cost: 17850, mileage: 8.1, date: '2025-07-05', station: 'BPCL, Kochi', odometer: 145600 },
  { id: 7, vehicle: 'PB-10-WX-7890', vehicleName: 'Tata Signa 4923', liters: 210, cost: 21420, mileage: 7.8, date: '2025-07-04', station: 'Indian Oil, Ludhiana', odometer: 234000 },
  { id: 8, vehicle: 'AP-29-QR-5678', vehicleName: 'Force Traveller', liters: 55, cost: 5610, mileage: 11.4, date: '2025-07-03', station: 'HP Petrol, Hyderabad', odometer: 67300 },
  { id: 9, vehicle: 'GJ-05-IJ-7890', vehicleName: 'Tata 407', liters: 70, cost: 7140, mileage: 10.8, date: '2025-07-02', station: 'BPCL, Ahmedabad', odometer: 89500 },
  { id: 10, vehicle: 'WB-20-OP-1234', vehicleName: 'Tata Prima 4028', liters: 195, cost: 19890, mileage: 7.5, date: '2025-07-01', station: 'Indian Oil, Kolkata', odometer: 178900 },
];

// ──────────────────────────────────────────────────
// EXPENSES
// ──────────────────────────────────────────────────
export const expenses = [
  { id: 1, category: 'Fuel', amount: 124340, date: '2025-07-10', description: 'Monthly fuel costs', vehicle: 'All Vehicles', status: 'Approved' },
  { id: 2, category: 'Maintenance', amount: 124000, date: '2025-07-08', description: 'Engine repairs and servicing', vehicle: 'Multiple', status: 'Approved' },
  { id: 3, category: 'Driver Salary', amount: 285000, date: '2025-07-01', description: 'Monthly driver salaries', vehicle: 'N/A', status: 'Approved' },
  { id: 4, category: 'Toll', amount: 18500, date: '2025-07-10', description: 'Highway toll charges', vehicle: 'Multiple', status: 'Pending' },
  { id: 5, category: 'Insurance', amount: 45000, date: '2025-07-01', description: 'Fleet insurance premium', vehicle: 'All Vehicles', status: 'Approved' },
  { id: 6, category: 'Tyre', amount: 12000, date: '2025-07-12', description: 'Tyre replacement costs', vehicle: 'TN-22-GH-3456', status: 'Pending' },
  { id: 7, category: 'Repairs', amount: 22000, date: '2025-07-15', description: 'Gearbox repair', vehicle: 'RJ-14-KL-2345', status: 'Pending' },
  { id: 8, category: 'Permit', amount: 8000, date: '2025-07-01', description: 'Vehicle permits renewal', vehicle: 'Multiple', status: 'Approved' },
];

// ──────────────────────────────────────────────────
// CHART DATA
// ──────────────────────────────────────────────────
export const monthlyTripsData = [
  { month: 'Jan', trips: 38, completed: 35, cancelled: 3 },
  { month: 'Feb', trips: 42, completed: 40, cancelled: 2 },
  { month: 'Mar', trips: 55, completed: 50, cancelled: 5 },
  { month: 'Apr', trips: 48, completed: 44, cancelled: 4 },
  { month: 'May', trips: 62, completed: 58, cancelled: 4 },
  { month: 'Jun', trips: 70, completed: 65, cancelled: 5 },
  { month: 'Jul', trips: 45, completed: 40, cancelled: 5 },
];

export const fuelTrendData = [
  { month: 'Jan', liters: 2800, cost: 285600 },
  { month: 'Feb', liters: 3100, cost: 316200 },
  { month: 'Mar', liters: 3450, cost: 351900 },
  { month: 'Apr', liters: 3200, cost: 326400 },
  { month: 'May', liters: 3600, cost: 367200 },
  { month: 'Jun', liters: 3800, cost: 387600 },
  { month: 'Jul', liters: 2100, cost: 214200 },
];

export const vehicleStatusData = [
  { name: 'Active', value: 8, color: '#22C55E' },
  { name: 'Idle', value: 2, color: '#F59E0B' },
  { name: 'Maintenance', value: 2, color: '#EF4444' },
];

export const expenseTrendData = [
  { month: 'Jan', fuel: 285600, maintenance: 45000, salary: 285000, toll: 18500 },
  { month: 'Feb', fuel: 316200, maintenance: 52000, salary: 285000, toll: 21000 },
  { month: 'Mar', fuel: 351900, maintenance: 38000, salary: 285000, toll: 19500 },
  { month: 'Apr', fuel: 326400, maintenance: 67000, salary: 285000, toll: 22000 },
  { month: 'May', fuel: 367200, maintenance: 43000, salary: 285000, toll: 18000 },
  { month: 'Jun', fuel: 387600, maintenance: 78000, salary: 285000, toll: 24000 },
  { month: 'Jul', fuel: 214200, maintenance: 124000, salary: 285000, toll: 18500 },
];

export const fleetUtilizationData = [
  { day: 'Mon', utilization: 72 },
  { day: 'Tue', utilization: 85 },
  { day: 'Wed', utilization: 78 },
  { day: 'Thu', utilization: 91 },
  { day: 'Fri', utilization: 88 },
  { day: 'Sat', utilization: 65 },
  { day: 'Sun', utilization: 42 },
];

// ──────────────────────────────────────────────────
// RECENT ACTIVITIES
// ──────────────────────────────────────────────────
export const recentActivities = [
  { id: 1, type: 'trip', message: 'Trip TR-006 is now In Transit', time: '2 min ago', icon: 'trip' },
  { id: 2, type: 'maintenance', message: 'Mahindra Supro entered maintenance', time: '15 min ago', icon: 'maintenance' },
  { id: 3, type: 'driver', message: 'Nagaraju K started Trip TR-009', time: '32 min ago', icon: 'driver' },
  { id: 4, type: 'fuel', message: 'Fuel refill for Bharat Benz 1415', time: '1h ago', icon: 'fuel' },
  { id: 5, type: 'alert', message: 'Mehul Shah license expiry in 5 months', time: '2h ago', icon: 'alert' },
  { id: 6, type: 'trip', message: 'Trip TR-001 completed successfully', time: '3h ago', icon: 'trip' },
];

// ──────────────────────────────────────────────────
// KPI DATA
// ──────────────────────────────────────────────────
export const kpiData = {
  activeVehicles: 8,
  availableVehicles: 4,
  maintenanceVehicles: 2,
  driversOnDuty: 5,
  activeTrips: 3,
  pendingTrips: 2,
  fleetUtilization: 78,
  monthlyFuelCost: 214200,
  monthlyExpense: 638840,
};
