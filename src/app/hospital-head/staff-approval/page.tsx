'use client';

import { useEffect, useState } from 'react';
import { hospitalApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Button, StatusBadge } from '@/components/ui';
import { 
  ShieldCheck, RefreshCw, Plus, UserPlus, Trash2, Mail, Phone, 
  Briefcase, CheckCircle2, AlertCircle, FileUp, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StaffMember {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  employeeCode?: string;
  active: boolean;
  documents?: {
    id: number;
    documentType: string;
    documentUrl: string;
    verified: boolean;
  }[];
}

const ROLE_OPTIONS = [
  { value: 'NURSE', label: 'Nurse (RN/RM)' },
  { value: 'HELPER', label: 'Helper / Ward Attendant' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
  { value: 'LAB_ASSISTANT', label: 'Lab Assistant / Technician' },
  { value: 'DOCTOR', label: 'In-house Doctor' },
];

export default function HospitalHeadStaffManagementPage() {
  const { user } = useAuthStore();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'NURSE',
    department: 'General Ward',
    employeeCode: '',
  });

  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : 1;

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await hospitalApi.getStaff(hospitalId);
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Unable to load hospital staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [user?.hospitalId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please enter full name, email, and mobile number');
      return;
    }

    setAdding(true);
    try {
      await hospitalApi.addStaff(hospitalId, formData);
      toast.success('Staff member registered successfully!');
      setShowAddModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'NURSE',
        department: 'General Ward',
        employeeCode: '',
      });
      loadStaff();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add staff member');
    } finally {
      setAdding(false);
    }
  };

  const handleDeactivate = async (staffId: number) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;
    try {
      await hospitalApi.deactivateStaff(hospitalId, staffId);
      toast.success('Staff member status updated');
      loadStaff();
    } catch {
      toast.error('Failed to update staff status');
    }
  };

  const FILTER_ROLES = [
    { label: 'All Members', value: 'ALL' },
    { label: 'Nurses', value: 'NURSE' },
    { label: 'Helpers', value: 'HELPER' },
    { label: 'Receptionists', value: 'RECEPTIONIST' },
    { label: 'Doctors', value: 'DOCTOR' },
    { label: 'Lab Assistants', value: 'LAB_ASSISTANT' },
  ];

  const filteredStaff = staffList.filter((m) => {
    const matchesFilter = selectedFilter === 'ALL' || m.role === selectedFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      m.fullName.toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) || 
      m.role.toLowerCase().includes(q) || 
      (m.department && m.department.toLowerCase().includes(q)) || 
      (m.employeeCode && m.employeeCode.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Staff & Member Management" subtitle="Manage hospital staff, nurses, helpers, and technicians">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top bar with Add Member Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <div>
            <h2 className="text-heading font-bold text-primary-light flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-sky-400" />
              Hospital Staff Directory
            </h2>
            <p className="text-body text-primary-light/60 mt-1">
              Add and manage receptionists, nurses, helpers, lab assistants, and residential medical staff.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={loadStaff} className="flex items-center gap-2">
              <RefreshCw size={15} /> Refresh
            </Button>
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white">
              <UserPlus size={16} /> Add Member
            </Button>
          </div>
        </div>

        {/* Search and Role Filter Chips */}
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 space-y-3">
          <input
            type="text"
            placeholder="Search by name, email, role, department or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-4 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:outline-none focus:border-sky-400"
          />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {FILTER_ROLES.map((f) => {
              const active = selectedFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setSelectedFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    active 
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' 
                      : 'bg-surface-10 text-primary-light/60 hover:text-primary-light border border-tonal-20/40'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Staff Table / List */}
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <h3 className="text-subheading font-semibold text-primary-light mb-4">
            Active Members ({filteredStaff.length})
          </h3>

          {loading ? (
            <div className="py-12 text-center text-primary-light/60">Loading staff records...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-12 text-center text-primary-light/60">
              No staff members found matching criteria. Click &quot;Add Member&quot; to register new staff.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStaff.map((member) => (
                <div key={member.id} className="p-5 bg-surface-10/70 border border-tonal-20/40 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-primary-light text-base">{member.fullName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-400 border border-sky-500/30">
                          {member.role}
                        </span>
                        {member.department && (
                          <span className="text-xs text-primary-light/50">
                            Dept: {member.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={member.active ? 'ACTIVE' : 'INACTIVE'} />
                  </div>

                  <div className="space-y-1 text-xs text-primary-light/70 pt-2 border-t border-tonal-20/30">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-primary-light/40" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-primary-light/40" />
                      <span>{member.phone}</span>
                    </div>
                    {member.employeeCode && (
                      <div className="text-primary-light/50">
                        Employee ID: {member.employeeCode}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeactivate(member.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={13} /> {member.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regulatory Info Card */}
        <div className="rounded-card border border-sky-500/25 bg-sky-500/[0.06] p-5 flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 text-sky-400 shrink-0" />
          <div className="text-xs leading-5 text-primary-light/70 space-y-1">
            <p className="font-semibold text-primary-light text-sm">Regulatory Compliance Documentation</p>
            <p>
              In accordance with the Clinical Establishment Act and National Nursing Regulations, each registered staff member (Nurse, Helper, Lab Assistant, Receptionist) must have valid identification and council accreditation proofs uploaded.
            </p>
          </div>
        </div>

      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-20 border border-tonal-20 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-tonal-20/50">
              <h3 className="text-lg font-bold text-primary-light flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-sky-400" />
                Add Staff Member
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-primary-light/60 hover:text-primary-light">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary-light/80 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-3 py-2 text-sm text-primary-light focus:outline-none focus:border-sky-400"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-light/80 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-3 py-2 text-sm text-primary-light focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-light/80 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-3 py-2 text-sm text-primary-light focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-light/80 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+919876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-3 py-2 text-sm text-primary-light focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-light/80 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. ICU / OPD / Pediatrics"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-3 py-2 text-sm text-primary-light focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-light/80 mb-1">Employee Code / ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-1042"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full bg-surface-10 border border-tonal-20/60 rounded-xl px-3 py-2 text-sm text-primary-light focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-tonal-20/40">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={adding} className="bg-sky-500 hover:bg-sky-600 text-white">
                  {adding ? 'Registering...' : 'Save Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}