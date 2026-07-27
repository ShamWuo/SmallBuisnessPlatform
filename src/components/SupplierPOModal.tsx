import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, FileText, Send } from 'lucide-react';

interface SupplierPOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierPOModal: React.FC<SupplierPOModalProps> = ({ isOpen, onClose }) => {
  const { supplyRequirements } = useSalon();
  const [supplierName, setSupplierName] = useState('L’Oréal & Wella Salon Distributors');
  const [distributorEmail, setDistributorEmail] = useState('orders@wellasalonrep.com');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const lowStockItems = supplyRequirements.filter(i => i.reorderQuantity > 0);
  const totalPOAmount = lowStockItems.reduce((sum, i) => sum + i.estimatedCost, 0);

  const handleSendPO = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            <FileText size={16} className="text-blue" /> Generate Supplier Purchase Order (PO)
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '0.2rem' }}>
            <X size={16} />
          </button>
        </div>

        {isSent ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.5rem' }}>
              ✓ Purchase Order PO-2026-884 Sent Successfully!
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Order submitted to {distributorEmail}. Confirmation & shipping tracking pre-filled.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendPO} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
            <div className="form-field">
              <label>Distributor / Supplier Name</label>
              <input
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Distributor Sales Rep Email</label>
              <input
                type="email"
                value={distributorEmail}
                onChange={e => setDistributorEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
                Auto-Calculated Inventory Order Items
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {lowStockItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                    <span>{item.itemName} (+{item.reorderQuantity} {item.unit})</span>
                    <strong style={{ color: 'var(--accent-blue)' }}>${item.estimatedCost}</strong>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span>Total PO Cost:</span>
                  <span style={{ color: '#22c55e' }}>${totalPOAmount}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-blue">
                <Send size={13} /> Submit Purchase Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
