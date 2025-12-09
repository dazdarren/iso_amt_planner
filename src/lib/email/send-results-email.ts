import { Resend } from 'resend';
import { render } from '@react-email/components';
import { ResultsEmailTemplate } from './results-email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PurchaseSession {
  id: string;
  email: string;
  taxYear: number;
  maxShares: number;
  isoStrike: number;
  projectedAmt: number;
  targetAmtBudget: number;
}

export async function sendResultsEmail(session: PurchaseSession): Promise<boolean> {
  try {
    const cashRequired = session.maxShares * session.isoStrike;

    // Render the email template
    const emailHtml = render(
      ResultsEmailTemplate({
        email: session.email,
        sessionId: session.id,
        taxYear: session.taxYear,
        maxShares: session.maxShares,
        cashRequired,
        projectedAmt: session.projectedAmt,
        targetAmtBudget: session.targetAmtBudget,
      })
    );

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'ISO AMT Planner <onboarding@resend.dev>',
      to: [session.email],
      subject: `Your ISO AMT Exercise Plan is Ready - ${session.taxYear}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return false;
    }

    console.log('Email sent successfully:', data?.id);
    return true;

  } catch (error) {
    console.error('Error sending results email:', error);
    return false;
  }
}
