import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdBuild } from 'react-icons/md';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select, Textarea } from '../../components/common/Input';
import { maintenance as maintenanceData, vehicles } from '../../services/data';
import { getStatusColor, getPriorityColor, filterBySearch, paginate, sortData } from '../../utils/helpers';
import '../vehicles/Vehicles.css';
import './Maintenance.css';

const PER_PAGE = 8;
const STATUS_OPTS = ['All', 'Scheduled', 'In Progress', 'Completed'];
const PRIORITY_OPTS = ['Low', 'Medium', 'High', 'Critical'];

const emptyForm = { vehicle: '', vehicleName: '', issue: '', cost: '', date: '', status: 'Scheduled', priority: 'Medium', technician: '', description: '' };

const Maintenance = () => {
  const [data, setData] = useState(maintenanceData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    let d = filterBySearch(data, search, ['vehicle', 'vehicleName', 'issue', 'technician']);
    if (statusFilter !== 'All') d = d.filter(v => v.status === statusFilter);
    return sortData(d, sortKey, sortDir);
  }, [data, search, statusFilter, sortKey, sortDir]);

  const paginated = paginate(filtered, page, PER_PAGE);

  const handleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => (
    <span className={`sort-icon ${sortKey === col ? 'active' : ''}`}>
      {sortKey === col && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  );

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (v) => { setEditItem(v); setForm({ ...v }); setModalOpen(true); };
  const openView = (v) => { setViewItem(v); setViewModalOpen(true); };
  const openDelete = (v) => { setDeleteItem(v); setDeleteModalOpen(true); };

  const handleSave = () => {
    if (editItem) setData(d => d.map(v => v.id === editItem.id ? { ...v, ...form } : v));
    else setData(d => [...d, { ...form, id: d.length + 1 }]);
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData(d => d.filter(v => v.id !== deleteItem.id));
    setDeleteModalOpen(false);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const vehicleOpts = vehicles.map(v => ({ value: v.reg, label: `${v.reg} – ${v.name}` }));

  const totalCost = data.reduce((s, m) => s + Number(m.cost), 0);
  const stats = [
    { label: 'Total Records', val: data.length, cls: '' },
    { label: 'Scheduled', val: data.filter(m => m.status === 'Scheduled').length, cls: 'idle' },
    { label: 'In Progress', val: data.filter(m => m.status === 'In Progress').length, cls: '' },
    { label: 'Completed', val: data.filter(m => m.status === 'Completed').length, cls: 'active' },
    { label: 'Total Cost', val: `₹${totalCost.toLocaleString()}`, cls: 'maintenance' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="page-subtitle">Fleet maintenance tracker</p>
        </div>
        <Button icon={<MdAdd />} onClick={openAdd} id="add-maintenance-btn">Schedule Maintenance</Button>
      </div>

      <div className="vehicles-stats">
        {stats.map(s => (
          <div key={s.label} className={`vstat-chip ${s.cls}`}>
            <span className="vstat-val">{s.val}</span>
            <span className="vstat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Cards View */}
      <div className="maintenance-cards">
        {data.filter(m => m.status !== 'Completed').slice(0, 4).map(m => (
          <motion.div key={m.id} className={`maint-card priority-${m.priority.toLowerCase()}`}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
            <div className="maint-card-top">
              <Badge variant={getPriorityColor(m.priority)} size="sm">{m.priority}</Badge>
              <Badge variant={getStatusColor(m.status)} size="sm">{m.status}</Badge>
            </div>
            <div className="maint-card-icon"><MdBuild /></div>
            <h4 className="maint-card-title">{m.issue}</h4>
            <p className="maint-card-vehicle">{m.vehicleName}</p>
            <div className="maint-card-footer">
              <span className="maint-card-cost">₹{Number(m.cost).toLocaleString()}</span>
              <span className="maint-card-date">{m.date}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="card" style={{ marginTop: 16 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="table-toolbar">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search maintenance records..." />
          <div className="table-filters">
            {STATUS_OPTS.map(s => (
              <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {[['vehicleName', 'Vehicle'], ['issue', 'Issue'], ['technician', 'Technician'], ['cost', 'Cost'], ['date', 'Date'], ['priority', 'Priority'], ['status', 'Status']].map(([k, l]) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">{l} <SortIcon col={k} /></th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No maintenance records" /></td></tr>
              ) : paginated.map(m => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td>
                    <div className="cell-primary">{m.vehicleName}</div>
                    <div className="cell-secondary mono-text">{m.vehicle}</div>
                  </td>
                  <td className="cell-primary">{m.issue}</td>
                  <td className="text-secondary">{m.technician}</td>
                  <td className="cell-primary">₹{Number(m.cost).toLocaleString()}</td>
                  <td>{m.date}</td>
                  <td><Badge variant={getPriorityColor(m.priority)}>{m.priority}</Badge></td>
                  <td><Badge variant={getStatusColor(m.status)}>{m.status}</Badge></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn view" onClick={() => openView(m)} title="View"><MdVisibility size={16} /></button>
                      <button className="action-btn edit" onClick={() => openEdit(m)} title="Edit"><MdEdit size={16} /></button>
                      <button className="action-btn delete" onClick={() => openDelete(m)} title="Delete"><MdDelete size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalItems={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Maintenance' : 'Schedule Maintenance'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Schedule'}</Button></>}>
        <div className="form-grid">
          <Select label="Vehicle" value={form.vehicle} onChange={f('vehicle')} options={vehicleOpts} className="full-width" />
          <Input label="Issue / Service Type" value={form.issue} onChange={f('issue')} required />
          <Input label="Technician / Service Center" value={form.technician} onChange={f('technician')} />
          <Input label="Estimated Cost (₹)" type="number" value={form.cost} onChange={f('cost')} />
          <Input label="Date" type="date" value={form.date} onChange={f('date')} required />
          <Select label="Priority" value={form.priority} onChange={f('priority')} options={PRIORITY_OPTS.map(p => ({ value: p, label: p }))} />
          <Select label="Status" value={form.status} onChange={f('status')} options={[
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' }]} />
          <Textarea label="Description" value={form.description} onChange={f('description')} placeholder="Describe the issue..." rows={3} className="full-width" />
        </div>
      </Modal>

      {/* View */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Maintenance Details" size="md"
        footer={<Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>}>
        {viewItem && (
          <div className="detail-grid">
            {[['Vehicle', viewItem.vehicleName], ['Reg No', viewItem.vehicle], ['Issue', viewItem.issue], ['Technician', viewItem.technician], ['Cost', `₹${Number(viewItem.cost).toLocaleString()}`], ['Date', viewItem.date], ['Description', viewItem.description]].map(([k, v]) => (
              <div key={k} className="detail-row">
                <span className="detail-key">{k}</span>
                <span className="detail-val">{v}</span>
              </div>
            ))}
            <div className="detail-row">
              <span className="detail-key">Priority</span>
              <Badge variant={getPriorityColor(viewItem.priority)}>{viewItem.priority}</Badge>
            </div>
            <div className="detail-row">
              <span className="detail-key">Status</span>
              <Badge variant={getStatusColor(viewItem.status)}>{viewItem.status}</Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Record" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}>
        <div className="confirm-msg">
          <p>Delete maintenance record for <strong>{deleteItem?.vehicleName}</strong> – {deleteItem?.issue}?</p>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;
