import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Stack, TextField, DefaultButton, PrimaryButton } from '@fluentui/react';
import { ServerPropTypes, supabase } from 'libs';
import { RHF } from 'components';

interface Props {
  serialValue: number;
}

const NewServiceForm = ({ serialValue }: Props): React.ReactElement => {
  const [currValue, setCurrValue] = useState<number>(serialValue);
  const { control, handleSubmit, reset } = useForm<ServerPropTypes.NewService>();

  const onSubmit: SubmitHandler<ServerPropTypes.NewService> = async (formData) => {
    const { data } = await supabase.from('service').insert([formData]);
    if (!data) return;
    setCurrValue((v) => v + 1);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '587px' }}>
      <Stack horizontal verticalAlign="start" tokens={{ childrenGap: 28 }}>
        <TextField
          label="Service ID"
          description="Auto-incrementing service identifier"
          value={`${currValue}`}
          readOnly
        />
        <RHF.TextField
          label="Service Accounting Code"
          description="6 to 8 digit SAC"
          type="number"
          control={control}
          name="sac"
          rules={{
            required: 'Required Field',
            pattern: { value: /^[0-9]{6,8}$/, message: 'Invalid SAC code format' },
          }}
        />
      </Stack>
      <RHF.TextField
        label="Service Description"
        description="SAC service description"
        control={control}
        name="description"
        rules={{ required: 'Required Field' }}
      />
      <Stack horizontal tokens={{ childrenGap: 28 }}>
        <RHF.TextField
          label="CGST (%)"
          description="Central"
          type="number"
          suffix="%"
          control={control}
          name="cgst"
          rules={{ required: 'Required Field' }}
        />
        <RHF.TextField
          label="SGST (%)"
          description="State"
          type="number"
          suffix="%"
          control={control}
          name="sgst"
          rules={{ required: 'Required Field' }}
        />
        <RHF.TextField
          label="IGST (%)"
          description="Integrated"
          type="number"
          suffix="%"
          control={control}
          name="igst"
          rules={{ required: 'Required Field' }}
        />
      </Stack>
      <RHF.CheckBox
        label="Set as active service"
        defaultChecked={true}
        control={control}
        name="active"
        styles={{ root: { marginTop: '12px' } }}
      />
      <Stack
        horizontal
        horizontalAlign="end"
        tokens={{ childrenGap: '28px' }}
        style={{ marginTop: '12px' }}
      >
        <DefaultButton onClick={() => reset()}>Reset</DefaultButton>
        <PrimaryButton type="submit">Add Service</PrimaryButton>
      </Stack>
    </form>
  );
};

export default NewServiceForm;
