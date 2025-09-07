// app/chat/[chatroomId].tsx
import { SafeAreaView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
export { default } from "./index";

// export default function ChatRoomScreen() {
//   const { chatroomId } = useLocalSearchParams<{ chatroomId: string }>();
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Text style={{ fontSize: 20, fontWeight: "700", padding: 16 }}>
//         채팅방 #{chatroomId}
//       </Text>
//       {/* 여기서 chatroomId로 메시지 목록 로딩해서 렌더링 */}
//     </SafeAreaView>
//   );
// }
