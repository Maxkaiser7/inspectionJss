import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { Button, IconButton } from "react-native-paper";

// =======================
// 🖼️ Bloc façade (UI React)
// =======================
export default function FacadeBlock({ initialData, onChange }) {
  const [facade, setFacade] = useState(initialData || null);

  const addFacade = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `facade_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });

      const uri = dest.startsWith("file://") ? dest : "file://" + dest;

      setFacade(uri);
      onChange && onChange(uri);
    }
  };

  const removeFacade = () => {
    setFacade(null);
    onChange && onChange(null);
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🏠 Photo de façade
      </Text>

      {!facade ? (
        <Button mode="contained" onPress={addFacade}>
          Ajouter une photo de façade
        </Button>
      ) : (
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            width: 280,
          }}
        >
          <Image
            source={{ uri: facade }}
            style={{ width: "100%", height: 150, borderRadius: 10 }}
          />

          <IconButton
            icon="delete"
            iconColor="red"
            size={24}
            onPress={removeFacade}
          />
        </View>
      )}
    </View>
  );
}

