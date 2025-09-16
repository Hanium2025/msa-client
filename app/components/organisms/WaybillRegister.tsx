import React, { useMemo, useState } from "react";
import { View } from "react-native";
import InfoCard from "../../components/atoms/InfoCard";
import CourierPickerRow from "../../components/molecules/CourierPickerRow";
import WaybillNumberRow from "../../components/molecules/WaybillNumberRow";
import Button from "../../components/atoms/Button";

const PRIMARY = "#084C63";

type Payload = { courier: string; invoiceNo: string };

export default function WaybillRegister({
  onSubmit,
}: {
  onSubmit?: (p: Payload) => void;
}) {
  const [courier, setCourier] = useState<string>("");
  const [invoice, setInvoice] = useState<string>("");

  const canSubmit = useMemo(
    () => courier.trim().length > 0 && invoice.trim().length > 0,
    [courier, invoice]
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({ courier, invoiceNo: invoice });
  };

  return (
    <View style={{ flex: 1 }}>
      <InfoCard
        title="배송 정보를 등록해주세요."
        description="주문 건에 대한 택배사 정보와 송장번호를 입력하여 발송 완료 처리하세요."
      >
        <CourierPickerRow value={courier} onChange={setCourier} />
        <WaybillNumberRow value={invoice} onChange={setInvoice} />
      </InfoCard>

      <View style={{ paddingHorizontal: 16, marginTop: 18, overflow: "visible" }}>
        <Button
          variant="waybillPrimary"
          text="등록하기"
          onPress={handleSubmit}
          iconSource={require("../../../assets/images/send-arrow.png")}
          style={{
            width: 280,
            alignSelf: "center",
            backgroundColor: PRIMARY,
          }}
          disabled={!canSubmit}
        />
      </View>
    </View>
  );
}
