import type { NextPage, GetServerSideProps } from 'next';
import { Stack, IComboBoxOption } from '@fluentui/react';
import { ServerPropTypes, supabase, getSerialValue } from 'libs';
import { MetaHead, TitleCard } from 'components';
import { NewServiceForm, EditServiceForm } from 'forms';

interface Props {
  service_seq: ServerPropTypes.TableSeq[] | null;
  service_mst: ServerPropTypes.ServiceMst[] | null;
}

const NewService: NextPage<Props> = ({ service_seq, service_mst }: Props) => {
  const serviceOptions: IComboBoxOption[] =
    service_mst?.map(({ service_id, sac, description }) => ({
      key: service_id,
      text: `${service_id}. ${description} (${sac})`,
    })) ?? [];

  return (
    <>
      <MetaHead pageTitle="New Service" />
      <Stack tokens={{ childrenGap: '48px' }}>
        <TitleCard
          title="Add Service"
          description="Requires SAC, Service Description & GST Tax Percentage."
          iconName="WebComponents"
        >
          {service_seq && <NewServiceForm serialValue={getSerialValue(service_seq[0])} />}
        </TitleCard>
        <TitleCard
          title="Update Service"
          description="Change SAC, Service Description & GST Tax Percentage."
          iconName="WebComponents"
        >
          {service_seq && <EditServiceForm serviceOptions={serviceOptions} />}
        </TitleCard>
      </Stack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: service_seq } = await supabase
    .from('service_service_id_seq')
    .select('last_value, is_called');
  const { data: service_mst } = await supabase
    .from('service')
    .select('service_id, sac, description')
    .order('service_id', { ascending: true });
  return { props: { service_seq, service_mst } };
};

export default NewService;
