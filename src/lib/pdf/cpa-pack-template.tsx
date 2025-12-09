import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface PurchaseSession {
  id: string;
  email: string;
  taxYear: number;
  filingStatus: string;
  ordinaryIncome: number;
  itemizedDeductions: number;
  isoStrike: number;
  isoFmv: number;
  totalSharesAvailable: number;
  targetAmtBudget: number;
  maxShares: number;
  projectedAmt: number;
  projectedTotalTax: number;
  bargainElement: number;
  tile25Shares: number | null;
  tile25Cash: number | null;
  tile25Bargain: number | null;
  tile25Amt: number | null;
  tile50Shares: number | null;
  tile50Cash: number | null;
  tile50Bargain: number | null;
  tile50Amt: number | null;
  tile100Shares: number | null;
  tile100Cash: number | null;
  tile100Bargain: number | null;
  tile100Amt: number | null;
  sensitivityDownFmv: number | null;
  sensitivityDownShares: number | null;
  sensitivityUpFmv: number | null;
  sensitivityUpShares: number | null;
  paidAt: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #4F46E5',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 3,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    backgroundColor: '#F1F5F9',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '50%',
    color: '#475569',
    fontSize: 10,
  },
  value: {
    width: '50%',
    fontWeight: 'bold',
    color: '#1E293B',
    fontSize: 10,
  },
  highlight: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    border: '1 solid #C7D2FE',
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 4,
    border: '1 solid #E2E8F0',
  },
  gridLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E2E8F0',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#F1F5F9',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 5,
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#FEF3C7',
    border: '1 solid #FCD34D',
    borderRadius: 5,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#92400E',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8',
    borderTop: '1 solid #E2E8F0',
    paddingTop: 10,
  },
});

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

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface CPAPackTemplateProps {
  session: PurchaseSession;
}

export const CPAPackTemplate: React.FC<CPAPackTemplateProps> = ({ session }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ISO AMT Exercise Plan - CPA Pack</Text>
        <Text style={styles.subtitle}>Generated on {formatDate(session.paidAt)}</Text>
        <Text style={styles.subtitle}>Tax Year: {session.taxYear}</Text>
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{session.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Filing Status:</Text>
          <Text style={styles.value}>{session.filingStatus.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ordinary Income:</Text>
          <Text style={styles.value}>{formatCurrency(session.ordinaryIncome)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Itemized Deductions:</Text>
          <Text style={styles.value}>{formatCurrency(session.itemizedDeductions)}</Text>
        </View>
      </View>

      {/* ISO Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ISO Stock Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Strike Price:</Text>
          <Text style={styles.value}>{formatCurrency(session.isoStrike)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Fair Market Value:</Text>
          <Text style={styles.value}>{formatCurrency(session.isoFmv)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Shares Available:</Text>
          <Text style={styles.value}>{formatNumber(session.totalSharesAvailable)} shares</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Target AMT Budget:</Text>
          <Text style={styles.value}>{formatCurrency(session.targetAmtBudget)}</Text>
        </View>
      </View>

      {/* Optimal Plan Highlight */}
      <View style={styles.highlight}>
        <Text style={styles.highlightTitle}>Recommended Exercise Plan</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Max Shares</Text>
            <Text style={styles.gridValue}>{formatNumber(session.maxShares)}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Cash Required</Text>
            <Text style={styles.gridValue}>{formatCurrency(session.maxShares * session.isoStrike)}</Text>
          </View>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Projected AMT</Text>
            <Text style={styles.gridValue}>{formatCurrency(session.projectedAmt)}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Bargain Element</Text>
            <Text style={styles.gridValue}>{formatCurrency(session.bargainElement)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Projected Total Tax:</Text>
          <Text style={styles.value}>{formatCurrency(session.projectedTotalTax)}</Text>
        </View>
      </View>

      {/* Alternative Scenarios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alternative Scenarios</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Scenario</Text>
            <Text style={styles.tableCell}>Shares</Text>
            <Text style={styles.tableCell}>Cash Needed</Text>
            <Text style={styles.tableCell}>Bargain Element</Text>
            <Text style={styles.tableCell}>Projected AMT</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Conservative (25%)</Text>
            <Text style={styles.tableCell}>{formatNumber(session.tile25Shares || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile25Cash || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile25Bargain || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile25Amt || 0)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Moderate (50%)</Text>
            <Text style={styles.tableCell}>{formatNumber(session.tile50Shares || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile50Cash || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile50Bargain || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile50Amt || 0)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Aggressive (100%)</Text>
            <Text style={styles.tableCell}>{formatNumber(session.tile100Shares || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile100Cash || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile100Bargain || 0)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(session.tile100Amt || 0)}</Text>
          </View>
        </View>
      </View>

      {/* Sensitivity Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensitivity Analysis</Text>
        <Text style={{ fontSize: 9, color: '#64748B', marginBottom: 10 }}>
          Impact of FMV changes on maximum exercisable shares:
        </Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>FMV -10%</Text>
            <Text style={styles.gridValue}>{formatCurrency(session.sensitivityDownFmv || 0)}</Text>
            <Text style={{ fontSize: 8, color: '#64748B', marginTop: 4 }}>
              Max Shares: {formatNumber(session.sensitivityDownShares || 0)}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Current FMV</Text>
            <Text style={styles.gridValue}>{formatCurrency(session.isoFmv)}</Text>
            <Text style={{ fontSize: 8, color: '#64748B', marginTop: 4 }}>
              Max Shares: {formatNumber(session.maxShares)}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>FMV +10%</Text>
            <Text style={styles.gridValue}>{formatCurrency(session.sensitivityUpFmv || 0)}</Text>
            <Text style={{ fontSize: 8, color: '#64748B', marginTop: 4 }}>
              Max Shares: {formatNumber(session.sensitivityUpShares || 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          DISCLAIMER: This analysis is for informational purposes only and does not constitute tax, legal, or financial advice.
          The calculations are based on {session.taxYear} federal tax rates and AMT rules. State taxes, NIIT, and other factors
          are not included. Consult with a qualified tax professional before making any exercise decisions. Tax laws are subject
          to change and individual circumstances vary. The actual tax impact may differ based on your complete financial situation.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Generated by ISO AMT Exercise Planner | Report ID: {session.id}</Text>
      </View>
    </Page>
  </Document>
);
