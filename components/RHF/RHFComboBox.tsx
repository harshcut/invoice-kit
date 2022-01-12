import React, { useState, useEffect } from 'react';
import type HookFormProps from './HookFormProps';
import { Controller } from 'react-hook-form';
import { ComboBox, IComboBoxProps, IComboBoxOption } from '@fluentui/react';

const RHFComboBox = (props: HookFormProps & IComboBoxProps): React.ReactElement => {
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);

  useEffect(() => {
    Array.isArray(props.defaultSelectedKey) && setSelectedKeys(props.defaultSelectedKey);
  }, [props.defaultSelectedKey]);

  const onKeyUpdate = (option?: IComboBoxOption): (string | number)[] => {
    const selected = option?.selected;
    const newSelectedKeys: (string | number)[] = selected
      ? [...selectedKeys, option.key].sort()
      : selectedKeys.filter((key) => key !== option?.key);
    setSelectedKeys(newSelectedKeys);
    return newSelectedKeys;
  };

  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      defaultValue={props.defaultSelectedKey || (props.multiSelect ? [] : '')}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <ComboBox
          {...props}
          selectedKey={value}
          onChange={(_, option) => onChange(props.multiSelect ? onKeyUpdate(option) : option?.key)}
          onBlur={onBlur}
          errorMessage={error && error.message}
          defaultSelectedKey={undefined}
        />
      )}
    />
  );
};

export default RHFComboBox;
