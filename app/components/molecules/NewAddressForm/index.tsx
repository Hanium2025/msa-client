import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles, { PRIMARY } from "./NewAddressForm.style";

export type NewAddress = {
  zipcode: string;
  address1: string;
  address2: string;
  label: string;     // 배송지명(집/회사 등)
  recipient: string; // 수령인
  phone: string;
};

type Props = {
  initial?: Partial<NewAddress>;
  onSave?: (form: NewAddress) => void;
  // 다음(카카오) 우편번호 찾기 연동 시 fill({ zipcode, address1 }) 호출
  onFindPostcode?: (fill: (patch: Partial<NewAddress>) => void) => void;
};

export default function NewAddressForm({ initial, onSave, onFindPostcode }: Props) {
  const [form, setForm] = useState<NewAddress>({
    zipcode: "",
    address1: "",
    address2: "",
    label: "",
    recipient: "",
    phone: "",
    ...initial,
  });
  const insets = useSafeAreaInsets();

  const onChange = (k: keyof NewAddress, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const canSave = useMemo(() => {
    const { zipcode, address1, recipient, phone } = form;
    return zipcode.trim() && address1.trim() && recipient.trim() && phone.trim();
  }, [form]);

  const handleFind = () => {
    if (onFindPostcode) {
      onFindPostcode(patch => setForm(prev => ({ ...prev, ...patch })));
      return;
    }
    // 데모(연동 전) 자동 채움
    setForm(prev => ({
      ...prev,
      zipcode: prev.zipcode || "02831",
      address1: prev.address1 || "서울특별시 성북구 화랑로 13길 60",
    }));
  };

  const handleSave = () => onSave?.(form);

  return (
    <View style={styles.wrap}>
      {/* 우편번호 */}
      <View style={styles.row}>
        <Text style={styles.label}>우편번호</Text>
        <View style={styles.content}>
          <TextInput
            value={form.zipcode}
            onChangeText={v => onChange("zipcode", v)}
            placeholder="우편번호를 입력해주세요."
            placeholderTextColor="rgba(0,0,0,0.35)"
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>
        <Pressable onPress={handleFind} style={styles.outlineBtn}>
          <Text style={styles.outlineText}>우편번호 찾기</Text>
        </Pressable>
      </View>

      {/* 주소지 */}
      <View style={styles.row}>
        <Text style={styles.label}>주소지</Text>
        <View style={styles.content}>
          <TextInput
            value={form.address1}
            onChangeText={v => onChange("address1", v)}
            placeholder="우편번호 찾기를 통해 입력해주세요."
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={styles.input}
          />
        </View>
      </View>

      {/* 상세주소 */}
      <View style={styles.row}>
        <Text style={styles.label}>상세주소</Text>
        <View style={styles.content}>
          <TextInput
            value={form.address2}
            onChangeText={v => onChange("address2", v)}
            placeholder="상세주소를 입력해주세요."
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={styles.input}
          />
        </View>
      </View>

      {/* 배송지명 */}
      <View style={styles.row}>
        <Text style={styles.label}>배송지명</Text>
        <View style={styles.content}>
          <TextInput
            value={form.label}
            onChangeText={v => onChange("label", v)}
            placeholder="집, 회사 등 배송지명을 입력해주세요."
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={styles.input}
          />
        </View>
      </View>

      {/* 수령인 */}
      <View style={styles.row}>
        <Text style={styles.label}>수령인</Text>
        <View style={styles.content}>
          <TextInput
            value={form.recipient}
            onChangeText={v => onChange("recipient", v)}
            placeholder="택배를 수령하실 이름을 입력해주세요."
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={styles.input}
          />
        </View>
      </View>

      {/* 전화번호 */}
      <View style={styles.row}>
        <Text style={styles.label}>전화번호</Text>
        <View style={styles.content}>
          <TextInput
            value={form.phone}
            onChangeText={v => onChange("phone", v)}
            placeholder="배송을 안내받을 전화번호를 입력해주세요."
            placeholderTextColor="rgba(0,0,0,0.35)"
            keyboardType={Platform.OS === "ios" ? "number-pad" : "phone-pad"}
            style={styles.input}
          />
        </View>
      </View>

      {/* 저장하기 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={({ pressed }) => [
            styles.primaryBtn,
            !canSave && { opacity: 0.5 },
            pressed && { transform: [{ translateY: 1 }] },
          ]}
        >
          <Text style={styles.primaryText}>저장하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

export { PRIMARY };
