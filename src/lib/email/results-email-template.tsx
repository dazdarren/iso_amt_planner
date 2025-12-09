import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ResultsEmailProps {
  email: string;
  sessionId: string;
  taxYear: number;
  maxShares: number;
  cashRequired: number;
  projectedAmt: number;
  targetAmtBudget: number;
}

export const ResultsEmailTemplate: React.FC<ResultsEmailProps> = ({
  email,
  sessionId,
  taxYear,
  maxShares,
  cashRequired,
  projectedAmt,
  targetAmtBudget,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resultsUrl = `${baseUrl}/success?session_id=${sessionId}`;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <Html>
      <Head />
      <Preview>Your ISO AMT Exercise Plan is Ready - {maxShares} shares recommended</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Your ISO AMT Exercise Plan is Ready!</Heading>
            <Text style={subtitle}>
              Tax Year {taxYear} Analysis Complete
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>
              Thank you for using the ISO AMT Exercise Planner. Your personalized analysis is complete.
            </Text>

            {/* Key Results Box */}
            <Section style={resultsBox}>
              <Heading as="h2" style={h2}>
                Recommended Exercise Plan
              </Heading>

              <Section style={resultRow}>
                <Text style={resultLabel}>Maximum Shares to Exercise:</Text>
                <Text style={resultValue}>{formatNumber(maxShares)} shares</Text>
              </Section>

              <Section style={resultRow}>
                <Text style={resultLabel}>Cash Required:</Text>
                <Text style={resultValue}>{formatCurrency(cashRequired)}</Text>
              </Section>

              <Section style={resultRow}>
                <Text style={resultLabel}>Projected AMT:</Text>
                <Text style={resultValue}>{formatCurrency(projectedAmt)}</Text>
              </Section>

              <Section style={resultRow}>
                <Text style={resultLabel}>AMT Budget Usage:</Text>
                <Text style={resultValue}>
                  {Math.round((projectedAmt / targetAmtBudget) * 100)}% of {formatCurrency(targetAmtBudget)}
                </Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={resultsUrl}>
                View Full Results & Download PDF
              </Button>
            </Section>

            <Text style={text}>
              Your complete analysis includes:
            </Text>
            <ul style={list}>
              <li style={listItem}>Optimal exercise strategy</li>
              <li style={listItem}>Alternative scenarios (Conservative, Moderate, Aggressive)</li>
              <li style={listItem}>Sensitivity analysis for FMV changes</li>
              <li style={listItem}>Professional CPA Pack PDF report</li>
            </ul>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Important:</strong> This analysis is for informational purposes only and does not constitute
              tax, legal, or financial advice. Please consult with a qualified tax professional before making any
              exercise decisions.
            </Text>
            <Text style={footerText}>
              Questions? Reply to this email or visit our website for more information.
            </Text>
            <Text style={footerTextSmall}>
              ISO AMT Exercise Planner • Report ID: {sessionId}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResultsEmailTemplate;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 40px',
  backgroundColor: '#4F46E5',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  padding: '0',
  lineHeight: '1.3',
};

const h2 = {
  color: '#1E293B',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const subtitle = {
  color: '#E0E7FF',
  fontSize: '14px',
  margin: '0',
};

const content = {
  padding: '0 40px',
};

const text = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
};

const resultsBox = {
  backgroundColor: '#F8FAFC',
  border: '2px solid #E2E8F0',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const resultRow = {
  margin: '12px 0',
};

const resultLabel = {
  color: '#64748B',
  fontSize: '14px',
  margin: '0 0 4px',
};

const resultValue = {
  color: '#1E293B',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const list = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
  paddingLeft: '20px',
};

const listItem = {
  margin: '8px 0',
};

const hr = {
  borderColor: '#E2E8F0',
  margin: '32px 0',
};

const footer = {
  padding: '0 40px',
};

const footerText = {
  color: '#64748B',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '8px 0',
};

const footerTextSmall = {
  color: '#94A3B8',
  fontSize: '11px',
  lineHeight: '16px',
  margin: '16px 0 0',
  textAlign: 'center' as const,
};
