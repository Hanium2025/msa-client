import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Platform, ActivityIndicator,
  Text, } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../components/atoms/SearchBar';
import SearchHistoryList from '../components/molecules/SearchHistoryList'
import BottomTabBar from '../components/molecules/BottomTabBar';   // 하단 탭바


const PHONE_WIDTH = 390;

export default function ProductSearchScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [query, setQuery] = useState("");
  const [histories, setHistories] = useState<string[]>(["유모차", "카시트", "아기띠"]);

  const onTabPress = (tab: string) => {
    setActiveTab(tab);
    // 필요하면 라우팅 연결
    // if (tab === 'profile') router.push('/(me)');
  };

  // 검색 실행 (아이콘/엔터)
  const onSubmitSearch = useCallback(() => {
    if (!query.trim()) return;
    // 최근 검색어에 추가 (중복 제거)
    setHistories((prev) => [query.trim(), ...prev.filter((v) => v !== query.trim())]);
    router.push({
      pathname: "/(productSearch)/[keyword]",
      params: { keyword: query.trim() },
    });
  }, [query, router]);

  // 리스트 아이템 탭 (검색어 눌렀을 때)
  const onPressKeyword = useCallback((kw: string) => {
    setQuery(kw);
    router.push({
      pathname: "/(productSearch)/[keyword]",
      params: { keyword: kw },
    });
  }, [router]);

  // 리스트 아이템 삭제 (X 아이콘)
  const onPressDelete = useCallback((kw: string) => {
    setHistories((prev) => prev.filter((v) => v !== kw));
  }, []);

  // 모두 삭제
  const onClearAll = useCallback(() => setHistories([]), []);

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        {/* 스크롤 영역 */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 12}} // 탭바와 살짝 간격
          showsVerticalScrollIndicator={false}
        >
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmit={onSubmitSearch}
          />
          <SearchHistoryList
            histories={histories}
            onSelect={onPressKeyword}
            onRemove={onPressDelete}
            onClearAll={onClearAll}
          />
          
        </ScrollView>

        {/* 고정 하단 탭바 (스크롤 밖) */}
        <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#F5F6F7' : '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: '#fff',
    maxWidth: Platform.OS === 'web' ? PHONE_WIDTH : undefined,
    width: Platform.OS === 'web' ? PHONE_WIDTH : undefined,
    alignSelf: 'center',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
  },
});