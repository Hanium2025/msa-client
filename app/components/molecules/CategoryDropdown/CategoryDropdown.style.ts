import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // 필드 컨테이너(한 줄 레이아웃에서 오른쪽 칸)
  container: {
    width: "100%",
  },

  // 필드 박스(텍스트 영역) + 우측 토글 버튼
  box: {
    height: 44,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  boxText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // 전체 화면 백드롭
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent", // 필요하면 'rgba(0,0,0,0.05)' 정도로
  },

  // 분리된 팝오버 패널
  popover: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // shadow(iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    // shadow(Android)
    elevation: 12,
    overflow: "hidden",
  },

  item: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  itemLast: { borderBottomWidth: 0 },
  itemText: { fontSize: 16, color: "#333" },
  itemTextActive: { fontWeight: "600" },
});
