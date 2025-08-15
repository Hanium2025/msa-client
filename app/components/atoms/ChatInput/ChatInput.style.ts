// components/atoms/ChatInput/ChatInput.style.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    fontSize: 16,
    maxHeight: 120, // 여러 줄 입력 시 최대 높이
  },
});
