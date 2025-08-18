import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface BottomTabBarProps {
  activeTab?: string;                     
  onTabPress?: (tabName: string) => void;
}

const tabImages: Record<
  'notifications' | 'chat' | 'home' | 'community' | 'profile',
  ImageSourcePropType
> = {
  notifications: require('../../../../assets/images/tabs/notifications.png'),
  chat:          require('../../../../assets/images/tabs/chat.png'),
  home:     require('../../../../assets/images/tabs/main.png'),
  community:       require('../../../../assets/images/tabs/community.png'),
  profile:       require('../../../../assets/images/tabs/profile.png'),
};

const TABS = Object.keys(tabImages) as Array<keyof typeof tabImages>;

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = '',
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((name) => {
          const isActive = activeTab === name;
          return (
            <TouchableOpacity
              key={name}
              style={styles.tabItem}
              onPress={() => onTabPress?.(name)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Image source={tabImages[name]} style={styles.icon} resizeMode="contain" />
              </View>
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
  container: { backgroundColor: '#fff' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#F1F2F4', // 선택 시 회색 배경
  },
  icon: { width: 22, height: 22 },
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
