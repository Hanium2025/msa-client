import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { styles } from "./InlineEmailInput.style";

interface InlineEmailInputProps {
  email: string;
  emailDomain: string;
  onChangeEmail: (text: string) => void;
  onChangeEmailDomain: (text: string) => void;
}

const DOMAIN_OPTIONS = ["gmail.com", "naver.com", "hanmail.net"];

const InlineEmailInput: React.FC<InlineEmailInputProps> = ({
  email,
  emailDomain,
  onChangeEmail,
  onChangeEmailDomain,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <View style={styles.inlineInputWrapper}>
      <TextInput
        style={styles.inlineInput}
        value={email}
        onChangeText={onChangeEmail}
        placeholder="이메일 입력"
        placeholderTextColor="#ccc"
      />
      <Text style={styles.atSymbol}>@</Text>

      <TouchableOpacity
        style={styles.domainSelector}
        onPress={() => setDropdownVisible(true)}
      >
        <Text style={styles.domainText}>{emailDomain || "선택"}</Text>
      </TouchableOpacity>

      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={DOMAIN_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.domainItem}
                  onPress={() => {
                    onChangeEmailDomain(item);
                    setDropdownVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default InlineEmailInput;
