import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";

export default function CameraPathStartBlock({ initialData, onChange }) {
  const [starts, setStarts] = useState(Array.isArray(initialData) ? initialData : []);

  const addStart = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `start_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });

      const uri = dest.startsWith("file://") ? dest : "file://" + dest;

      const newStart = { photo: uri, point: "", detail: "" };
      const updatedStarts = [...starts, newStart];
      setStarts(updatedStarts);
      onChange && onChange(updatedStarts);
    }
  };

  const updateStart = (index, field, value) => {
    const updatedStarts = [...starts];
    updatedStarts[index][field] = value;
    setStarts(updatedStarts);
    onChange && onChange(updatedStarts);
  };

  const removeStart = (index) => {
    const updatedStarts = starts.filter((_, i) => i !== index);
    setStarts(updatedStarts);
    onChange && onChange(updatedStarts);
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🚀 Points de départ caméra
      </Text>

      <Button mode="contained" onPress={addStart}>
        Ajouter un point de départ
      </Button>

      <ScrollView horizontal style={{ marginTop: 15 }}>
        {starts.map((start, index) => (
          <View
            key={index}
            style={{
              marginRight: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              width: 280,
            }}
          >
            {start.photo && (
              <Image
                source={{ uri: start.photo }}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
            )}

            <TextInput
              label="Point de départ"
              value={start.point}
              onChangeText={(text) => updateStart(index, "point", text)}
              style={{ marginTop: 10 }}
            />

            <TextInput
              label="Détail (ex: orientation, obstacles...)"
              value={start.detail}
              onChangeText={(text) => updateStart(index, "detail", text)}
              style={{ marginTop: 10 }}
            />

            <IconButton
              icon="delete"
              iconColor="red"
              size={24}
              onPress={() => removeStart(index)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
