import React from 'react';
import type HookFormProps from './HookFormProps';
import { Controller } from 'react-hook-form';
import { TextField, ITextFieldProps } from '@fluentui/react';

const RHFTextField = (props: HookFormProps & ITextFieldProps): React.ReactElement => {
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        rules={props.rules}
        defaultValue={props.defaultValue || ''}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            {...props}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errorMessage={error && error.message}
            defaultValue={undefined}
          />
        )}
      />
      <style jsx>{`
        :global(input::-webkit-outer-spin-button),
        :global(input::-webkit-inner-spin-button) {
          -webkit-appearance: none;
          margin: 0;
        }
        :global(input[type='number']) {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
};

export default RHFTextField;
