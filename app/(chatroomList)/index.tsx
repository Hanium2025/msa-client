import React, { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import ChatList from "../components/organisms/ChatList";
import type { ChatPreview } from "../components/molecules/ChatListItem";
import BottomTabBar from "../components/molecules/BottomTabBar";
import CreateChatroomButton from "../components/atoms/CreateChatroomButton/CreateChatroomButton";
import ChatEmptyState from "../components/molecules/ChatListItem/ChatEmptyState";
import { getMyChatroomList } from "../lib/api/chat";

export default function ChatListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home"); // 홈
  const [data, setData] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const onTabPress = (tab: string) => {
    setActiveTab(tab);
    // 필요하면 라우팅 연결
    // if (tab === 'profile') router.push('/(me)');
  };

  useEffect(() => {
    (async () => {
      try {
        const token =
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImlkIjoyLCJleHAiOjE3NTU3NjI3MTgsImVtYWlsIjoiaGVsbG8yQGVtYWlsLmNvbSJ9.N74ydEAoNwPUPq9yz68OLrbp1t0BDPRUOLWduwJLwrEyci0HVfN8C2qODWIiq1Mkdx2UQaMvWdhUtQS9z8-sUg";
        const list = await getMyChatroomList(token);
        console.log("flfflf: ", list);
        setData(list);
      } catch (e: any) {
        setError(e?.message ?? "채팅방 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goBrowse = () => {
    // 원하는 곳으로 이동 (예: 홈/카테고리/상품목록 등)
    router.push("/home"); // 실제 경로에 맞게 조정
  };

  // const data: ChatPreview[] = useMemo(
  //   () => [
  //     {
  //       id: "1",
  //       partnerName: "홍길동",
  //       productTitle: "청바지팔아요",
  //       lastMessage: "네, 직거래 선택해서 거래 요청주세요!",
  //       updatedAt: new Date(),
  //       unreadCount: 0,
  //     },
  //     {
  //       id: "2",
  //       partnerName: "김민주",
  //       productTitle: "중고 아이폰 판매",
  //       lastMessage: "사진 한번 자세히 찍어주실 수 있나요?",
  //       updatedAt: Date.now() - 2 * 60 * 60 * 1000,
  //       unreadCount: 3,
  //     },
  //   ],
  //   []
  // );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>채팅</Text>
      <CreateChatroomButton productId={4} receiverId={1} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text>{error}</Text>
        </View>
      ) : data.length === 0 ? (
        <ChatEmptyState onBrowse={goBrowse} />
      ) : (
        <ChatList
          data={data}
          onPress={(id) => {
            const item = data.find((d) => String(d.id) === String(id));

            const rn =
              item?.roomName ?? // 1) 아이템에 roomName이 이미 있으면 그걸 쓰고
              (item // 2) 없으면 아이템이 있을 때
                ? `${item.partnerName}${
                    //    partnerName / productTitle 로 조합
                    item.productTitle ? ` / ${item.productTitle}` : "" // 3) 아이템도 없으면 빈 문자열
                  }`
                : "");
            router.push({
              pathname: "/[chatroomId]",
              params: {
                chatroomId: String(id),
                ...(item?.opponentId
                  ? { opponentId: String(item.opponentId) }
                  : {}),
                ...(rn ? { roomName: rn } : {}),
              }, // 쿼리로 전달
            });
          }}
        />
      )}
      <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "800", padding: 16 },
});
