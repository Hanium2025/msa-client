import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // 부모가 row로 배치할 수 있도록 자체는 폭만 차지, 메뉴는 이 컨테이너 기준으로 뜸
  container: {
    position: "relative",
    width: "100%",
  },

  // 한 줄 높이 44px에 맞춰 정렬
  box: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  boxText: {
    fontSize: 16,
    color: "#333",
  },

  // 드롭다운 메뉴: 컨테이너 아래로 겹치게 표시
  menu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    // shadow(iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // shadow(Android)
    elevation: 6,
    zIndex: 1000,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  itemTextActive: {
    fontWeight: "600",
  },
});
