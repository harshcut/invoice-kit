import type { NextPage, GetServerSideProps } from 'next';
import { Stack, IComboBoxOption } from '@fluentui/react';
import { supabase, ServerPropTypes, getSerialValue } from 'libs';
import { MetaHead, TitleCard } from 'components';
import { EditCustomerForm, NewCustomerForm } from 'forms';

interface Props {
  customer_seq: ServerPropTypes.TableSeq[] | null;
  service_mst: ServerPropTypes.ServiceMst[] | null;
  customer_mst: ServerPropTypes.CustomerMst[] | null;
}

const NewCustomer: NextPage<Props> = ({ customer_seq, service_mst, customer_mst }: Props) => {
  const serviceOptions: IComboBoxOption[] =
    service_mst?.map(({ service_id, sac, description }) => ({
      key: service_id,
      text: `${service_id}. ${description} (${sac})`,
    })) ?? [];

  const customerOptions: IComboBoxOption[] =
    customer_mst?.map(({ customer_id, gstin, name }) => ({
      key: customer_id,
      text: `${customer_id}. ${name} (${gstin.slice(0, 4)})`,
    })) ?? [];

  return (
    <>
      <MetaHead pageTitle="Create Customer" />
      <Stack tokens={{ childrenGap: '48px' }}>
        <TitleCard
          title="Create Customer"
          description="Requires GSTIN, Customer Name, Address & Payment Terms."
          iconName="PeopleAdd"
        >
          {customer_seq && (
            <NewCustomerForm
              serialValue={getSerialValue(customer_seq[0])}
              serviceOptions={serviceOptions}
            />
          )}
        </TitleCard>
        <TitleCard
          title="Update Customer"
          description="Change GSTIN, Customer Name, Address & Payment Terms."
          iconName="PeopleAdd"
        >
          {customer_seq && (
            <EditCustomerForm customerOptions={customerOptions} serviceOptions={serviceOptions} />
          )}
        </TitleCard>
      </Stack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: customer_seq } = await supabase
    .from('customer_customer_id_seq')
    .select('last_value, is_called');
  const { data: service_mst } = await supabase
    .from('service')
    .select('service_id, description, sac')
    .eq('active', true)
    .order('service_id', { ascending: true });
  const { data: customer_mst } = await supabase
    .from('customer')
    .select('customer_id, name, gstin')
    .order('customer_id', { ascending: true });
  return { props: { customer_seq, service_mst, customer_mst } };
};

export default NewCustomer;
