// components/organisms/ReportForm.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InfoRow as ReportInputRow } from "../atoms/ReportInfoRow";
import { ReportDetailInput } from "../molecules/ReportDetailInput";

const REASONS = [
  "불법 거래",
  "욕설/인신공격 포함",
  "개인정보 노출",
  "음란성/선전성",
  "사기 거래 이력",
  "기타",
];

type Props = {
  reason: string;
  onChangeReason: (v: string) => void; // ✅ 함수 이름 명확화
  detail: string;
  onChangeDetail: (v: string) => void; // ✅ 함수 이름 명확화
};

export const ReportForm: React.FC<Props> = ({
  reason,
  onChangeReason,
  detail,
  onChangeDetail,
}) => {
  // 드롭다운 위치/열림 상태
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ y: number; height: number }>({
    y: 0,
    height: 0,
  });

  const handleSelect = (r: string) => {
    onChangeReason(r); // ✅ 부모의 setReason 호출
    setMenuOpen(false);
  };

  return (
    <View style={s.container}>
      {/* 예시: 입력 아톰 (원하면 폼 state로 바꿔도 됨) */}
      <ReportInputRow
        label="상품명"
        value={""}
        onChangeText={() => {}}
        placeholder="게시글 제목 가나다"
        textColor="#084C63"
      />
      <ReportInputRow
        label="판매자"
        value={""}
        onChangeText={() => {}}
        placeholder="홍길동"
        textColor="#084C63"
      />

      {/* 신고 사유 버튼형 드롭다운 */}
      <View
        style={s.row}
        onLayout={(e) =>
          setAnchor({
            y: e.nativeEvent.layout.y,
            height: e.nativeEvent.layout.height,
          })
        }
      >
        <Text style={s.label}>신고 사유</Text>
        <Pressable
          style={s.selectWrap}
          onPress={() => setMenuOpen(true)}
          hitSlop={8}
        >
          <Text
            numberOfLines={1}
            style={[
              s.selectText,
              (reason ? s.selectTextActive : s.selectTextPlaceholder) as any,
            ]}
          >
            {reason || "선택"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#94A3B8"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>
      <View style={s.divider} />

      {/* 상세 내용 */}
      <ReportDetailInput value={detail} onChange={onChangeDetail} />

      {/* 드롭다운: 행 바로 아래 */}
      {menuOpen && (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuOpen(false)}
          />
          <View
            style={[
              s.dropdown,
              { top: anchor.y + anchor.height + 6, left: 20, right: 20 },
            ]}
          >
            <ScrollView
              style={{ maxHeight: 280 }}
              showsVerticalScrollIndicator={false}
            >
              {REASONS.map((r) => (
                <Pressable
                  key={r}
                  style={s.reasonRow}
                  onPress={() => handleSelect(r)}
                >
                  <Text style={s.reasonText}>{r}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#FFFFFF" },
  row: {
    minHeight: 44,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 14, color: "#000", fontWeight: "400" },
  selectWrap: { flexDirection: "row", alignItems: "center", maxWidth: "70%" },
  selectText: { fontSize: 14, fontWeight: "500", textAlign: "right" },
  selectTextActive: { color: "#084C63" },
  selectTextPlaceholder: { color: "#084C63" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E7EB" },
  dropdown: {
    position: "absolute",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  reasonRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  reasonText: { fontSize: 15, color: "#111827" },
});
