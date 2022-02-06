import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DefaultButton, IComboBoxOption, PrimaryButton, Stack } from '@fluentui/react';
import { ServerPropTypes, supabase } from 'libs';
import { RHF } from 'components';

interface Props {
  customerOptions: IComboBoxOption[];
  serviceOptions: IComboBoxOption[];
}

const EditCustomerForm = ({ customerOptions, serviceOptions }: Props): React.ReactElement => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [defaultServices, setDefaultServices] = useState<number[]>();
  const { control, handleSubmit, setValue, reset } = useForm<ServerPropTypes.NewCustomer>();

  const onSelectCustomer = async (customer_id: number) => {
    setShowForm(false);
    const { data } = await supabase
      .from<ServerPropTypes.NewCustomer>('customer')
      .select('gstin, name, address, payment_terms, services, active')
      .eq('customer_id', customer_id);
    if (!data) return;
    setDefaultServices(data[0].services);
    delete data[0].services;
    let fieldName: keyof typeof data[0];
    for (fieldName in data[0]) setValue(fieldName, data[0][fieldName]);
    setShowForm(true);
  };

  const onReset = () => {
    reset();
    setShowForm(false);
  };

  const onSubmit: SubmitHandler<ServerPropTypes.NewCustomer> = async (formData) => {
    const { data } = await supabase
      .from('customer')
      .update([formData])
      .eq('customer_id', formData.customer_id);
    if (!data) return;
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '587px' }}>
      <RHF.ComboBox
        label="Select Existing Customer"
        options={customerOptions}
        control={control}
        name="customer_id"
        rules={{ onChange: (e) => onSelectCustomer(e.target.value) }}
        styles={{ root: { marginBottom: '12px', width: '587px' } }}
      />
      {showForm && (
        <>
          <Stack horizontal verticalAlign="start" tokens={{ childrenGap: 28 }}>
            <RHF.TextField
              label="Customer ID"
              description="Read only customer identifier"
              readOnly
              control={control}
              name="customer_id"
            />
            <RHF.TextField
              label="GSTIN"
              description="15 digit customer GSTIN"
              control={control}
              name="gstin"
              rules={{
                required: 'Required Field',
                pattern: {
                  value: /\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d][Z][A-Z\d]/i,
                  message: 'Invalid GSTIN code format',
                },
              }}
              styles={{ root: { width: '382px' }, field: { textTransform: 'uppercase' } }}
            />
          </Stack>
          <RHF.TextField
            label="Customer Name"
            description="Customer or company name"
            control={control}
            name="name"
            rules={{ required: 'Required Field' }}
          />
          <Stack horizontal tokens={{ childrenGap: 28 }}>
            <RHF.TextField
              label="Address"
              description="Customer or company address"
              multiline
              rows={6}
              resizable={false}
              control={control}
              name="address"
              rules={{ required: 'Required Field' }}
              styles={{ root: { flexGrow: 1 } }}
            />
            <Stack tokens={{ childrenGap: 12 }} styles={{ root: { flexGrow: 1 } }}>
              <RHF.TextField
                label="Payment Terms"
                description="Optional terms for bill payment"
                multiline
                rows={2}
                resizable={false}
                control={control}
                name="payment_terms"
              />
              <RHF.CheckBox
                label="Set as active customer"
                defaultChecked={true}
                boxSide="end"
                control={control}
                name="active"
              />
            </Stack>
          </Stack>
          <RHF.ComboBox
            label="Select Services"
            options={serviceOptions}
            defaultSelectedKey={defaultServices}
            multiSelect
            control={control}
            name="services"
          />
          <Stack
            horizontal
            horizontalAlign="end"
            tokens={{ childrenGap: '28px' }}
            style={{ marginTop: '18px' }}
          >
            <DefaultButton onClick={onReset}>Reset</DefaultButton>
            <PrimaryButton type="submit">Update Customer</PrimaryButton>
          </Stack>
        </>
      )}
    </form>
  );
};

export default EditCustomerForm;
