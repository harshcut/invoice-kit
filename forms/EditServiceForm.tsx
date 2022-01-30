import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Stack, DefaultButton, PrimaryButton, IComboBoxOption } from '@fluentui/react';
import { ServerPropTypes, supabase } from 'libs';
import { RHF } from 'components';

interface Props {
  serviceOptions: IComboBoxOption[];
}

const EditServiceForm = ({ serviceOptions }: Props): React.ReactElement => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { control, handleSubmit, setValue, reset } = useForm<ServerPropTypes.NewService>();

  const onSelectService = async (service_id: number) => {
    setShowForm(false);
    const { data } = await supabase
      .from<ServerPropTypes.NewService>('service')
      .select('sac, description, cgst, sgst, igst, active')
      .eq('service_id', service_id);
    if (!data) return;
    let fieldName: keyof typeof data[0];
    for (fieldName in data[0]) setValue(fieldName, data[0][fieldName]);
    setShowForm(true);
  };

  const onReset = () => {
    reset();
    setShowForm(false);
  };

  const onSubmit: SubmitHandler<ServerPropTypes.NewService> = async (formData) => {
    const { data } = await supabase
      .from('service')
      .update([formData])
      .eq('service_id', formData.service_id);
    if (!data) return;
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '587px' }}>
      <RHF.ComboBox
        label="Select Existing Service"
        options={serviceOptions}
        control={control}
        name="service_id"
        rules={{ onChange: (e) => onSelectService(e.target.value) }}
        styles={{ root: { marginBottom: '12px', width: '587px' } }}
      />
      {showForm && (
        <>
          <Stack horizontal verticalAlign="start" tokens={{ childrenGap: 28 }}>
            <RHF.TextField
              control={control}
              name="service_id"
              label="Service ID"
              description="Read only service identifier"
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
            <DefaultButton onClick={onReset}>Reset</DefaultButton>
            <PrimaryButton type="submit">Update Service</PrimaryButton>
          </Stack>
        </>
      )}
    </form>
  );
};

export default EditServiceForm;
