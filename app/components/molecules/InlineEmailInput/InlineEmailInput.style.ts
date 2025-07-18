import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inlineInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inlineInput: {
    flex: 1, // 이메일 입력 영역을 충분히 넓게
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
  },
  atSymbol: {
    marginHorizontal: 4,
    fontSize: 16,
    color: "#000",
  },
  domainSelector: {
    minWidth: 80,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    justifyContent: "center",
  },
  domainText: {
    fontSize: 16,
    color: "#888",
  },
  icon: {
    marginLeft: 4,
  },

  // 드롭다운 모달 스타일
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    marginHorizontal: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 5,
  },
  domainItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
