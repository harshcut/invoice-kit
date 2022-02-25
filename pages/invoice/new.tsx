import type { NextPage, GetServerSideProps } from 'next';
import { IComboBoxOption, Stack } from '@fluentui/react';
import { ServerPropTypes, supabase, getInvoiceSerial } from 'libs';
import { MetaHead, TitleCard } from 'components';
import { NewInvoiceForm } from 'forms';

interface Props {
  invoice_seq: ServerPropTypes.InvoiceSeq[] | null;
  customer_mst: ServerPropTypes.CustomerMst[] | null;
}

const NewInvoice: NextPage<Props> = ({ invoice_seq, customer_mst }: Props) => {
  const customerOptions: IComboBoxOption[] =
    customer_mst?.map(({ customer_id, gstin, name }) => ({
      key: customer_id,
      text: `${customer_id}. ${name} (${gstin.slice(0, 4)})`,
    })) ?? [];

  return (
    <>
      <MetaHead pageTitle="New Invoice" />
      <Stack tokens={{ childrenGap: '48px' }}>
        <TitleCard
          title="New Invoice"
          description="Requires Customer, Invoice Date, Payment Terms & Services."
          iconName="AddToShoppingList"
        >
          {invoice_seq && (
            <NewInvoiceForm
              customerOptions={customerOptions}
              serialValue={getInvoiceSerial(invoice_seq[0]?.invoice_id)}
            />
          )}
        </TitleCard>
      </Stack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: invoice_seq } = await supabase
    .from('invoice')
    .select('invoice_id')
    .order('invoice_id', { ascending: false })
    .limit(1);
  const { data: customer_mst } = await supabase
    .from('customer')
    .select()
    .eq('active', true)
    .order('customer_id', { ascending: true });
  return { props: { invoice_seq, customer_mst } };
};

export default NewInvoice;
