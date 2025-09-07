import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F5',
  },
  iconImage: {
    width: 26,
    height: 26,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
});
