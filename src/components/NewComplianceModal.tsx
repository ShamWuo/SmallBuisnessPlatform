import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, ShieldCheck } from 'lucide-react';

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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={20} />
            <span className="modal-title">Add Compliance / License Record</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-stacked">
          <div className="form-group">
            <label>Record Category:</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)}>
              <option value="License">Staff State Board License</option>
              <option value="Certification">Staff Specialty Certificate</option>
              <option value="Health & Safety">Facility Health & Sanitation Log</option>
              <option value="Insurance">Business Liability Insurance</option>
            </select>
          </div>

          {(category === 'License' || category === 'Certification') && (
            <div className="form-group">
              <label>Staff Member:</label>
              <select value={staffId} onChange={e => setStaffId(e.target.value)}>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Title / Requirement Name:</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Master Cosmetology License"
            />
          </div>

          <div className="form-group">
            <label>License / Policy Number:</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={e => setLicenseNumber(e.target.value)}
              placeholder="e.g. LIC-99182"
            />
          </div>

          <div className="form-group">
            <label>Expiration / Renewal Date:</label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="modal-footer mt-4">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
