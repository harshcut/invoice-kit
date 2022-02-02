import type { NextPage, GetServerSideProps } from 'next';
import moment from 'moment';
import { DetailsList, IColumn } from '@fluentui/react';
import { supabase, ServerPropTypes } from 'libs';
import { MetaHead, TitleCard } from 'components';

interface Props {
  service_mst: ServerPropTypes.ServiceMst[] | null;
}

const AllService: NextPage<Props> = ({ service_mst }: Props) => {
  return (
    <>
      <MetaHead pageTitle="Service Master" />
      <TitleCard
        title="Service Master"
        description="Display Service ID, SAC, Service Description & GST Tax Percentage."
        iconName="ViewDashboard"
        innerPadding={0}
      >
        {service_mst && <DetailsList items={service_mst} columns={columns} selectionMode={0} />}
      </TitleCard>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: service_mst } = await supabase
    .from('service')
    .select()
    .order('service_id', { ascending: true });
  return { props: { service_mst } };
};

export default AllService;

const columns: IColumn[] = [
  {
    key: 'service_id',
    name: 'ID',
    fieldName: 'service_id',
    minWidth: 25,
    maxWidth: 25,
    isResizable: true,
  },
  {
    key: 'sac',
    name: 'SAC',
    fieldName: 'sac',
    minWidth: 50,
    maxWidth: 50,
    isResizable: true,
  },
  {
    key: 'description',
    name: 'Service Description',
    fieldName: 'description',
    minWidth: 200,
    isResizable: true,
  },
  {
    key: 'cgst',
    name: 'CGST',
    fieldName: 'cgst',
    minWidth: 35,
    maxWidth: 35,
    onRender: ({ cgst }) => `${cgst}%`,
    isResizable: true,
  },
  {
    key: 'sgst',
    name: 'SGST',
    fieldName: 'sgst',
    minWidth: 35,
    maxWidth: 35,
    onRender: ({ sgst }) => `${sgst}%`,
    isResizable: true,
  },
  {
    key: 'igst',
    name: 'IGST',
    fieldName: 'igst',
    minWidth: 40,
    maxWidth: 40,
    onRender: ({ igst }) => `${igst}%`,
    isResizable: true,
  },
  {
    key: 'active',
    name: 'Active',
    fieldName: 'active',
    minWidth: 50,
    maxWidth: 50,
    onRender: ({ active }) => (active ? 'Yes' : 'No'),
    isResizable: true,
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
