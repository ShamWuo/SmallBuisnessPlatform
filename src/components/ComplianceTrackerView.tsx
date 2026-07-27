import React from 'react';
import { useSalon } from '../context/SalonContext';
import { ShieldCheck, ShieldAlert, AlertTriangle, Mail, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const ComplianceTrackerView: React.FC = () => {
  const { staffList, healthLogs, complianceSummary, triggerDraftAction } = useSalon();

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2>Compliance & License Tracker</h2>
          <p className="view-description">
            Monitors cosmetology licenses, specialty certifications, health inspection logs, and insurance renewal dates.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            const urgentItem = complianceSummary.expiringOrExpiredItems[0];
            if (urgentItem) {
              triggerDraftAction('compliance', urgentItem.id);
            } else {
              triggerDraftAction('compliance', 'LIC-101');
            }
          }}
        >
          <Mail size={16} /> Draft Owner Compliance Report
        </button>
      </div>

      {/* Compliance Overview Banner */}
      <div className={`compliance-status-banner banner-${complianceSummary.expiredCount > 0 ? 'expired' : 'compliant'}`}>
        <div className="banner-icon">
          {complianceSummary.expiredCount > 0 ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
        </div>
        <div className="banner-content">
          <h3>
            Current Status: {complianceSummary.expiredCount > 0 ? 'Action Required (Non-Compliant Items Found)' : 'Fully Compliant'}
          </h3>
          <p>
            {complianceSummary.expiredCount > 0
              ? `We have ${complianceSummary.expiredCount} expired requirement(s) and ${complianceSummary.expiringSoonCount} expiring within 30 days. Immediate renewal required for legal operations.`
              : `All ${complianceSummary.totalItems} tracked state board licenses and facility safety logs are active and valid.`}
          </p>
        </div>
        <div className="banner-metric">
          <div className="metric-score">{complianceSummary.healthIndex}%</div>
          <div className="metric-label">Health Index</div>
        </div>
      </div>

      {/* Staff Licenses Section */}
      <div className="section-block">
        <div className="section-title">
          <ShieldCheck size={18} /> Staff Licenses & Certifications
        </div>

        <div className="staff-grid">
          {staffList.map(staff => (
            <div key={staff.id} className="staff-card">
              <div className="staff-profile">
                <img src={staff.avatarUrl} alt={staff.name} className="staff-avatar" />
                <div>
                  <div className="staff-name">{staff.name}</div>
                  <div className="staff-role">{staff.role}</div>
                </div>
              </div>

              <div className="staff-licenses-list">
                {staff.licenses.map(lic => (
                  <div key={lic.id} className={`license-item lic-status-${lic.status.toLowerCase()}`}>
                    <div className="lic-header">
                      <span className="lic-title">{lic.title}</span>
                      <span className={`status-badge status-${lic.status.toLowerCase()}`}>
                        {lic.status === 'EXPIRED' && <ShieldAlert size={12} />}
                        {lic.status === 'EXPIRING_SOON' && <AlertTriangle size={12} />}
                        {lic.status === 'COMPLIANT' && <CheckCircle2 size={12} />}
                        {lic.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="lic-meta">
                      <span>Ref: <strong>{lic.licenseNumber}</strong></span>
                      <span>Issuer: {lic.issuingAuthority}</span>
                    </div>

                    <div className="lic-expiry">
                      <Calendar size={13} /> Expiry: {lic.expiryDate}
                      <span className="expiry-days">
                        ({lic.daysUntilExpiry < 0 ? `${Math.abs(lic.daysUntilExpiry)} days ago` : `in ${lic.daysUntilExpiry} days`})
                      </span>
                    </div>

                    {(lic.status === 'EXPIRED' || lic.status === 'EXPIRING_SOON') && (
                      <button
                        className="btn-renew-alert"
                        onClick={() => triggerDraftAction('compliance', lic.id)}
                      >
                        <Mail size={13} /> Draft Renewal Notice
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility & Health Documentation Section */}
      <div className="section-block mt-6">
        <div className="section-title">
          <FileText size={18} /> Health, Safety & Insurance Documentation
        </div>

        <div className="logs-grid">
          {healthLogs.map(log => (
            <div key={log.id} className={`log-card log-status-${log.status.toLowerCase()}`}>
              <div className="log-header">
                <div>
                  <span className="log-category-badge">{log.category}</span>
                  <div className="log-title">{log.title}</div>
                </div>
                <span className={`status-badge status-${log.status.toLowerCase()}`}>
                  {log.status === 'EXPIRED' && <ShieldAlert size={12} />}
                  {log.status === 'EXPIRING_SOON' && <AlertTriangle size={12} />}
                  {log.status === 'COMPLIANT' && <CheckCircle2 size={12} />}
                  {log.status.replace('_', ' ')}
                </span>
              </div>

              <div className="log-body">
                <div>Responsible: <strong>{log.responsibleStaff}</strong></div>
                <div>Last Inspected: {log.lastInspectedDate}</div>
                <div>Renewal Due: <strong>{log.nextRenewalDate}</strong> ({log.daysUntilExpiry} days remaining)</div>
                <div className="doc-ref">File: {log.documentRef}</div>
              </div>

              {log.status !== 'COMPLIANT' && (
                <button
                  className="btn-renew-alert mt-2"
                  onClick={() => triggerDraftAction('compliance', log.id)}
                >
                  <Mail size={13} /> Draft Warning Email
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
