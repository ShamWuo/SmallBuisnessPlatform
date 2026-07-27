import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import type { CampaignType, CustomerSegmentType } from '../types';
import { X, Sparkles, Send } from 'lucide-react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose }) => {
  const { addCampaign } = useSalon();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CampaignType>('Off-Peak Filler');
  const [targetSegment, setTargetSegment] = useState<CustomerSegmentType | 'All'>('All');
  const [channel, setChannel] = useState<'SMS' | 'Email' | 'Both'>('SMS');
  const [discountOffer, setDiscountOffer] = useState('20% OFF Any Service');
  const [messageText, setMessageText] = useState(
    '✨ Luxe & Glow Flash Perk: Book any haircut or facial this Tuesday morning between 9am-12pm & enjoy 20% OFF! Reply YES to claim your spot.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      title: title || `AI Campaign: ${type}`,
      type,
      targetSegment,
      channel,
      discountOffer,
      status: 'Active',
      messageText
    });
    onClose();
  };

  const handleTypeChange = (newType: CampaignType) => {
    setType(newType);
    if (newType === 'Off-Peak Filler') {
      setTitle('Slow Tuesday Morning Fill-Up');
      setMessageText('✨ Luxe & Glow Flash Perk: Book any haircut or facial this Tuesday morning between 9am-12pm & enjoy 20% OFF! Reply YES to claim your spot.');
    } else if (newType === 'At-Risk Win-Back') {
      setTitle('At-Risk Client VIP Win-Back');
      setMessageText('🌸 We miss you at Luxe & Glow! We saved a complimentary $45 Deep Keratin Hair Treatment for your next appointment this month. Book today with code WELCOME45.');
    } else if (newType === 'VIP Loyalty Reward') {
      setTitle('VIP Exclusive Perk');
      setMessageText('👑 As one of our top valued clients at Luxe & Glow, enjoy an exclusive 25% reward on your next visit. Thank you for your loyalty!');
    } else if (newType === 'Rainy Day Special') {
      setTitle('Rainy Day Pamper Special');
      setMessageText('🌧️ Rainy day special! Warm up with our HydraFacial & Scalp Massage package today with a bonus $25 voucher. Slots open now!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            <Sparkles size={16} className="text-blue" /> Create AI Marketing Campaign
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '0.2rem' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
          <div className="form-field">
            <label>Campaign Objective Type</label>
            <select value={type} onChange={e => handleTypeChange(e.target.value as CampaignType)}>
              <option value="Off-Peak Filler">Off-Peak Filler (Boost Slow Hours)</option>
              <option value="At-Risk Win-Back">At-Risk Client Win-Back (Prevent Churn)</option>
              <option value="VIP Loyalty Reward">VIP Loyalty Reward (Reward High LTV)</option>
              <option value="Rainy Day Special">Rainy Day Special (Weather Surge)</option>
            </select>
          </div>

          <div className="form-field">
            <label>Campaign Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Tuesday Morning 20% OFF Push"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-field">
              <label>Target Customer Segment</label>
              <select value={targetSegment} onChange={e => setTargetSegment(e.target.value as any)}>
                <option value="All">All Active Clients</option>
                <option value="At-Risk">At-Risk / Churning</option>
                <option value="VIP Champions">VIP Champions</option>
                <option value="New Opportunities">New Opportunities</option>
              </select>
            </div>

            <div className="form-field">
              <label>Delivery Channel</label>
              <select value={channel} onChange={e => setChannel(e.target.value as any)}>
                <option value="SMS">SMS Text Message</option>
                <option value="Email">Email Broadcast</option>
                <option value="Both">Both (SMS + Email)</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Discount / Perk Offer</label>
            <input
              type="text"
              value={discountOffer}
              onChange={e => setDiscountOffer(e.target.value)}
              placeholder="e.g. 20% OFF or Free Keratin Mask"
            />
          </div>

          <div className="form-field">
            <label>AI Message Content Draft</label>
            <textarea
              rows={3}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-blue">
              <Send size={13} /> Launch Campaign Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
