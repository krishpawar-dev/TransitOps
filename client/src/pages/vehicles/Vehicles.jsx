import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdFilterList, MdDirectionsCar } from 'react-icons/md';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select } from '../../components/common/Input';
import { vehicles as vehiclesData } from '../../services/data';
import { getStatusColor, filterBySearch, paginate, sortData, genId } from '../../utils/helpers';
import './Vehicles.css';

const PER_PAGE = 8;
const STATUS_OPTIONS = ['All', 'Active', 'Idle', 'Maintenance'];
const TYPE_OPTIONS = [
  { value: 'Mini Truck', label: 'Mini Truck' },
  { value: 'Light Truck', label: 'Light Truck' },
  { value: 'Pickup', label: 'Pickup' },
  { value: 'Medium Truck', label: 'Medium Truck' },
  { value: 'Heavy Truck', label: 'Heavy Truck' },
  { value: 'Van', label: 'Van' },
  { value: 'Truck', label: 'Truck' },
];

const emptyForm = { reg: '', name: '', model: '', type: '', capacity: '', status: 'Active', odometer: '', fuel: 'Diesel', driver: '' };

const Vehicles = () => {
  const [data, setData] = useState(vehiclesData);
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
    let d = filterBySearch(data, search, ['reg', 'name', 'model', 'type', 'driver']);
    if (statusFilter !== 'All') d = d.filter(v => v.status === statusFilter);
    return sortData(d, sortKey, sortDir);
  }, [data, search, statusFilter, sortKey, sortDir]);

  const paginated = paginate(filtered, page, PER_PAGE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (v) => { setEditItem(v); setForm({ ...v }); setModalOpen(true); };
  const openView = (v) => { setViewItem(v); setViewModalOpen(true); };
  const openDelete = (v) => { setDeleteItem(v); setDeleteModalOpen(true); };

  const handleSave = () => {
    if (editItem) {
      setData(d => d.map(v => v.id === editItem.id ? { ...v, ...form } : v));
    } else {
      setData(d => [...d, { ...form, id: d.length + 1 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData(d => d.filter(v => v.id !== deleteItem.id));
    setDeleteModalOpen(false);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const SortIcon = ({ col }) => (
    <span className={`sort-icon ${sortKey === col ? 'active' : ''}`}>
      {sortKey === col && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicles</h1>
          <p className="page-subtitle">{data.length} vehicles in fleet</p>
        </div>
        <Button icon={<MdAdd />} onClick={openAdd} id="add-vehicle-btn">Add Vehicle</Button>
      </div>

      {/* Stats Strip */}
      <div className="vehicles-stats">
        {STATUS_OPTIONS.filter(s => s !== 'All').map(s => (
          <div key={s} className={`vstat-chip ${s.toLowerCase()}`} onClick={() => { setStatusFilter(s); setPage(1); }}>
            <span className="vstat-val">{data.filter(v => v.status === s).length}</span>
            <span className="vstat-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Card */}
      <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {/* Toolbar */}
        <div className="table-toolbar">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by reg, name, driver..." />
          <div className="table-filters">
            {STATUS_OPTIONS.map(s => (
              <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => { setStatusFilter(s); setPage(1); }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {[['reg', 'Reg No.'], ['name', 'Vehicle'], ['type', 'Type'], ['capacity', 'Capacity'], ['status', 'Status'], ['odometer', 'Odometer'], ['driver', 'Driver']].map(([k, l]) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">
                    {l} <SortIcon col={k} />
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No vehicles found" subtitle="Try adjusting your search or filters" /></td></tr>
              ) : paginated.map(v => (
                <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td><span className="mono-text">{v.reg}</span></td>
                  <td>
                    <div className="vehicle-name-cell">
                      <div className="vehicle-avatar"><MdDirectionsCar /></div>
                      <div>
                        <div className="cell-primary">{v.name}</div>
                        <div className="cell-secondary">{v.model}</div>
                      </div>
                    </div>
                  </td>
                  <td>{v.type}</td>
                  <td>{v.capacity}</td>
                  <td><Badge variant={getStatusColor(v.status)} dot={v.status === 'Active'}>{v.status}</Badge></td>
                  <td>{Number(v.odometer).toLocaleString()} km</td>
                  <td className="text-secondary">{v.driver}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn view" onClick={() => openView(v)} title="View"><MdVisibility size={16} /></button>
                      <button className="action-btn edit" onClick={() => openEdit(v)} title="Edit"><MdEdit size={16} /></button>
                      <button className="action-btn delete" onClick={() => openDelete(v)} title="Delete"><MdDelete size={16} /></button>
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Vehicle' : 'Add New Vehicle'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Vehicle'}</Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="Registration Number" value={form.reg} onChange={f('reg')} placeholder="KA-01-AB-1234" required />
          <Input label="Vehicle Name" value={form.name} onChange={f('name')} placeholder="Tata Ace Gold" required />
          <Input label="Model" value={form.model} onChange={f('model')} placeholder="Ace Gold 2022" />
          <Select label="Type" value={form.type} onChange={f('type')} options={TYPE_OPTIONS} />
          <Input label="Capacity" value={form.capacity} onChange={f('capacity')} placeholder="1T" />
          <Select label="Status" value={form.status} onChange={f('status')} options={[
            { value: 'Active', label: 'Active' },
            { value: 'Idle', label: 'Idle' },
            { value: 'Maintenance', label: 'Maintenance' },
          ]} />
          <Input label="Odometer (km)" type="number" value={form.odometer} onChange={f('odometer')} placeholder="45200" />
          <Select label="Fuel Type" value={form.fuel} onChange={f('fuel')} options={[{ value: 'Diesel', label: 'Diesel' }, { value: 'Petrol', label: 'Petrol' }]} />
          <Input label="Assigned Driver" value={form.driver} onChange={f('driver')} placeholder="Driver name" className="full-width" />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Vehicle Details" size="md"
        footer={<Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>}>
        {viewItem && (
          <div className="detail-grid">
            {[['Registration', viewItem.reg], ['Name', viewItem.name], ['Model', viewItem.model], ['Type', viewItem.type], ['Capacity', viewItem.capacity], ['Fuel', viewItem.fuel], ['Odometer', `${Number(viewItem.odometer).toLocaleString()} km`], ['Driver', viewItem.driver], ['Last Service', viewItem.lastService]].map(([k, v]) => (
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
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Vehicle" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Vehicle</Button>
          </>
        }
      >
        <div className="confirm-msg">
          <p>Are you sure you want to delete <strong>{deleteItem?.name}</strong> ({deleteItem?.reg})?</p>
          <p className="text-muted" style={{ marginTop: 8, fontSize: '0.875rem' }}>This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Vehicles;
