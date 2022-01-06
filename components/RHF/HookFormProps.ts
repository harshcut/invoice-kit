import type { Control, RegisterOptions } from 'react-hook-form';

type HookFormProps = {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  defaultValue?: any;
};

export default HookFormProps;
