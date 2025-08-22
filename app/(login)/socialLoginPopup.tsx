import { useEffect } from "react";
import { ActivityIndicator, View, Alert, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function OAuthCallback() {
  // 공통 알림
  const showAlert = (title: string, message?: string) => {
    const text = [title, message].filter(Boolean).join("\n");
    if (Platform.OS === "web") window.alert(text);
    else Alert.alert(title, message);
  };

  const { code, state, provider } = useLocalSearchParams<{
    code?: string;
    state?: string;
    provider?: string;
  }>();

  useEffect(() => {
    if (Platform.OS !== "web") return;

    // 팝업(새 창)에서만 opener 존재 (원래 탭을 가리킴)
    const opener = (window as any).opener as Window | null;
    if (!opener) return; // opener가 없으면 postMessage 불가

    // code가 쿼리로 넘어왔다면
    if (typeof code === "string") {
      // 원래 탭으로 안전하게 전달 (같은 오리진으로만 전송)
      opener.postMessage(
        { type: "OAUTH_RESULT", code, provider },
        window.location.origin // targetOrigin: 반드시 명시!
      );
      // 메시지 보낸 후 팝업 닫기
      window.close();
    }
  }, [code, state]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
