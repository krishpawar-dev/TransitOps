/**
 * Vehicle ROI Calculator
 * ROI = (Revenue Generated - Total Operating Cost) / Acquisition Cost * 100
 */

/**
 * Calculate basic ROI for a vehicle based on trips and expenses.
 * @param {Object} params
 * @param {number} params.acquisitionCost
 * @param {number} params.totalFuelCost
 * @param {number} params.totalMaintenanceCost
 * @param {number} params.totalTripRevenue  - estimated: distance * rate
 * @param {number} params.totalExpenses
 * @returns {Object} roi breakdown
 */
const calculateROI = ({
  acquisitionCost = 1,
  totalFuelCost = 0,
  totalMaintenanceCost = 0,
  totalTripRevenue = 0,
  totalExpenses = 0,
}) => {
  const totalOperatingCost = totalFuelCost + totalMaintenanceCost + totalExpenses;
  const netRevenue = totalTripRevenue - totalOperatingCost;
  const roi = acquisitionCost > 0
    ? ((netRevenue / acquisitionCost) * 100).toFixed(2)
    : 0;

  return {
    acquisitionCost,
    totalOperatingCost,
    totalFuelCost,
    totalMaintenanceCost,
    totalExpenses,
    totalTripRevenue,
    netRevenue,
    roi: parseFloat(roi),
  };
};

/**
 * Calculate fuel efficiency: km per liter
 */
const calculateFuelEfficiency = (distanceKm, liters) => {
  if (!liters || liters === 0) return 0;
  return parseFloat((distanceKm / liters).toFixed(2));
};

/**
 * Calculate cost per km
 */
const calculateCostPerKm = (totalCost, distanceKm) => {
  if (!distanceKm || distanceKm === 0) return 0;
  return parseFloat((totalCost / distanceKm).toFixed(2));
};

/**
 * Fleet utilization: % of active vehicles
 */
const calculateFleetUtilization = (activeVehicles, totalVehicles) => {
  if (!totalVehicles || totalVehicles === 0) return 0;
  return parseFloat(((activeVehicles / totalVehicles) * 100).toFixed(1));
};

module.exports = { calculateROI, calculateFuelEfficiency, calculateCostPerKm, calculateFleetUtilization };
