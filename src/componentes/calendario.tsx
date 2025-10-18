import { useState } from  'react';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

type CalendarioProps = {
  onChange: (date: DateType | null) => void;
};

export function Calendario({onChange }: CalendarioProps) {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();

  return (
    <DateTimePicker
      mode="single"
      locale='es'
      date={selected}
      onChange={({ date }) => {
        setSelected(date);
        onChange(date);
      }}
      styles={defaultStyles}
    />
  );
}