import { StyleSheet } from "react-native";

export const PRIMARY = "#0F5965";
const LABEL_COL_WIDTH = 72; // 라벨 고정폭(스샷 비율 기준)

const styles = StyleSheet.create({
  wrap: {
    width: "100%",          // 부모 폭에 맞춤(314/360 등 상황별)
    alignSelf: "stretch",
  },

  // 한 줄 레이아웃 + 아래 구분선
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E9EC",
  },

  // 왼쪽 라벨(고정폭)
  label: {
    width: LABEL_COL_WIDTH,
    fontSize: 15,
    fontWeight: "700",
  },

  // 가운데 입력영역(가변)
  content: {
    flex: 1,
    minHeight: 24,
    justifyContent: "center",
  },

  // 텍스트 인풋
  input: {
    fontSize: 15,
    paddingVertical: 0, // 한 줄 느낌
  },

  // 우편번호 찾기(오른쪽 작은 아웃라인 버튼)
  outlineBtn: {
    height: 36,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: {
    color: PRIMARY,
    fontWeight: "700",
  },

  footer: {
    marginTop: 228,      
  },

  // 저장 버튼
  primaryBtn: {
    height: 56,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default styles;
