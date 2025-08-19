import React, { useEffect, useRef, useCallback } from "react";
import { View, Image, StyleSheet, Alert, Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Button from "../atoms/Button";
import { getKakaoConfig, kakaoLogin } from "../../lib/api/user";
import { setAccessToken } from "../../lib/api";
import { tokenStore } from "../../auth/tokenStore";

WebBrowser.maybeCompleteAuthSession();

export default function SocialLoginGroup() {
  // 공통 알림
  const showAlert = (title: string, message?: string) => {
    const text = [title, message].filter(Boolean).join("\n");
    if (Platform.OS === "web") window.alert(text);
    else Alert.alert(title, message);
  };

  const router = useRouter();

  // 웹에서 팝업이 보낸 메시지 수신
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onMessage = async (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "OAUTH_RESULT") return;
      const { code } = e.data || {};
      if (!code) return;

      (async () => {
        try {
          const { email, accessToken } = await kakaoLogin(code);
          await tokenStore.set(accessToken);
          setAccessToken(accessToken);
          console.log("카카오 로그인 성공: ", email);
          router.replace("/(home)");
        } catch (e: any) {
          showAlert("카카오 로그인 실패", e.message);
          router.replace("/(login)");
        }
      })();
      router.replace({
        pathname: "/(home)",
      });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  // 카카오 로그인 팝업 띄우기
  const onKakaoLogin = useCallback(async () => {
    const router = useRouter();
    const { kakaoClientId } = await getKakaoConfig();
    const localKakaoRedirectUri = AuthSession.makeRedirectUri({
      scheme: "frontend",
      path: "/kakaoCallback",
    });

    // 카카오 로그인 링크
    const kakaoLink =
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${kakaoClientId}&redirect_uri=${localKakaoRedirectUri}&response_type=code`;

    if (Platform.OS === "web") {
      const popup = window.open(kakaoLink, "_blank", "width=420,height=640");
      if (!popup) {
        // 팝업 차단된 경우: 같은 탭으로 열기
        window.location.assign(kakaoLink);
      }
    } else {
      // 카카오 로그인 링크로 연결 후 리다이렉트
      await WebBrowser.openAuthSessionAsync(kakaoLink, localKakaoRedirectUri);
    }
  }, []);

  return (
    <View style={styles.socialLoginWrapper}>
      {/* 카카오 로그인 */}
      <Button
        text="카카오 로그인"
        variant="socialLogin"
        backgroundColor="#FEE500"
        textColor="#000"
        icon={
          <Image
            source={require("../../../assets/images/kakao_logo.png")}
            style={styles.socialLoginLogo}
            resizeMode="cover"
          />
        }
        // 카카오 로그인 onPress
        onPress={onKakaoLogin}
      />

      {/* 네이버 로그인 */}
      <Button
        text="네이버 로그인"
        variant="socialLogin"
        backgroundColor="#03C75A"
        textColor="#fff"
        icon={
          <Image
            source={require("../../../assets/images/naver_logo.png")}
            style={styles.socialLoginLogo}
            resizeMode="cover"
          />
        }
        // 네이버 로그인 onPress
        onPress={() => console.log("네이버 로그인")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  socialLoginWrapper: {
    width: 313,
    height: 102,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  socialLoginLogo: {
    width: 23,
    height: 23,
    marginRight: 74,
    marginLeft: 14,
  },
});
