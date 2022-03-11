import type { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { PDFViewer, PDFRenderer } from '@react-pdf/renderer';
import { DetailsList, DefaultButton, Panel, IColumn } from '@fluentui/react';
import { supabase, ServerPropTypes, getCurrencyFormat } from 'libs';
import { InvoiceTemplate, MetaHead, TitleCard } from 'components';

interface Props {
  invoice_mst: ServerPropTypes.InvoiceMst[] | null;
  owner_mst: ServerPropTypes.OwnerMst[] | null;
}

const AllInvoice: NextPage<Props> = ({ invoice_mst, owner_mst }: Props) => {
  const [pdfData, setPdfData] =
    useState<{ invoiceData?: ServerPropTypes.InvoiceMst; ownerData?: ServerPropTypes.OwnerMst }>();

  useEffect(() => {
    owner_mst && setPdfData((rest) => ({ ...rest, ownerData: owner_mst[0] }));
  }, [owner_mst]);

  const columns: IColumn[] = [
    {
      key: 'invoice_id',
      name: 'ID',
      fieldName: 'invoice_id',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
    },
    {
      key: 'date',
      name: 'Date',
      fieldName: 'date',
      minWidth: 80,
      maxWidth: 80,
      onRender: ({ date }) => moment(date).format('DD/MM/YY'),
      isResizable: true,
    },
    {
      key: 'name',
      name: 'Customer Name',
      fieldName: 'name',
      minWidth: 200,
      onRender: ({ customer_data }) => customer_data.name,
      isResizable: true,
    },
    {
      key: 'payment_terms',
      name: 'Payment Terms',
      fieldName: 'payment_terms',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'total_amount',
      name: 'Total Amount',
      fieldName: 'total_amount',
      minWidth: 100,
      maxWidth: 100,
      onRender: ({ total_amount }) => getCurrencyFormat(total_amount, true),
      isResizable: true,
    },
    {
      key: 'created_at',
      name: 'Created',
      fieldName: 'created_at',
      minWidth: 80,
      maxWidth: 80,
      onRender: ({ created_at }) => moment(created_at).format('DD/MM/YY'),
      isResizable: true,
    },
    {
      key: 'action',
      name: 'Action',
      minWidth: 150,
      maxWidth: 150,
      onRender: (data) => (
        <DefaultButton onClick={() => setPdfData((rest) => ({ ...rest, invoiceData: data }))}>
          Open
        </DefaultButton>
      ),
      isResizable: true,
    },
  ];

  return (
    <>
      <MetaHead pageTitle="Invoice Transaction" />
      <TitleCard
        title="Invoice Transaction"
        description="Display Invoice ID, Customer Data, Payment Terms & Total Amount"
        iconName="ZipFolder"
        innerPadding={0}
      >
        {invoice_mst && <DetailsList items={invoice_mst} columns={columns} selectionMode={0} />}
      </TitleCard>
      <Panel
        type={3}
        headerText="Duplicate Invoice"
        isOpen={!!(pdfData?.invoiceData && pdfData?.ownerData)}
        onDismiss={() => setPdfData((rest) => ({ ...rest, invoiceData: undefined }))}
      >
        {pdfData?.invoiceData && pdfData?.ownerData && (
          <PDFViewer width="100%" height="650vh" style={{ marginTop: '8px' }}>
            <InvoiceTemplate
              invoiceData={pdfData.invoiceData}
              ownerData={pdfData.ownerData}
              duplicate={true}
            />
          </PDFViewer>
        )}
      </Panel>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: invoice_mst } = await supabase
    .from('invoice')
    .select()
    .order('invoice_id', { ascending: true });
  const { data: owner_mst } = await supabase
    .from('owner')
    .select()
    .order('owner_id', { ascending: true })
    .limit(1);
  return { props: { invoice_mst, owner_mst } };
};

export default AllInvoice;
