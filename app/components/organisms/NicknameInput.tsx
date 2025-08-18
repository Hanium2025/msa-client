import React from "react";
import RowLabelWithInput from "../molecules/RowLabelWithInput";
import Label from "../atoms/Label";
import UnderlineInput from "../atoms/UnderlineInput";

interface NicknameInputProps {
  nickname: string;
  onChangeNickname: (text: string) => void;
}

const NicknameInput: React.FC<NicknameInputProps> = ({
  nickname,
  onChangeNickname,
}) => {
  return (
    <RowLabelWithInput
      label={
        <Label
          text="닉네임"
          style={{
            fontWeight: "bold",
            marginTop: 8,
          }}
        />
      }
      input={
        <UnderlineInput
          placeholder="닉네임 입력"
          value={nickname}
          onChangeText={onChangeNickname}
        />
      }
    />
  );
};

export default NicknameInput;
