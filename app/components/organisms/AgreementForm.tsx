import React from "react";
import TermRow from "../molecules/TermRow";

interface TermRowAgreeProps {
  checked: boolean;
  onPress: () => void;
}

export default function TermRowAgree({ checked, onPress }: TermRowAgreeProps) {
  return (
    <TermRow
      label="전체 동의하기"
      checked={checked}
      onPress={onPress}
      showSeeAll={false}
      bold
    />
  );
}
