import React from 'react';
import type HookFormProps from './HookFormProps';
import { Controller } from 'react-hook-form';
import { DatePicker, IDatePickerProps } from '@fluentui/react';

const RHFDatePicker = (props: HookFormProps & IDatePickerProps): React.ReactElement => {
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        rules={props.rules}
        defaultValue={props.defaultValue || ''}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <DatePicker
            {...props}
            value={value}
            onSelectDate={onChange}
            onBlur={onBlur}
            textField={{ errorMessage: error && error.message, ...props.textField }}
            defaultValue={undefined}
          />
        )}
      />
      <style jsx>{`
        :global(.statusMessage-156) {
          margin: 0;
        }
      `}</style>
    </>
  );
};

export default RHFDatePicker;
