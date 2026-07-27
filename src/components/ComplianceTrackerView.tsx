import React from 'react';
import { useSalon } from '../context/SalonContext';
import { ShieldCheck, ShieldAlert, AlertTriangle, Mail, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const ComplianceTrackerView: React.FC = () => {
  const { staffList, healthLogs, complianceSummary, triggerDraftAction } = useSalon();

  return (
    <div>
      <div className="clean-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <div className="card-title">Compliance Hub</div>
          <div className="card-sub">Monitors state board licenses, specialty certificates, and sanitation logs.</div>
        </div>

        <button
          className="btn-blue"
          onClick={() => {
            const urgentItem = complianceSummary.expiringOrExpiredItems[0];
            if (urgentItem) {
              triggerDraftAction('compliance', urgentItem.id);
            } else {
              triggerDraftAction('compliance', 'LIC-101');
            }
          }}
        >
          <Mail size={13} /> Draft Compliance Report
        </button>
      </div>

      {/* Compliance Overview Banner */}
      <div style={{ background: complianceSummary.expiredCount > 0 ? 'var(--status-red-bg)' : 'var(--status-green-bg)', border: `1px solid ${complianceSummary.expiredCount > 0 ? 'rgba(251, 113, 133, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`, borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ color: complianceSummary.expiredCount > 0 ? 'var(--status-red)' : 'var(--status-green)' }}>
          {complianceSummary.expiredCount > 0 ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            Status: {complianceSummary.expiredCount > 0 ? 'Action Required' : 'Fully Compliant'}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            {complianceSummary.expiredCount > 0
              ? `${complianceSummary.expiredCount} expired requirement(s) and ${complianceSummary.expiringSoonCount} expiring within 30 days.`
              : `All ${complianceSummary.totalItems} licenses and logs are valid.`}
          </div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{complianceSummary.healthIndex}%</div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Health Index</div>
        </div>
      </div>

      {/* Staff Licenses Grid */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={16} className="text-blue" /> Staff Licenses & Certifications
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {staffList.map(staff => (
            <div key={staff.id} className="clean-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                <img src={staff.avatarUrl} alt={staff.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{staff.name}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{staff.role}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {staff.licenses.map(lic => (
                  <div key={lic.id} style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{lic.title}</span>
                      <span className={`risk-pill risk-${lic.status.toLowerCase() === 'expired' ? 'high' : lic.status.toLowerCase() === 'expiring_soon' ? 'medium' : 'low'}`}>
                        {lic.status === 'EXPIRED' && <ShieldAlert size={10} />}
                        {lic.status === 'EXPIRING_SOON' && <AlertTriangle size={10} />}
                        {lic.status === 'COMPLIANT' && <CheckCircle2 size={10} />}
                        {lic.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                      <Calendar size={11} /> Expiry: {lic.expiryDate} ({lic.daysUntilExpiry < 0 ? `${Math.abs(lic.daysUntilExpiry)}d overdue` : `${lic.daysUntilExpiry}d left`})
                    </div>

                    {(lic.status === 'EXPIRED' || lic.status === 'EXPIRING_SOON') && (
                      <button
                        className="btn-ghost"
                        style={{ width: '100%', marginTop: '0.4rem', justifyContent: 'center', fontSize: '0.725rem', padding: '0.2rem', color: 'var(--status-red)' }}
                        onClick={() => triggerDraftAction('compliance', lic.id)}
                      >
                        <Mail size={11} /> Draft Renewal Notice
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Safety Section */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FileText size={16} className="text-blue" /> Facility & Health Documents
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {healthLogs.map(log => (
            <div key={log.id} className="clean-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>{log.category}</span>
                <span className={`risk-pill risk-${log.status.toLowerCase() === 'expired' ? 'high' : log.status.toLowerCase() === 'expiring_soon' ? 'medium' : 'low'}`}>
                  {log.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{log.title}</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Staff: {log.responsibleStaff}</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Due: {log.nextRenewalDate} ({log.daysUntilExpiry}d remaining)</div>

              {log.status !== 'COMPLIANT' && (
                <button
                  className="btn-ghost"
                  style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.725rem', padding: '0.2rem', color: 'var(--status-red)' }}
                  onClick={() => triggerDraftAction('compliance', log.id)}
                >
                  <Mail size={11} /> Draft Warning Email
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
