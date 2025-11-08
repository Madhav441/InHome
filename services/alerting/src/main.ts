import EventEmitter from 'eventemitter3';
import nodemailer from 'nodemailer';

const events = new EventEmitter();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'localhost',
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false
});

export interface AlertEvent {
  id: string;
  orgId: string;
  profileId: string;
  summary: string;
  severity: 'low' | 'medium' | 'high';
}

events.on('alert', async (alert: AlertEvent) => {
  console.log('Dispatching alert', alert);
  if (process.env.SMTP_HOST) {
    await transporter.sendMail({
      from: 'Sentinel AU <alerts@sentinel.au>',
      to: 'demo@example.com',
      subject: `[Sentinel AU] ${alert.severity.toUpperCase()} alert`,
      text: alert.summary
    });
  }
});

console.log('Alerting service initialised. Awaiting events…');

// Demo trigger
setTimeout(() => {
  events.emit('alert', {
    id: 'alert-demo',
    orgId: 'org-demo',
    profileId: 'profile-maya',
    summary: 'Seeded demo alert: potential self-harm keyword detected',
    severity: 'high'
  });
}, 1_000);
