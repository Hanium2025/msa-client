import React from "react";
import FormRow from "../../atoms/FormRow";
import LinedTextInput from "../../atoms/LinedTextInput";
import styles from "./WaybillNumberRow.style";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function WaybillNumberRow({ value, onChange }: Props) {
  return (
    <FormRow label="송장번호">
      <LinedTextInput
        value={value}
        onChangeText={onChange}
        placeholder="송장번호"
        keyboardType="number-pad"
        style={styles.input}
      />
    </FormRow>
  );
}
