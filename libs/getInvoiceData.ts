import moment from 'moment';
import { ServerPropTypes } from 'libs';

const getInvoiceData = (
  formData: ServerPropTypes.NewInvoice,
  customerData: ServerPropTypes.CustomerMst,
  serviceData: ServerPropTypes.ServiceMst[]
): Omit<ServerPropTypes.InvoiceMst, 'created_at'> => {
  const preTax: Array<{ text: string; amount: number; service_data: ServerPropTypes.ServiceMst }> =
    formData.particulars
      .map((item, service_id) => {
        const current = serviceData.find((service) => service.service_id === service_id)!;
        return {
          text: [current?.description, item?.optional, `(SAC: ${current?.sac})`]
            .filter(Boolean)
            .join(' '),
          amount: Number(Number(item.amount).toFixed(2)),
          service_data: current,
        };
      })
      .filter(({ service_data }) => service_data);
  const subTotalA: number = preTax.reduce((acc, curr) => acc + curr.amount, 0);

  let postTax: Array<{ text: string; amount: number }>;
  if (customerData.gstin.slice(0, 2) === '27')
    postTax = [
      { text: 'CGST @ 9%', amount: (subTotalA * 9) / 100 },
      { text: 'SGST @ 9%', amount: (subTotalA * 9) / 100 },
    ];
  else postTax = [{ text: 'IGST @ 18%', amount: (subTotalA * 18) / 100 }];
  const subTotalB: number = Number(((subTotalA * 18) / 100).toFixed(2));

  return {
    invoice_id: formData.invoice_id,
    date: moment(formData.date).format('YYYY-MM-DD'),
    customer_id: formData.customer_id,
    customer_data: customerData,
    payment_terms: formData.payment_terms,
    billing_period: {
      start: moment(formData.billing_period.start).format('YYYY-MM-DD'),
      end: moment(formData.billing_period.end).format('YYYY-MM-DD'),
    },
    particulars: [
      ...preTax,
      { text: 'Sub Total (A)', amount: subTotalA },
      ...postTax,
      { text: 'Sub Total (B)', amount: subTotalB },
    ],
    total_amount: Math.ceil(subTotalA + subTotalB),
  };
};

export default getInvoiceData;
