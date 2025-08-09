import React from "react";
import RowLabelWithInput from "../molecules/RowLabelWithInput";
import RowWithButton from "../molecules/RowWithButton";
import Label from "../atoms/Label";
import UnderlineInput from "../atoms/UnderlineInput";
import Button from "../atoms/Button";

interface CodeVerificationInputProps {
  code: string;
  onChangeCode: (text: string) => void;
  onPressVerify: () => void;
}

const CodeVerificationInput: React.FC<CodeVerificationInputProps> = ({
  code,
  onChangeCode,
  onPressVerify,
}) => {
  return (
    <RowLabelWithInput
      label={<Label text="인증번호" />}
      input={
        <RowWithButton
          input={
            <UnderlineInput
              placeholder="인증번호 입력"
              keyboardType="number-pad"
              value={code}
              onChangeText={onChangeCode}
            />
          }
          button={<Button text="확인" onPress={onPressVerify} />}
        />
      }
    />
  );
};

export default CodeVerificationInput;
