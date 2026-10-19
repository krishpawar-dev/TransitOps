import React from 'react';
import { motion } from 'framer-motion';
import { MdDownload, MdBarChart, MdLocalGasStation, MdDirectionsCar, MdPeople } from 'react-icons/md';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { monthlyTripsData, fuelTrendData, vehicleStatusData, expenseTrendData, fleetUtilizationData } from '../../services/data';
import { formatCurrency } from '../../utils/helpers';
import './Reports.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const Reports = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive fleet performance analytics</p>
        </div>
        <div className="reports-actions">
          <Button variant="secondary" icon={<MdDownload />} id="download-pdf">Export PDF</Button>
          <Button icon={<MdDownload />} id="download-excel">Export Excel</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="reports-kpi-grid">
        {[
          { label: 'Total Distance (Jul)', value: '3,248 km', icon: <MdDirectionsCar />, color: 'primary', delta: '+12%' },
          { label: 'Fuel Efficiency Avg', value: '9.8 km/L', icon: <MdLocalGasStation />, color: 'success', delta: '+3%' },
          { label: 'Fleet Utilization', value: '78%', icon: <MdBarChart />, color: 'warning', delta: '+5%' },
          { label: 'Active Drivers', value: '8 / 10', icon: <MdPeople />, color: 'info', delta: 'Stable' },
        ].map(k => (
          <motion.div key={k.label} className="reports-kpi-card" {...fadeUp(0.05)} whileHover={{ y: -3 }}>
            <div className={`reports-kpi-icon reports-kpi-icon-${k.color}`}>{k.icon}</div>
            <div className="reports-kpi-val">{k.value}</div>
            <div className="reports-kpi-label">{k.label}</div>
            <Badge variant={k.color} size="sm">{k.delta}</Badge>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="reports-charts-grid">
        {/* Fleet Utilization */}
        <motion.div className="card" {...fadeUp(0.1)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekly Fleet Utilization</h3>
              <p className="chart-subtitle" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>% of fleet active per day</p>
            </div>
            <Button variant="secondary" size="sm" icon={<MdDownload />}>Download</Button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fleetUtilizationData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, 'Utilization']} />
                <Bar dataKey="utilization" name="Utilization" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vehicle Status */}
        <motion.div className="card" {...fadeUp(0.15)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Vehicle Status Breakdown</h3>
              <p className="chart-subtitle" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>Current fleet composition</p>
            </div>
            <Button variant="secondary" size="sm" icon={<MdDownload />}>Download</Button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={vehicleStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {vehicleStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} vehicles`, n]} />
                <Legend formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Fuel Efficiency */}
        <motion.div className="card" {...fadeUp(0.2)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Fuel Consumption Trend</h3>
              <p className="chart-subtitle" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>Monthly liters consumed</p>
            </div>
            <Button variant="secondary" size="sm" icon={<MdDownload />}>Download</Button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={fuelTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="liters" name="Liters" stroke="#F59E0B" fill="url(#fg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Operational Cost */}
        <motion.div className="card" {...fadeUp(0.25)}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Operational Cost Breakdown</h3>
              <p className="chart-subtitle" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>Monthly cost categories</p>
            </div>
            <Button variant="secondary" size="sm" icon={<MdDownload />}>Download</Button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={expenseTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [formatCurrency(v)]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="fuel" name="Fuel" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="maintenance" name="Maintenance" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="salary" name="Salary" stroke="#22C55E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="toll" name="Toll" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Monthly Report Table */}
      <motion.div className="card" style={{ marginTop: 16 }} {...fadeUp(0.3)}>
        <div className="card-header">
          <h3 className="card-title">Monthly Report Summary</h3>
          <Button variant="secondary" size="sm" icon={<MdDownload />} id="download-report-btn">Download Report</Button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Trips</th>
                <th>Completed</th>
                <th>Cancelled</th>
                <th>Fuel (L)</th>
                <th>Fuel Cost</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTripsData.map((m, i) => {
                const rate = Math.round((m.completed / m.trips) * 100);
                return (
                  <tr key={m.month} className="table-row">
                    <td className="cell-primary">{m.month} 2025</td>
                    <td>{m.trips}</td>
                    <td className="text-success">{m.completed}</td>
                    <td className="text-danger">{m.cancelled}</td>
                    <td>{fuelTrendData[i]?.liters?.toLocaleString() || '—'}</td>
                    <td>{formatCurrency(fuelTrendData[i]?.cost || 0)}</td>
                    <td>
                      <div className="report-rate-wrap">
                        <div className="report-rate-bar">
                          <div className="report-rate-fill" style={{ width: `${rate}%` }} />
                        </div>
                        <span>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
