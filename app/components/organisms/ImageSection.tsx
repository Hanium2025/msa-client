// components/organisms/ImageSection.tsx
import React from "react";
import { ScrollView, View, Platform } from "react-native";
import RegisterLabel from "../atoms/Label";
import { Thumbnail } from "../molecules/Thumbnail";
import { ImageUploader } from "../molecules/ImageUploader";

type Props = {
  existing: { id: number; uri: string; keep: boolean }[];
  newImages: File[];
  onRemoveExisting: (id: number) => void;
  onRemoveNew: (idx: number) => void;
  onAddNew: (list: File[]) => void;
  remaining: number;
};

export function ImageSection({
  existing,
  newImages,
  onRemoveExisting,
  onRemoveNew,
  onAddNew,
  remaining,
}: Props) {
  return (
    <>
      <RegisterLabel required text="이미지 (최대 5장)" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {existing.filter(e => e.keep).map(img => (
          <Thumbnail key={`old-${img.id}`} uri={img.uri} onRemove={() => onRemoveExisting(img.id)} />
        ))}

        {newImages.map((file, idx) => (
          <Thumbnail
            key={`new-${idx}`}
            uri={Platform.OS === "web" ? URL.createObjectURL(file) : undefined}
            isNew
            onRemove={() => onRemoveNew(idx)}
          />
        ))}

        {remaining > 0 && (
          <View style={{ width: 192, height: 124 }}>
            <ImageUploader images={newImages} setImages={onAddNew} buttonOnly size={{ width: 192, height: 124 }} />
          </View>
        )}
      </ScrollView>
    </>
  );
}
