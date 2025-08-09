import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    width: 341,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ✅ 판매 상태 버튼 스타일
  statusBox: {
    width: 113,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#000000',
    fontWeight: 'bold',
  },

  // ✅ 채팅 버튼
  buttonDark: {
    width: 219,
    height: 40,
    flex: 1,
    backgroundColor: '#004D64',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});