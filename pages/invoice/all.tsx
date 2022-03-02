import type { NextPage, GetServerSideProps } from 'next';
import moment from 'moment';
import { DetailsList, IColumn } from '@fluentui/react';
import { supabase, ServerPropTypes, getCurrencyFormat } from 'libs';
import { MetaHead, TitleCard } from 'components';

interface Props {
  invoice_mst: ServerPropTypes.InvoiceMst[] | null;
}

const AllInvoice: NextPage<Props> = ({ invoice_mst }: Props) => {
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: invoice_mst } = await supabase
    .from('invoice')
    .select()
    .order('invoice_id', { ascending: true });
  return { props: { invoice_mst } };
};

export default AllInvoice;

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
];
