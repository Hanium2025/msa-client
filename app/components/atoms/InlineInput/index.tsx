import React from "react";
import { TextInput, View, Text } from "react-native";
import { styles } from "./InlineInput.style";

export interface InlineInputProps {
  email: string;
  emailDomain: string;
  onEmailChange: (text: string) => void;
  onDomainChange: (text: string) => void;
}

const InlineInput: React.FC<InlineInputProps> = ({
  email,
  emailDomain,
  onEmailChange,
  onDomainChange,
}) => {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[styles.input, { flex: 2 }]}
        placeholder="이메일 입력"
        value={email}
        onChangeText={onEmailChange}
        placeholderTextColor="#ccc"
      />
      <Text style={styles.atSymbol}>@</Text>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder="선택"
        value={emailDomain}
        onChangeText={onDomainChange}
        placeholderTextColor="#ccc"
      />
    </View>
  );
};

export default InlineInput;
