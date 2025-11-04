import { StyleSheet } from 'react-native';

export const CategoryCircleStyles = StyleSheet.create({
  container: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginRight: 20,
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,           
    marginBottom: 6,
  },

  icon: {
    resizeMode: 'contain', 
  },

  text: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    includeFontPadding: false,
    flexShrink: 1,
    width: '100%',
    height: 32,          
  },
});
