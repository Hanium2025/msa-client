import React from "react";
import RowLabelWithInput from "../molecules/RowLabelWithInput";
import Label from "../atoms/Label";
import UnderlineInput from "../atoms/UnderlineInput";

interface ConfirmPasswordInputProps {
  confirmPassword: string;
  onChangeConfirmPassword: (text: string) => void;
}

const ConfirmPasswordInput: React.FC<ConfirmPasswordInputProps> = ({
  confirmPassword,
  onChangeConfirmPassword,
}) => {
  return (
    <RowLabelWithInput
      label={
        <Label
          text={"비밀번호\n확인"}
          style={{
            fontWeight: "bold",
          }}
        />
      }
      input={
        <UnderlineInput
          placeholder="비밀번호 재입력"
          secureTextEntry
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
        />
      }
    />
  );
};

export default ConfirmPasswordInput;
