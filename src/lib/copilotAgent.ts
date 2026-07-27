import type { Appointment, StaffMember, HealthSafetyLog, ChatMessage, StaffLicense } from '../types';
import { scoreAppointment } from './scoringEngine';
import { calculateComplianceSummary } from './complianceEngine';

export interface CopilotContext {
  appointments: Appointment[];
  staffList: StaffMember[];
  healthLogs: HealthSafetyLog[];
}

/**
 * Agent Tool 1: score_appointment(appointment_id)
 */
export function toolScoreAppointment(appointmentId: string, appointments: Appointment[]) {
  const apt = appointments.find(a => a.id.toLowerCase() === appointmentId.toLowerCase() || a.clientName.toLowerCase().includes(appointmentId.toLowerCase()));
  if (!apt) {
    return null;
  }
  const result = scoreAppointment(apt);
  return { appointment: apt, result };
}

/**
 * Agent Tool 2: get_upcoming_risks()
 */
export function toolGetUpcomingRisks(appointments: Appointment[]) {
  const scored = appointments.map(apt => ({
    appointment: apt,
    result: scoreAppointment(apt)
  }));

  // Sort by risk score descending
  scored.sort((a, b) => b.result.score - a.result.score);
  const highAndMedRisks = scored.filter(item => item.result.tier === 'High' || item.result.tier === 'Medium');

  return highAndMedRisks;
}

/**
 * Agent Tool 3: check_compliance_status()
 */
export function toolCheckComplianceStatus(staffList: StaffMember[], healthLogs: HealthSafetyLog[]) {
  return calculateComplianceSummary(staffList, healthLogs);
}

/**
 * Agent Tool 4: draft_reminder(target_id)
 */
export function toolDraftReminder(targetId: string, context: CopilotContext): { title: string; recipient: string; text: string; type: 'sms_reminder' | 'deposit_request' | 'owner_email'; targetId?: string } {
  // Check if target is an appointment or a client name
  const apt = context.appointments.find(a => a.id.toLowerCase() === targetId.toLowerCase() || a.clientName.toLowerCase().includes(targetId.toLowerCase()));
  
  if (apt) {
    const risk = scoreAppointment(apt);
    if (risk.tier === 'High' && apt.servicePrice >= 100) {
      return {
        type: 'deposit_request',
        title: `Deposit Request for ${apt.clientName}`,
        recipient: `${apt.clientName} (${apt.clientPhone})`,
        text: `Hi ${apt.clientName}! This is Luxe & Glow Salon. We're excited for your upcoming ${apt.serviceName} on ${apt.dayOfWeek} at ${apt.appointmentTime}. To hold your reserved slot, please submit a quick $30 deposit here: https://luxeglow.salon/deposit/${apt.id}. Reply STOP to cancel.`,
        targetId: apt.id
      };
    } else {
      return {
        type: 'sms_reminder',
        title: `SMS Confirmation for ${apt.clientName}`,
        recipient: `${apt.clientName} (${apt.clientPhone})`,
        text: `Hi ${apt.clientName}, your appointment for ${apt.serviceName} at Luxe & Glow is scheduled for ${apt.dayOfWeek} at ${apt.appointmentTime}. Please reply YES to confirm or CANCEL to reschedule.`,
        targetId: apt.id
      };
    }
  }

  // Check if target is a staff license or health item
  const summary = calculateComplianceSummary(context.staffList, context.healthLogs);
  const item = summary.expiringOrExpiredItems.find(i => i.id.toLowerCase() === targetId.toLowerCase() || ('staffName' in i && i.staffName.toLowerCase().includes(targetId.toLowerCase())));

  if (item) {
    const isLicense = 'staffName' in item;
    const itemName = isLicense ? (item as StaffLicense).title : (item as HealthSafetyLog).title;
    const targetName = isLicense ? (item as StaffLicense).staffName : (item as HealthSafetyLog).responsibleStaff;
    const expDate = 'expiryDate' in item ? item.expiryDate : (item as HealthSafetyLog).nextRenewalDate;

    return {
      type: 'owner_email',
      title: `Compliance Renewal Warning: ${itemName}`,
      recipient: `Salon Owner (owner@luxeglow.com)`,
      text: `URGENT COMPLIANCE ALERT:\n\nRequirement: ${itemName}\nResponsible: ${targetName}\nStatus: ${item.status}\nExpiry Date: ${expDate}\n\nPlease reach out to ${targetName} immediately to secure updated state board documentation and remain fully compliant.`,
      targetId: item.id
    };
  }

  // Default fallback draft
  return {
    type: 'sms_reminder',
    title: `General Salon Notification`,
    recipient: `Client (555-0199)`,
    text: `Hi from Luxe & Glow Salon! Your appointment is coming up soon. Please contact front desk if you need to adjust your time!`,
    targetId: 'APT-101'
  };
}

/**
 * Main Natural Language Copilot Router
 */
export function handleCopilotQuery(prompt: string, context: CopilotContext): ChatMessage {
  const p = prompt.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgId = `msg-${Date.now()}`;

  // Query Intent 1: Check compliance / are we compliant
  if (p.includes('compliant') || p.includes('compliance') || p.includes('license') || p.includes('expired') || p.includes('cert')) {
    const summary = toolCheckComplianceStatus(context.staffList, context.healthLogs);
    
    let text = `I checked our salon compliance records across ${summary.totalItems} requirements. Our overall **Compliance Health Index is ${summary.healthIndex}%**.`;
    if (summary.expiredCount > 0 || summary.expiringSoonCount > 0) {
      text += `\n\n⚠️ **Attention Required**: We have **${summary.expiredCount} expired item(s)** and **${summary.expiringSoonCount} item(s) expiring within 30 days**.`;
    } else {
      text += `\n\n✅ All staff licenses and health & safety certifications are fully up to date!`;
    }

    return {
      id: msgId,
      sender: 'copilot',
      text,
      timestamp,
      toolCallName: 'check_compliance_status()',
      actionCard: {
        type: 'compliance_alert',
        title: `Compliance Status (${summary.healthIndex}%)`,
        payload: summary
      }
    };
  }

  // Query Intent 2: Specific client/appointment risk analysis ("why is Sarah high risk?")
  const clientMatch = context.appointments.find(a => p.includes(a.clientName.toLowerCase().split(' ')[0]) || p.includes(a.id.toLowerCase()));
  if (clientMatch || p.includes('why') || p.includes('score') || p.includes('reason') || p.includes('risk for')) {
    const targetApt = clientMatch || context.appointments[0];
    const scoreRes = toolScoreAppointment(targetApt.id, context.appointments);
    
    if (scoreRes && scoreRes.result && scoreRes.appointment) {
      const r = scoreRes.result;
      const apt = scoreRes.appointment;
      const topFactors = r.factors.slice(0, 3).map(f => `• **${f.title}**: ${f.description}`).join('\n');
      const responseText = `Here is the No-Show Risk Analysis for **${apt.clientName}** (${apt.serviceName}):\n\n` +
        `• **Risk Score**: **${r.score}/100** (${r.tier} Risk)\n` +
        `• **Estimated Loss Exposure**: $${r.estimatedLossRisk}\n\n` +
        `**Key Risk Factors**:\n${topFactors}\n\n` +
        `💡 **Recommended Action**: ${r.suggestedActionLabel} (${r.suggestedActionDescription})`;

      return {
        id: msgId,
        sender: 'copilot',
        text: responseText,
        timestamp,
        toolCallName: `score_appointment('${apt.id}')`,
        actionCard: {
          type: 'appointment_risk',
          title: `Risk Analysis: ${apt.clientName}`,
          payload: { appointment: apt, result: r }
        }
      };
    }
  }

  // Query Intent 3: Upcoming risks / high risk bookings list
  if (p.includes('risk') || p.includes('no-show') || p.includes('upcoming') || p.includes('who') || p.includes('today') || p.includes('list')) {
    const risks = toolGetUpcomingRisks(context.appointments);
    const highRisks = risks.filter(r => r.result.tier === 'High');
    
    let text = `I scanned upcoming appointments against our No-Show Predictor model. Found **${risks.length} at-risk appointment(s)** (${highRisks.length} High Risk, ${risks.length - highRisks.length} Medium Risk).`;
    
    if (highRisks.length > 0) {
      text += `\n\n🔥 **Highest Priority No-Show Risk**:`;
      highRisks.slice(0, 3).forEach(({ appointment, result }) => {
        text += `\n• **${appointment.clientName}** (${appointment.appointmentTime}) — Risk Score: **${result.score}/100** | Action: *${result.suggestedActionLabel}*`;
      });
    }

    return {
      id: msgId,
      sender: 'copilot',
      text,
      timestamp,
      toolCallName: 'get_upcoming_risks()',
      actionCard: {
        type: 'general_summary',
        title: `Upcoming Risk Summary (${risks.length} Flagged)`,
        payload: risks
      }
    };
  }

  // Query Intent 4: Draft reminder / SMS / Email
  if (p.includes('draft') || p.includes('reminder') || p.includes('sms') || p.includes('email') || p.includes('send')) {
    const targetApt = context.appointments.find(a => p.includes(a.clientName.toLowerCase().split(' ')[0])) || context.appointments[0];
    const draft = toolDraftReminder(targetApt.id, context);

    return {
      id: msgId,
      sender: 'copilot',
      text: `I've drafted a communication based on our copilot recommendation for **${draft.recipient}**:`,
      timestamp,
      toolCallName: `draft_reminder('${targetApt.id}')`,
      actionCard: {
        type: 'draft_preview',
        title: draft.title,
        payload: draft
      }
    };
  }

  // Default Copilot response
  return {
    id: msgId,
    sender: 'copilot',
    text: `Hello! I'm your **Front Desk Copilot**. I analyze appointment no-show risks in real-time and audit staff & facility compliance.\n\nHere are quick actions you can ask me:\n• *"Which appointments have high no-show risk today?"*\n• *"Why is Jessica Miller's appointment high risk?"*\n• *"Are we compliant right now?"*\n• *"Draft a deposit request for the highest risk appointment."*`,
    timestamp
  };
}
