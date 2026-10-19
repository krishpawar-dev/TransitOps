import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdPeople, MdStar } from 'react-icons/md';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select } from '../../components/common/Input';
import { drivers as driversData } from '../../services/data';
import { getStatusColor, filterBySearch, paginate, sortData } from '../../utils/helpers';
import '../vehicles/Vehicles.css';
import './Drivers.css';

const PER_PAGE = 8;
const STATUS_OPTIONS = ['All', 'On Duty', 'Available', 'Leave', 'Suspended'];

const emptyForm = { name: '', license: '', category: 'HMV', expiry: '', phone: '', status: 'Available', safetyScore: 80, experience: '', address: '' };

const SafetyBar = ({ score }) => {
  const color = score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div className="safety-bar-wrap">
      <div className="safety-bar">
        <div className="safety-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="safety-score" style={{ color }}>{score}</span>
    </div>
  );
};

const Drivers = () => {
  const [data, setData] = useState(driversData);
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
    let d = filterBySearch(data, search, ['name', 'license', 'phone', 'address']);
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
    else setData(d => [...d, { ...form, id: d.length + 1, trips: 0 }]);
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData(d => d.filter(v => v.id !== deleteItem.id));
    setDeleteModalOpen(false);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Drivers</h1>
          <p className="page-subtitle">{data.length} registered drivers</p>
        </div>
        <Button icon={<MdAdd />} onClick={openAdd} id="add-driver-btn">Add Driver</Button>
      </div>

      {/* Stats */}
      <div className="vehicles-stats">
        {[
          { label: 'On Duty', val: data.filter(d => d.status === 'On Duty').length, cls: 'active' },
          { label: 'Available', val: data.filter(d => d.status === 'Available').length, cls: 'idle' },
          { label: 'On Leave', val: data.filter(d => d.status === 'Leave').length, cls: 'idle' },
          { label: 'Suspended', val: data.filter(d => d.status === 'Suspended').length, cls: 'maintenance' },
        ].map(s => (
          <div key={s.label} className={`vstat-chip ${s.cls}`}>
            <span className="vstat-val">{s.val}</span>
            <span className="vstat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="table-toolbar">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, license, phone..." />
          <div className="table-filters">
            {STATUS_OPTIONS.map(s => (
              <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {[['name', 'Driver'], ['license', 'License'], ['category', 'Category'], ['expiry', 'Expiry'], ['phone', 'Phone'], ['safetyScore', 'Safety Score'], ['status', 'Status']].map(([k, l]) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">{l} <SortIcon col={k} /></th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No drivers found" /></td></tr>
              ) : paginated.map(d => (
                <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td>
                    <div className="driver-name-cell">
                      <div className="driver-avatar">{d.name[0]}</div>
                      <div>
                        <div className="cell-primary">{d.name}</div>
                        <div className="cell-secondary">{d.experience}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="mono-text">{d.license}</span></td>
                  <td><Badge variant="info">{d.category}</Badge></td>
                  <td className={new Date(d.expiry) < new Date(Date.now() + 180*24*3600*1000) ? 'text-warning' : ''}>{d.expiry}</td>
                  <td>{d.phone}</td>
                  <td><SafetyBar score={d.safetyScore} /></td>
                  <td><Badge variant={getStatusColor(d.status)} dot={d.status === 'On Duty'}>{d.status}</Badge></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn view" onClick={() => openView(d)} title="View"><MdVisibility size={16} /></button>
                      <button className="action-btn edit" onClick={() => openEdit(d)} title="Edit"><MdEdit size={16} /></button>
                      <button className="action-btn delete" onClick={() => openDelete(d)} title="Delete"><MdDelete size={16} /></button>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Driver' : 'Add New Driver'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Driver'}</Button></>}>
        <div className="form-grid">
          <Input label="Full Name" value={form.name} onChange={f('name')} required />
          <Input label="License Number" value={form.license} onChange={f('license')} required />
          <Select label="Category" value={form.category} onChange={f('category')} options={[{ value: 'HMV', label: 'HMV' }, { value: 'LMV', label: 'LMV' }]} />
          <Input label="License Expiry" type="date" value={form.expiry} onChange={f('expiry')} required />
          <Input label="Phone" value={form.phone} onChange={f('phone')} placeholder="+91 XXXXX XXXXX" />
          <Select label="Status" value={form.status} onChange={f('status')} options={[
            { value: 'Available', label: 'Available' }, { value: 'On Duty', label: 'On Duty' },
            { value: 'Leave', label: 'Leave' }, { value: 'Suspended', label: 'Suspended' }]} />
          <Input label="Experience" value={form.experience} onChange={f('experience')} placeholder="5 years" />
          <Input label="Safety Score (0-100)" type="number" value={form.safetyScore} onChange={f('safetyScore')} min="0" max="100" />
          <Input label="Address" value={form.address} onChange={f('address')} placeholder="City, State" className="full-width" />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Driver Profile" size="md"
        footer={<Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>}>
        {viewItem && (
          <div className="driver-profile">
            <div className="driver-profile-header">
              <div className="driver-profile-avatar">{viewItem.name[0]}</div>
              <div>
                <h3>{viewItem.name}</h3>
                <Badge variant={getStatusColor(viewItem.status)}>{viewItem.status}</Badge>
              </div>
            </div>
            <div className="detail-grid" style={{ marginTop: 16 }}>
              {[['License', viewItem.license], ['Category', viewItem.category], ['Expiry', viewItem.expiry], ['Phone', viewItem.phone], ['Experience', viewItem.experience], ['Total Trips', viewItem.trips], ['Address', viewItem.address]].map(([k, v]) => (
                <div key={k} className="detail-row">
                  <span className="detail-key">{k}</span>
                  <span className="detail-val">{v}</span>
                </div>
              ))}
              <div className="detail-row">
                <span className="detail-key">Safety Score</span>
                <SafetyBar score={viewItem.safetyScore} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Remove Driver" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Remove Driver</Button></>}>
        <div className="confirm-msg">
          <p>Are you sure you want to remove <strong>{deleteItem?.name}</strong> from the system?</p>
          <p className="text-muted" style={{ marginTop: 8, fontSize: '0.875rem' }}>This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Drivers;
