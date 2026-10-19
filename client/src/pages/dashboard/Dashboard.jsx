import React from 'react';
import { motion } from 'framer-motion';
import {
  MdDirectionsCar, MdPeople, MdRoute, MdBuild,
  MdLocalGasStation, MdAccountBalance, MdTrendingUp,
  MdArrowUpward, MdArrowDownward, MdMoreVert
} from 'react-icons/md';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import Badge from '../../components/common/Badge';
import {
  kpiData, monthlyTripsData, fuelTrendData,
  vehicleStatusData, expenseTrendData, recentActivities, trips
} from '../../services/data';
import { formatCurrency, getStatusColor } from '../../utils/helpers';
import './Dashboard.css';

/* ── Fade-up animation variant ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

/* ── KPI Card ── */
const KPICard = ({ label, value, icon, color, sub, trend }) => (
  <motion.div className="kpi-card" {...fadeUp(0.05)} whileHover={{ y: -3 }}>
    <div className="kpi-card-header">
      <div className={`kpi-icon kpi-icon-${color}`}>{icon}</div>
      {trend !== undefined && (
        <span className={`kpi-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? <MdArrowUpward size={13} /> : <MdArrowDownward size={13} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
  </motion.div>
);

/* ── Chart tooltip style ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="chart-tooltip-item">
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Activity icon ── */
const ActivityIcon = ({ type }) => {
  const icons = {
    trip: <MdRoute />,
    maintenance: <MdBuild />,
    driver: <MdPeople />,
    fuel: <MdLocalGasStation />,
    alert: <MdTrendingUp />,
  };
  const colors = { trip: 'primary', maintenance: 'warning', driver: 'success', fuel: 'info', alert: 'danger' };
  return (
    <span className={`activity-icon activity-icon-${colors[type] || 'default'}`}>
      {icons[type] || <MdRoute />}
    </span>
  );
};

const Dashboard = () => {
  const recentTrips = trips.slice(0, 5);

  return (
    <div className="page-container dashboard-page">
      {/* Header */}
      <motion.div className="page-header" {...fadeUp(0)}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your fleet.</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard label="Active Vehicles" value={kpiData.activeVehicles} icon={<MdDirectionsCar size={22} />} color="primary" trend={12} sub="of 12 total" />
        <KPICard label="Available Vehicles" value={kpiData.availableVehicles} icon={<MdDirectionsCar size={22} />} color="success" sub="Ready to deploy" />
        <KPICard label="In Maintenance" value={kpiData.maintenanceVehicles} icon={<MdBuild size={22} />} color="warning" trend={-5} />
        <KPICard label="Drivers On Duty" value={kpiData.driversOnDuty} icon={<MdPeople size={22} />} color="info" trend={8} sub="of 10 total" />
        <KPICard label="Active Trips" value={kpiData.activeTrips} icon={<MdRoute size={22} />} color="primary" dot />
        <KPICard label="Pending Trips" value={kpiData.pendingTrips} icon={<MdRoute size={22} />} color="warning" />
        <KPICard label="Fleet Utilization" value={`${kpiData.fleetUtilization}%`} icon={<MdTrendingUp size={22} />} color="success" trend={5} />
        <KPICard label="Monthly Expense" value={formatCurrency(kpiData.monthlyExpense)} icon={<MdAccountBalance size={22} />} color="danger" trend={-3} />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        {/* Trips Line Chart */}
        <motion.div className="card chart-card chart-card-lg" {...fadeUp(0.15)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Monthly Trips Overview</h3>
              <p className="chart-subtitle">Completed vs cancelled trips</p>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyTripsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cancelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#2563EB" strokeWidth={2} fill="url(#tripGrad)" dot={false} />
                <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="#EF4444" strokeWidth={2} fill="url(#cancelGrad)" dot={false} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vehicle Status Pie */}
        <motion.div className="card chart-card chart-card-sm" {...fadeUp(0.2)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Vehicle Status</h3>
              <p className="chart-subtitle">Fleet breakdown</p>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={vehicleStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                  {vehicleStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} vehicles`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {vehicleStatusData.map(d => (
                <div key={d.name} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: d.color }} />
                  <span className="pie-legend-name">{d.name}</span>
                  <span className="pie-legend-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        {/* Fuel Bar Chart */}
        <motion.div className="card chart-card chart-card-md" {...fadeUp(0.25)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Fuel Consumption</h3>
              <p className="chart-subtitle">Monthly liters consumed</p>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fuelTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="liters" name="Liters" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Line Chart */}
        <motion.div className="card chart-card chart-card-md" {...fadeUp(0.3)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Expense Breakdown</h3>
              <p className="chart-subtitle">Monthly cost categories</p>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={expenseTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line type="monotone" dataKey="fuel" name="Fuel" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="maintenance" name="Maintenance" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="salary" name="Salary" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Recent Trips + Activity */}
      <div className="bottom-row">
        {/* Recent Trips Table */}
        <motion.div className="card bottom-card" {...fadeUp(0.35)}>
          <div className="card-header">
            <h3 className="card-title">Recent Trips</h3>
            <a href="/trips" className="card-link">View all →</a>
          </div>
          <div className="recent-trips-table-wrap">
            <table className="recent-trips-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map(trip => (
                  <tr key={trip.id}>
                    <td><span className="trip-id">{trip.id}</span></td>
                    <td>
                      <span className="trip-route">
                        {trip.source} <span className="route-arrow">→</span> {trip.destination}
                      </span>
                    </td>
                    <td className="trip-driver">{trip.driver}</td>
                    <td><Badge variant={getStatusColor(trip.status)}>{trip.status}</Badge></td>
                    <td className="trip-cost">₹{trip.cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div className="card bottom-card activity-card" {...fadeUp(0.4)}>
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-body">
            <ul className="activity-list">
              {recentActivities.map(act => (
                <li key={act.id} className="activity-item">
                  <ActivityIcon type={act.type} />
                  <div className="activity-content">
                    <p className="activity-msg">{act.message}</p>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
