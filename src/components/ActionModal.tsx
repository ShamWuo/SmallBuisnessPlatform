import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, Send, Copy, Check, MessageSquare, Mail } from 'lucide-react';

export const ActionModal: React.FC = () => {
  const { actionModal, closeActionModal } = useSalon();
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [messageText, setMessageText] = useState(actionModal.messageContent);

  React.useEffect(() => {
    setMessageText(actionModal.messageContent);
    setSentSuccess(false);
    setCopied(false);
  }, [actionModal]);

  if (!actionModal.isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMock = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      closeActionModal();
    }, 1600);
  };

  return (
    <div className="modal-overlay" onClick={closeActionModal}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {actionModal.type === 'owner_email' ? <Mail size={16} className="text-amber" /> : <MessageSquare size={16} className="text-blue" />}
            <span>{actionModal.title}</span>
          </div>
          <button className="btn-ghost" style={{ padding: '0.2rem 0.4rem' }} onClick={closeActionModal}>
            <X size={15} />
          </button>
        </div>

        <div className="modal-content-body">
          <div style={{ background: 'var(--bg-input)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.775rem', marginBottom: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target: </span>
            <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{actionModal.recipient}</span>
          </div>

          <div className="form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label>Drafted Message:</label>
              <button className="btn-ghost" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }} onClick={handleCopy}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={5}
            />
          </div>

          {sentSuccess && (
            <div style={{ background: 'var(--status-green-bg)', border: '1px solid rgba(52, 211, 153, 0.3)', color: 'var(--status-green)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.775rem', marginTop: '0.5rem' }}>
              Message dispatched to {actionModal.recipient}
            </div>
          )}
        </div>

        <div className="modal-foot">
          <button className="btn-ghost" onClick={closeActionModal}>Cancel</button>
          <button className="btn-blue" onClick={handleSendMock} disabled={sentSuccess}>
            <Send size={13} /> {actionModal.type === 'owner_email' ? 'Send Email' : 'Send SMS'}
          </button>
        </div>
      </div>
    </div>
  );
};
