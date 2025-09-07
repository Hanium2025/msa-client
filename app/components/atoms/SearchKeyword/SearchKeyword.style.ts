import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center', // 수평 중앙 정렬
    marginTop: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  container: {
    flexDirection: 'row',        // display:flex는 기본값, 대신 방향 지정
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  keyword: {
    overflow: "hidden",
    color: "#000",
    fontFamily: "SF Pro",       
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: -0.43,
  }
});
