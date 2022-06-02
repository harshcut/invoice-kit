import React from 'react';
import moment from 'moment';
import { Font, Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { ServerPropTypes, getCurrencyFormat, getCurrencyString } from 'libs';

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 400,
});

Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Bold.ttf',
  fontStyle: 'normal',
  fontWeight: 700,
});

interface Props {
  ownerData: ServerPropTypes.OwnerMst;
  invoiceData: ServerPropTypes.InvoiceMst;
  duplicate?: boolean;
}

const InvoiceTemplate = ({ ownerData, invoiceData, duplicate }: Props): React.ReactElement => {
  return (
    <Document>
      <Page size="A4" style={{ padding: '30px 30px 0 30px', fontFamily: 'Roboto' }}>
        <View style={{ flexDirection: 'row', marginBottom: 10, fontSize: 11, lineHeight: 1.2 }}>
          <View style={{ width: '60%', justifyContent: 'space-between' }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src="/logo.png" style={{ width: 150 }} />
            <Text style={{ fontWeight: 700 }}>Tax Invoice {duplicate && '(Duplicate)'}</Text>
          </View>
          <View style={{ width: '40%', justifyContent: 'space-evenly' }}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>{ownerData.name}</Text>
            <Text>{ownerData.address}</Text>
            <Text>Phone No.: {ownerData.phone}</Text>
            <Text>GSTIN: {ownerData.gstin}</Text>
            {ownerData.optional?.map(({ key, value }, index) => (
              <Text key={index}>
                {key}: {value}
              </Text>
            ))}
          </View>
        </View>
        <View style={{ borderTop: '1px dashed #000', padding: '8px 0', fontSize: 11 }}>
          <Text style={{ fontWeight: 700 }}>[CUSTOMER]</Text>
        </View>
        <View style={{ flexDirection: 'row', fontSize: 11, border: '1px solid #000' }}>
          <View style={{ width: '60%', padding: 6, justifyContent: 'space-between' }}>
            <Text>Bill To</Text>
            <Text>{invoiceData.customer_data.name}</Text>
            <Text>{invoiceData.customer_data.address}</Text>
            <Text>GSTIN: {invoiceData.customer_data.gstin}</Text>
          </View>
          <View style={{ width: '40%', borderLeft: '1px solid #000' }}>
            <Text style={{ padding: 6, borderBottom: '1px solid #000' }}>
              Invoice No.: {invoiceData.invoice_id}
            </Text>
            <Text style={{ padding: 6, borderBottom: '1px solid #000' }}>
              Invoice Date: {moment(invoiceData.date).format('DD/MM/YYYY')}
            </Text>
            <Text style={{ padding: 6, borderBottom: '1px solid #000' }}>
              Payment Terms: {invoiceData.payment_terms}
            </Text>
            <Text style={{ padding: 6 }}>
              Billing Period: {moment(invoiceData.billing_period.start).format('DD/MM/YY')} to{' '}
              {moment(invoiceData.billing_period.end).format('DD/MM/YY')}
            </Text>
          </View>
        </View>
        <View style={{ fontSize: 11, border: '1px solid #000', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', borderBottom: '1px solid #000', fontWeight: 700 }}>
            <Text style={{ padding: 5, width: '75%', textAlign: 'center' }}>Particulars</Text>
            <Text
              style={{
                padding: 5,
                width: '25%',
                textAlign: 'center',
                borderLeft: '1px solid #000',
              }}
            >
              Amount
            </Text>
          </View>
          {invoiceData.particulars.map((item, index) => (
            <View style={{ flexDirection: 'row' }} key={index}>
              <Text
                style={{
                  width: '75%',
                  padding: '6px 0 0 6px',
                  fontWeight: item.text.slice(0, 9) === 'Sub Total' ? 700 : 400,
                }}
              >
                {item.text}
              </Text>
              <Text
                style={{
                  width: '25%',
                  textAlign: 'right',
                  borderLeft: '1px solid #000',
                  padding: '6px 6px 0 0',
                  fontWeight: item.text.slice(0, 9) === 'Sub Total' ? 700 : 400,
                }}
              >
                {getCurrencyFormat(Number(item.amount))}
              </Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: '75%', padding: '6px 0 6px 6px' }}>
              {getCurrencyString(invoiceData.total_amount)}
            </Text>
            <Text style={{ width: '25%', textAlign: 'right', borderLeft: '1px solid #000' }} />
          </View>
          <View style={{ flexDirection: 'row', borderTop: '1px solid #000', fontWeight: 700 }}>
            <Text style={{ padding: 6, width: '75%' }}>Total ... (A) + (B)</Text>
            <Text
              style={{
                width: '25%',
                textAlign: 'right',
                borderLeft: '1px solid #000',
                padding: '6px 6px 6px 0',
              }}
            >
              {getCurrencyFormat(Number(invoiceData?.total_amount))}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            minHeight: 100,
            border: '1px solid #000',
          }}
        >
          <View style={{ width: '60%' }}>
            <View style={{ padding: 5, borderBottom: '1px solid #000' }}>
              <Text style={{ fontSize: 11, fontWeight: 700 }}>Wire Transfer Payment Details</Text>
            </View>
            <View style={{ padding: '6px 0 0 6px', fontSize: 10 }}>
              {ownerData.payment_details?.map(({ key, value }, index) => (
                <Text key={index} style={{ marginBottom: 6 }}>
                  {key}: {value}
                </Text>
              ))}
            </View>
          </View>
          <View style={{ width: '40%', borderLeft: '1px solid #000', fontSize: 11 }}>
            <Text style={{ padding: '5px 0 0 5px', fontWeight: 700 }}>For {ownerData.name}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceTemplate;
