import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function CameraBlock({ label, initialData, onChange }) {
  const [photo, setPhoto] = useState(initialData?.photo || null);
  const [point, setPoint] = useState(initialData?.point || "");
  const [detail, setDetail] = useState(initialData?.detail || "");
  const [impossible, setImpossible] = useState(initialData?.impossible || false);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images, // ✅ version non-dépréciée
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      handleChange(uri, point, detail, impossible);
    }
  };

  const handleChange = (newPhoto, newPoint, newDetail, newImpossible) => {
    onChange({
      photo: newPhoto,
      point: newPoint,
      detail: newDetail,
      impossible: newImpossible,
    });
  };

  const toggleImpossible = () => {
    setImpossible(!impossible);
    handleChange(photo, point, detail, !impossible);
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        {label}
      </Text>

      <Button mode="outlined" onPress={pickImage}>
        {photo ? "Changer photo" : "Prendre photo"}
      </Button>
      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: 200, height: 150, marginTop: 10, borderRadius: 10 }}
        />
      )}

      <TextInput
        label="Point (ex: égout, fosse)"
        value={point}
        onChangeText={(text) => {
          setPoint(text);
          handleChange(photo, text, detail, impossible);
        }}
        style={{ marginTop: 10 }}
      />

      <TextInput
        label="Détail (ex: trottoir, jardin, cour...)"
        value={detail}
        onChangeText={(text) => {
          setDetail(text);
          handleChange(photo, point, text, impossible);
        }}
        style={{ marginTop: 10 }}
      />

      <TouchableOpacity
        onPress={toggleImpossible}
        style={{
          marginTop: 15,
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: impossible ? "#ff4d4d" : "#ddd",
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: impossible ? "#fff" : "#000", fontWeight: "bold" }}>
          Impossible d’aller plus loin
        </Text>
      </TouchableOpacity>
    </View>
  );
}
