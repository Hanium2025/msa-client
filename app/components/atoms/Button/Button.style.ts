import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#023047',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C1F209',
  },

  wrapper: {
    alignItems: 'center', // ⬅️ 화면 중앙 정렬
    marginTop: 12,
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 10,
    padding: 1, // 테두리 두께
  },
  registerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: 376, // ✅ 원하는 너비로 조정
    height: 44,
    borderRadius: 10,

    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
});


