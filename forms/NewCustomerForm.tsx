import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Stack, TextField, DefaultButton, PrimaryButton, IComboBoxOption } from '@fluentui/react';
import { ServerPropTypes, supabase } from 'libs';
import { RHF } from 'components';

interface Props {
  serialValue: number;
  serviceOptions: IComboBoxOption[];
}

const NewCustomerForm = ({ serialValue, serviceOptions }: Props): React.ReactElement => {
  const [currValue, setCurrValue] = useState<number>(serialValue);
  const { control, handleSubmit, reset } = useForm<ServerPropTypes.NewCustomer>();

  const onSubmit: SubmitHandler<ServerPropTypes.NewCustomer> = async (formData: any) => {
    const { data } = await supabase.from('customer').insert([formData]);
    if (!data) return;
    setCurrValue((v) => v + 1);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '587px' }}>
      <Stack horizontal verticalAlign="start" tokens={{ childrenGap: 28 }}>
        <TextField
          label="Customer ID"
          description="Auto-incrementing customer identifier"
          value={`${currValue}`}
          readOnly
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
        <DefaultButton onClick={() => reset()}>Reset</DefaultButton>
        <PrimaryButton type="submit">Create Customer</PrimaryButton>
      </Stack>
    </form>
  );
};

export default NewCustomerForm;
