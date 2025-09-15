import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import FormRow from "../../atoms/FormRow";
import Button from "../../atoms/Button";
import AnchoredSelect, { Anchor } from "../../atoms/AnchoredSelect";
import styles from "./CourierPickerRow.style";

const COURIERS = ["CJ대한통운","한진택배","우체국택배","로젠택배","롯데택배"];

type Props = {
  value?: string;
  onChange?: (v: string) => void;
};

export default function CourierPickerRow({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState<Anchor>(null);
  const rowRef = useRef<View>(null);

  const open = () => {
    // 줄의 화면 좌표 측정
    rowRef.current?.measureInWindow?.((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setVisible(true);
    });
  };

  return (
    <>
      {/* measure 대상은 native view여야 하므로 View로 감싸고 ref 부여 */}
      <View ref={rowRef} collapsable={false}>
        <FormRow
          label="택배사"
          right={
            <Button
              variant="waybillSelect"
              text="선택"
              onPress={open}
              // Ionicons 대신 PNG 아이콘 사용
              iconSource={require("../../../../assets/images/chevron-down.png")}
            />
          }
        >
          {value ? (
            <Text style={styles.value}>{value}</Text>
          ) : (
            <Text style={styles.placeholder}>  </Text>
          )}
        </FormRow>
      </View>

      <AnchoredSelect
        visible={visible}
        items={COURIERS}
        selected={value}
        anchor={anchor}
        onSelect={(v) => onChange?.(v)}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
