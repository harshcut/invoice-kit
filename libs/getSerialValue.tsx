interface Props {
  is_called: boolean;
  last_value: number;
}

const getSerialValue = ({ is_called, last_value }: Props): number =>
  is_called ? last_value + 1 : 1;

export default getSerialValue;
