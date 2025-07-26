import React from "react";
import RowLabelWithInput from "../molecules/RowLabelWithInput";
import RowWithButton from "../molecules/RowWithButton";
import Label from "../atoms/Label";
import UnderlineInput from "../atoms/UnderlineInput";
import Button from "../atoms/Button";

interface PhoneInputProps {
  phone: string;
  onChangePhone: (text: string) => void;
  onPressSendCode: () => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  phone,
  onChangePhone,
  onPressSendCode,
}) => {
  return (
    <RowLabelWithInput
      label={<Label text="전화번호" />}
      input={
        <RowWithButton
          input={
            <UnderlineInput
              placeholder="전화번호 입력"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={onChangePhone}
            />
          }
          button={<Button text="인증" onPress={onPressSendCode} />}
        />
      }
    />
  );
};

export default PhoneInput;
