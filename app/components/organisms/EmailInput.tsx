import React from "react";
import RowLabelWithInput from "../molecules/RowLabelWithInput";
import InlineEmailInput from "../molecules/InlineEmailInput";
import Label from "../atoms/Label";

interface EmailInputProps {
  email: string;
  emailDomain: string;
  onChangeEmail: (text: string) => void;
  onChangeEmailDomain: (text: string) => void;
}

const DOMAIN_OPTIONS = ["gmail.com", "naver.com", "hanmail.net"];

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  emailDomain,
  onChangeEmail,
  onChangeEmailDomain,
}) => {
  return (
    <RowLabelWithInput
      label={<Label text="이메일" />}
      input={
        <InlineEmailInput
          email={email}
          emailDomain={emailDomain}
          onChangeEmail={onChangeEmail}
          onChangeEmailDomain={onChangeEmailDomain}
        />
      }
    />
  );
};

export default EmailInput;
