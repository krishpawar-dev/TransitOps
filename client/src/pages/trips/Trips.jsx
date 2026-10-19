import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdRoute, MdArrowForward } from 'react-icons/md';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select } from '../../components/common/Input';
import { trips as tripsData, vehicles, drivers } from '../../services/data';
import { getStatusColor, filterBySearch, paginate, sortData, formatCurrency } from '../../utils/helpers';
import '../vehicles/Vehicles.css';
import './Trips.css';

const PER_PAGE = 8;
const STATUS_OPTS = ['All', 'Completed', 'In Transit', 'Scheduled', 'Cancelled'];

const emptyForm = {
  source: '', destination: '', driver: '', vehicle: '',
  cargo: '', distance: '', status: 'Scheduled', startDate: '', cost: ''
};

const Trips = () => {
  const [data, setData] = useState(tripsData);
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
    let d = filterBySearch(data, search, ['id', 'source', 'destination', 'driver', 'vehicle']);
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
    else {
      const newId = `TR-${String(data.length + 1).padStart(3, '0')}`;
      setData(d => [...d, { ...form, id: newId, endDate: form.startDate, duration: '—' }]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData(d => d.filter(v => v.id !== deleteItem.id));
    setDeleteModalOpen(false);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const vehicleOpts = vehicles.map(v => ({ value: v.reg, label: `${v.reg} – ${v.name}` }));
  const driverOpts = drivers.map(d => ({ value: d.name, label: d.name }));

  const stats = [
    { label: 'Total', val: data.length, cls: '' },
    { label: 'Completed', val: data.filter(t => t.status === 'Completed').length, cls: 'active' },
    { label: 'In Transit', val: data.filter(t => t.status === 'In Transit').length, cls: '' },
    { label: 'Scheduled', val: data.filter(t => t.status === 'Scheduled').length, cls: 'idle' },
    { label: 'Cancelled', val: data.filter(t => t.status === 'Cancelled').length, cls: 'maintenance' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trips</h1>
          <p className="page-subtitle">{data.length} total trips</p>
        </div>
        <Button icon={<MdAdd />} onClick={openAdd} id="create-trip-btn">Create Trip</Button>
      </div>

      <div className="vehicles-stats">
        {stats.map(s => (
          <div key={s.label} className={`vstat-chip ${s.cls}`}>
            <span className="vstat-val">{s.val}</span>
            <span className="vstat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="table-toolbar">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search trips..." />
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
                {[['id', 'Trip ID'], ['source', 'Route'], ['driver', 'Driver'], ['vehicle', 'Vehicle'], ['cargo', 'Cargo'], ['distance', 'Distance'], ['status', 'Status'], ['cost', 'Cost']].map(([k, l]) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">{l} <SortIcon col={k} /></th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState title="No trips found" /></td></tr>
              ) : paginated.map(t => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td><span className="trip-id-tag">{t.id}</span></td>
                  <td>
                    <div className="route-cell">
                      <span className="route-from">{t.source}</span>
                      <MdArrowForward size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span className="route-to">{t.destination}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{t.driver}</td>
                  <td><span className="mono-text">{t.vehicle}</span></td>
                  <td>{t.cargo}</td>
                  <td>{t.distance}</td>
                  <td><Badge variant={getStatusColor(t.status)}>{t.status}</Badge></td>
                  <td className="cell-primary">₹{Number(t.cost).toLocaleString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn view" onClick={() => openView(t)} title="View"><MdVisibility size={16} /></button>
                      <button className="action-btn edit" onClick={() => openEdit(t)} title="Edit"><MdEdit size={16} /></button>
                      <button className="action-btn delete" onClick={() => openDelete(t)} title="Delete"><MdDelete size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalItems={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
      </motion.div>

      {/* Add/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Trip' : 'Create Trip'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Create Trip'}</Button></>}>
        <div className="form-grid">
          <Input label="Source / Origin" value={form.source} onChange={f('source')} required />
          <Input label="Destination" value={form.destination} onChange={f('destination')} required />
          <Select label="Driver" value={form.driver} onChange={f('driver')} options={driverOpts} />
          <Select label="Vehicle" value={form.vehicle} onChange={f('vehicle')} options={vehicleOpts} />
          <Input label="Cargo Weight" value={form.cargo} onChange={f('cargo')} placeholder="850 kg" />
          <Input label="Distance" value={form.distance} onChange={f('distance')} placeholder="149 km" />
          <Input label="Start Date" type="date" value={form.startDate} onChange={f('startDate')} />
          <Input label="Estimated Cost (₹)" type="number" value={form.cost} onChange={f('cost')} />
          <Select label="Status" value={form.status} onChange={f('status')} options={STATUS_OPTS.filter(s => s !== 'All').map(s => ({ value: s, label: s }))} />
        </div>
      </Modal>

      {/* View */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Trip ${viewItem?.id}`} size="md"
        footer={<Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>}>
        {viewItem && (
          <>
            <div className="trip-detail-route">
              <div className="trip-detail-city">{viewItem.source}</div>
              <div className="trip-detail-line"><div className="trip-detail-dots" /><MdRoute size={20} /><div className="trip-detail-dots" /></div>
              <div className="trip-detail-city">{viewItem.destination}</div>
            </div>
            <div className="detail-grid" style={{ marginTop: 16 }}>
              {[['Driver', viewItem.driver], ['Vehicle', viewItem.vehicle], ['Cargo', viewItem.cargo], ['Distance', viewItem.distance], ['Duration', viewItem.duration], ['Start Date', viewItem.startDate], ['Cost', `₹${Number(viewItem.cost).toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="detail-row">
                  <span className="detail-key">{k}</span>
                  <span className="detail-val">{v}</span>
                </div>
              ))}
              <div className="detail-row">
                <span className="detail-key">Status</span>
                <Badge variant={getStatusColor(viewItem.status)}>{viewItem.status}</Badge>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Delete */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Cancel Trip" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Keep Trip</Button><Button variant="danger" onClick={handleDelete}>Delete Trip</Button></>}>
        <div className="confirm-msg">
          <p>Delete trip <strong>{deleteItem?.id}</strong> ({deleteItem?.source} → {deleteItem?.destination})?</p>
          <p className="text-muted" style={{ marginTop: 8, fontSize: '0.875rem' }}>This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Trips;
