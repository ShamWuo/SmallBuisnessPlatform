import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, Send, Copy, Check, MessageSquare, Mail, Sparkles } from 'lucide-react';

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
    }, 1800);
  };

  return (
    <div className="modal-backdrop" onClick={closeActionModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            {actionModal.type === 'owner_email' ? <Mail className="text-warning" size={20} /> : <MessageSquare className="text-accent" size={20} />}
            <span className="modal-title">{actionModal.title}</span>
          </div>
          <button className="btn-icon" onClick={closeActionModal}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="recipient-field">
            <span className="field-label">Recipient Target:</span>
            <span className="field-value">{actionModal.recipient}</span>
          </div>

          <div className="message-field">
            <div className="field-header">
              <span className="field-label">Drafted Message (Copilot AI Generated):</span>
              <button className="btn-copy" onClick={handleCopy}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea
              className="message-textarea"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={6}
            />
          </div>

          {sentSuccess && (
            <div className="send-success-toast">
              <Sparkles size={18} />
              <div>
                <strong>Action Dispatched Successfully!</strong>
                <div>Mocked communication sent to {actionModal.recipient}.</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={closeActionModal}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSendMock} disabled={sentSuccess}>
            <Send size={15} /> {actionModal.type === 'owner_email' ? 'Send Mock Email Alert' : 'Send Mock SMS Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
