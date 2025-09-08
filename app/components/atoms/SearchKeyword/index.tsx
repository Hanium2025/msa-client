import React from 'react';
import { View, Text, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './SearchKeyword.style';

interface SearchKeywordProps {
  text: string;
  onPressDelete: () => void;
  onPressKeyword: () => void;
}

export const SearchKeyword = ({
  text,
  onPressDelete,
  onPressKeyword,
}: SearchKeywordProps) =>  (
  <View style={styles.wrapper}>
    <View style={styles.container}>
        <Pressable onPress={onPressKeyword}>
          <Text
            style={styles.keyword}
          >{ text }</Text>
        </Pressable>

        <Pressable onPress={onPressDelete} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="rgba(60,60,67,0.6)" style={{ marginLeft: 'auto' }}/>
        </Pressable>
    </View>
  </View>
);
