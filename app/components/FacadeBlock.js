import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { Button, IconButton } from "react-native-paper";

export default function FacadeBlock({ initialData, onChange }) {
  const [photos, setPhotos] = useState(initialData ? [initialData] : []);

  const addPhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `facade_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });
      const uri = dest.startsWith("file://") ? dest : "file://" + dest;

      const updated = [...photos, uri];
      setPhotos(updated);
      onChange && onChange(updated);
    }
  };

  const removePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onChange && onChange(updated);
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🏠 Photos de façade
      </Text>

      <Button mode="contained" onPress={addPhoto}>
        Ajouter une photo
      </Button>

      {photos.map((uri, index) => (
        <View
          key={index}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            width: 280,
            marginTop: 10,
          }}
        >
          <Image
            source={{ uri }}
            style={{ width: "100%", height: 150, borderRadius: 10 }}
          />
          <IconButton
            icon="delete"
            iconColor="red"
            size={24}
            onPress={() => removePhoto(index)}
          />
        </View>
      ))}
    </View>
  );
}
