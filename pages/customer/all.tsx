import type { NextPage, GetServerSideProps } from 'next';
import moment from 'moment';
import { DetailsList, IColumn } from '@fluentui/react';
import { supabase, ServerPropTypes } from 'libs';
import { MetaHead, TitleCard } from 'components';

interface Props {
  customer_mst: ServerPropTypes.CustomerMst[] | null;
}

const AllCustomer: NextPage<Props> = ({ customer_mst }: Props) => {
  return (
    <>
      <MetaHead pageTitle="Customer Master" />
      <TitleCard
        title="Customer Master"
        description="Display Customer ID, GSTIN, Name, Address & Services."
        iconName="AccountManagement"
        innerPadding={0}
      >
        {customer_mst && <DetailsList items={customer_mst} columns={columns} selectionMode={0} />}
      </TitleCard>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: customer_mst } = await supabase
    .from('customer')
    .select()
    .order('customer_id', { ascending: true });
  return { props: { customer_mst } };
};

export default AllCustomer;

const columns: IColumn[] = [
  {
    key: 'customer_id',
    name: 'ID',
    fieldName: 'customer_id',
    minWidth: 25,
    maxWidth: 25,
    isResizable: true,
  },
  {
    key: 'gstin',
    name: 'GSTIN',
    fieldName: 'gstin',
    minWidth: 120,
    maxWidth: 120,
    isResizable: true,
  },
  {
    key: 'name',
    name: 'Customer Name',
    fieldName: 'name',
    minWidth: 200,
    isResizable: true,
  },
  {
    key: 'address',
    name: 'Address',
    fieldName: 'address',
    minWidth: 300,
    maxWidth: 300,
    isResizable: true,
  },
  {
    key: 'services',
    name: 'Services',
    fieldName: 'services',
    minWidth: 80,
    maxWidth: 80,
    isResizable: true,
    onRender: ({ services }) => services.join(', '),
  },
  {
    key: 'active',
    name: 'Active',
    fieldName: 'active',
    minWidth: 50,
    maxWidth: 50,
    isResizable: true,
    onRender: ({ active }) => (active ? 'Yes' : 'No'),
  },
  {
    key: 'updated_at',
    name: 'Updated',
    fieldName: 'updated_at',
    minWidth: 80,
    maxWidth: 80,
    onRender: ({ updated_at }) => moment(updated_at).format('DD/MM/YY'),
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
