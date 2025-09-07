import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { SearchKeyword } from "../../atoms/SearchKeyword";
import { styles } from "./SearchHistoryList.style";

interface SearchHistoryListProps {
    histories : string[];
    onSelect: (kw: string) => void;
    onRemove: (kw: string) => void;
    onClearAll: () => void;
}

export default function SearchHistoryList({
    histories,
    onSelect,
    onRemove,
    onClearAll
}: SearchHistoryListProps){
    return (
    <View style={styles.wrap}>
      <View style={styles.container}>
        <Text style={styles.title}>최근 검색어</Text>
        <Pressable onPress={onClearAll} hitSlop={8}>
          <Text style={styles.delte}>모두 삭제</Text>
        </Pressable>
      </View>

      <FlatList
        data={histories}
        keyExtractor={(item, idx) => `${item}-${idx}`}
        renderItem={({ item }) => (
          <SearchKeyword
            text={item}
            onPressKeyword={() => onSelect(item)}
            onPressDelete={() => onRemove(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}