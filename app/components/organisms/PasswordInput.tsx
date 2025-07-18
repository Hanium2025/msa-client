import React from "react";
import RowLabelWithInput from "../molecules/RowLabelWithInput";
import Label from "../atoms/Label";
import UnderlineInput from "../atoms/UnderlineInput";

interface PasswordInputProps {
  password: string;
  onChangePassword: (text: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  onChangePassword,
}) => {
  return (
    <RowLabelWithInput
      label={<Label text="비밀번호" />}
      input={
        <UnderlineInput
          placeholder="비밀번호 입력 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
          secureTextEntry
          value={password}
          onChangeText={onChangePassword}
        />
      }
    />
  );
};

export default PasswordInput;
