import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import styles from "./TrackingTable.style";

export type TrackingEvent = {
  time: string | number | Date;  
  location: string;
  status: string;
};

function formatWithSeconds(input: string | number | Date): string {
  if (typeof input === "string" && /\d{2}:\d{2}:\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (isNaN(d.getTime())) return String(input);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

type Props = { data: TrackingEvent[] };

export default function TrackingTable({ data }: Props) {
  const rows = useMemo(
    () => data.map(e => ({ ...e, _timeText: formatWithSeconds(e.time) })),
    [data]
  );

  const Header = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell, styles.timeCol]}>시간</Text>
      <Text style={[styles.cell, styles.headerCell, styles.locCol]}>현재 위치</Text>
      <Text style={[styles.cell, styles.headerCell, styles.statCol]}>배송상태</Text>
    </View>
  );

  const Item = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.row, index === rows.length - 1 ? styles.rowLast : styles.rowDivider]}>
      <Text style={[styles.cell, styles.timeCol, styles.timeMono]} numberOfLines={1}>
        {item._timeText}
      </Text>
      <Text style={[styles.cell, styles.locCol]} numberOfLines={1}>{item.location}</Text>
      <Text style={[styles.cell, styles.statCol]} numberOfLines={1}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.table}>
      <Header />
      <FlatList
        data={rows}
        renderItem={Item}
        keyExtractor={(_, i) => String(i)}
        scrollEnabled={false}
      />
    </View>
  );
}
