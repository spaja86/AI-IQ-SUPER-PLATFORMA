export const EXPECTED_VERCEL_BILLING_OWNER = 'Digitalna Industrija — Kompanija SPAJA';
export const EXPECTED_VERCEL_INVOICE_NUMBER = '5JJYX4KN-0015';
export const EXPECTED_VERCEL_INVOICE_AMOUNT = '385.52';
export const PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE = 'public-safe';
export const PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY = 'internal-only';

export interface VercelPublicAnnouncementInput {
  invoiceRequested: boolean;
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  invoiceCorrectionRequested: boolean;
  correctedInvoiceResolved: boolean;
  currentInvoiceEvidenceCaptured: boolean;
  bankStatementCaptured: boolean;
  paymentReferenceCaptured: boolean;
  paymentReferenceClassification: string;
  publicAnnouncementRedacted: boolean;
  publicAnnouncementPublished: boolean;
}

export function normalizePaymentReferenceClassification(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase();
  return [
    PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE,
    PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY,
  ].includes(normalized)
    ? normalized
    : '';
}

export function isVercelInvoiceResolved(flags: {
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  invoiceCorrectionRequested: boolean;
  correctedInvoiceResolved: boolean;
}): boolean {
  const invoiceMatchesExpected =
    flags.currentInvoiceNumber === EXPECTED_VERCEL_INVOICE_NUMBER
    && flags.currentInvoiceAmount === EXPECTED_VERCEL_INVOICE_AMOUNT;
  return invoiceMatchesExpected
    && (flags.currentInvoicePaid || (flags.invoiceCorrectionRequested && flags.correctedInvoiceResolved));
}

export function buildVercelPublicAnnouncementState(flags: VercelPublicAnnouncementInput) {
  const paymentReferenceClassification = normalizePaymentReferenceClassification(
    flags.paymentReferenceClassification,
  );
  const invoiceResolved = isVercelInvoiceResolved(flags);
  const invoiceWorkflowDocumented = flags.invoiceRequested;
  const readyToPublish = invoiceResolved
    && flags.currentInvoiceEvidenceCaptured
    && flags.bankStatementCaptured
    && flags.paymentReferenceCaptured
    && paymentReferenceClassification.length > 0
    && flags.publicAnnouncementRedacted;
  const blockers = [
    ...(!invoiceWorkflowDocumented ? ['Zahtev za fakturisanje / support eskalacija nije dokumentovana.'] : []),
    ...(!invoiceResolved
      ? ['Javno ozvaničenje je blokirano dok faktura nije plaćena ili korekcija nije rešena.']
      : []),
    ...(!flags.currentInvoiceEvidenceCaptured && invoiceResolved && invoiceWorkflowDocumented
      ? ['Nedostaje payment confirmation paket.']
      : []),
    ...(!flags.bankStatementCaptured && invoiceResolved && invoiceWorkflowDocumented
      ? ['Nedostaje izvod platnog računa.']
      : []),
    ...(!flags.paymentReferenceCaptured && invoiceResolved && invoiceWorkflowDocumented
      ? ['Nedostaje barkod / payment reference.']
      : []),
    ...(flags.paymentReferenceCaptured && invoiceResolved && invoiceWorkflowDocumented && paymentReferenceClassification.length === 0
      ? ['Barkod / payment reference mora biti klasifikovan kao public-safe ili internal-only.']
      : []),
    ...(!flags.publicAnnouncementRedacted && invoiceResolved && invoiceWorkflowDocumented
      ? ['Javni sažetak mora biti redigovan.']
      : []),
    ...(!flags.publicAnnouncementPublished && readyToPublish
      ? ['Audit-ready javni sažetak još nije objavljen.']
      : []),
  ];

  return {
    paymentReferenceClassification,
    invoiceResolved,
    readyToPublish,
    status: flags.publicAnnouncementPublished
      ? 'published'
      : readyToPublish
        ? 'ready-to-publish'
        : 'not-ready',
    blockers,
  };
}
