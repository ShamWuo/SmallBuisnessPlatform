import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X } from 'lucide-react';

interface NewComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewComplianceModal: React.FC<NewComplianceModalProps> = ({ isOpen, onClose }) => {
  const { staffList, addComplianceItem } = useSalon();

  const [staffId, setStaffId] = useState(staffList[0]?.id || '');
  const [title, setTitle] = useState('Cosmetology License Renewal');
  const [category, setCategory] = useState<'License' | 'Certification' | 'Health & Safety' | 'Insurance'>('License');
  const [expiryDate, setExpiryDate] = useState('2027-08-30');
  const [licenseNumber, setLicenseNumber] = useState('COS-99482-NY');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComplianceItem({
      staffId: category === 'License' || category === 'Certification' ? staffId : undefined,
      title,
      category,
      expiryDate,
      licenseNumber
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span>Add License or Compliance Log</span>
          <button className="btn-ghost" style={{ padding: '0.2rem 0.4rem' }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-body">
          <div className="form-field">
            <label>Category:</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)}>
              <option value="License">Staff License</option>
              <option value="Certification">Staff Specialty Certificate</option>
              <option value="Health & Safety">Facility Health & Sanitation</option>
              <option value="Insurance">Business Liability Insurance</option>
            </select>
          </div>

          {(category === 'License' || category === 'Certification') && (
            <div className="form-field">
              <label>Staff Member:</label>
              <select value={staffId} onChange={e => setStaffId(e.target.value)}>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-field">
            <label>Title / Requirement Name:</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Cosmetology License"
            />
          </div>

          <div className="form-field">
            <label>License or Document Reference Number:</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={e => setLicenseNumber(e.target.value)}
              placeholder="e.g. COS-99482-NY"
            />
          </div>

          <div className="form-field">
            <label>Expiration / Renewal Date:</label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="modal-foot" style={{ padding: 0, marginTop: '1rem', background: 'transparent', border: 'none' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-blue">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};
