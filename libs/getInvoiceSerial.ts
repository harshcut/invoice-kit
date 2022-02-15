import { getFiscalYear } from 'libs';

const getInvoiceSerial = (invoice_id?: string): string => {
  if (!invoice_id) return `${getFiscalYear()}/${'1'.padStart(3, '0')}`;
  const lastValue: number = Number(invoice_id.split('/')[1]) + 1;
  return `${getFiscalYear()}/${String(lastValue).padStart(3, '0')}`;
};

export default getInvoiceSerial;
