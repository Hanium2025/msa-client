import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface BottomTabBarProps {
  activeTab?: string;
  onTabPress?: (tabName: string) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  activeTab = '',
  onTabPress 
}) => {
  const tabs = [
    { name: 'notifications', icon: 'notifications-outline', activeIcon: 'notifications' },
    { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
    { name: 'documents', icon: 'document-text-outline', activeIcon: 'document-text' },
    { name: 'explore', icon: 'globe-outline', activeIcon: 'globe' },
    { name: 'profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  const handleTabPress = (tabName: string) => {
    onTabPress?.(tabName);
  };

  return (
    <View style={styles.container}>
      {/* 탭바 */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const iconName = isActive ? tab.activeIcon : tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={iconName as any} 
                size={24} 
                color={isActive ? '#007AFF' : '#666'} 
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* 홈 인디케이터 */}
      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default BottomTabBar;