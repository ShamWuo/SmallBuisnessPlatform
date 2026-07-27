import type { StaffMember, HealthSafetyLog, StaffLicense, ComplianceSummary } from '../types';

/**
 * Compliance Tracker Engine
 * Audits staff licenses, certifications, and health & safety logs.
 */
export function calculateComplianceSummary(
  staffList: StaffMember[],
  healthLogs: HealthSafetyLog[]
): ComplianceSummary {
  const currentDate = new Date('2026-07-27');
  let totalItems = 0;
  let compliantCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  const expiringOrExpiredItems: Array<StaffLicense | HealthSafetyLog> = [];

  // 1. Audit Staff Licenses
  staffList.forEach(staff => {
    staff.licenses.forEach(license => {
      totalItems++;
      const expiry = new Date(license.expiryDate);
      const diffTime = expiry.getTime() - currentDate.getTime();
      const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      license.daysUntilExpiry = daysUntilExpiry;

      if (daysUntilExpiry < 0) {
        license.status = 'EXPIRED';
        expiredCount++;
        expiringOrExpiredItems.push(license);
      } else if (daysUntilExpiry <= 30) {
        license.status = 'EXPIRING_SOON';
        expiringSoonCount++;
        expiringOrExpiredItems.push(license);
      } else {
        license.status = 'COMPLIANT';
        compliantCount++;
      }
    });
  });

  // 2. Audit Health & Safety Logs
  healthLogs.forEach(log => {
    totalItems++;
    const renewal = new Date(log.nextRenewalDate);
    const diffTime = renewal.getTime() - currentDate.getTime();
    const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    log.daysUntilExpiry = daysUntilExpiry;

    if (daysUntilExpiry < 0) {
      log.status = 'EXPIRED';
      expiredCount++;
      expiringOrExpiredItems.push(log);
    } else if (daysUntilExpiry <= 30) {
      log.status = 'EXPIRING_SOON';
      expiringSoonCount++;
      expiringOrExpiredItems.push(log);
    } else {
      log.status = 'COMPLIANT';
      compliantCount++;
    }
  });

  const healthIndex = totalItems > 0 ? Math.round((compliantCount / totalItems) * 100) : 100;

  return {
    totalItems,
    compliantCount,
    expiringSoonCount,
    expiredCount,
    healthIndex,
    expiringOrExpiredItems
  };
}
