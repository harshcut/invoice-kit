import { getFiscalYear } from 'libs';

const getInvoiceSerial = (invoice_id?: string): string => {
  if (!invoice_id) return `${getFiscalYear()}/${'1'.padStart(3, '0')}`;
  const [fiscalYear, serialValue] = invoice_id.split('/');
  const lastValue: number = getFiscalYear() === fiscalYear ? Number(serialValue) + 1 : 1;
  return `${getFiscalYear()}/${String(lastValue).padStart(3, '0')}`;
};

export default getInvoiceSerial;
