import React from 'react';
import type HookFormProps from './HookFormProps';
import { Controller } from 'react-hook-form';
import { Checkbox, ICheckboxProps } from '@fluentui/react';

const RHFCheckbox = (props: HookFormProps & ICheckboxProps): React.ReactElement => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      defaultValue={!!props.defaultChecked}
      render={({ field: { onChange, value } }) => (
        <Checkbox
          {...props}
          checked={value}
          onChange={onChange}
          defaultChecked={undefined}
          defaultIndeterminate={undefined}
          indeterminate={undefined}
        />
      )}
    />
  );
};

export default RHFCheckbox;
