import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";

export default function CameraPathStartBlock({ initialData, onChange }) {
  const [starts, setStarts] = useState(Array.isArray(initialData) ? initialData : []);

  // === Types de points ===
  const startPoints = [
    "WC",
    "Citerne d’eau de pluie",
    "Regard",
    "Baignoire",
    "Chambre de visite ACCESSIBLE",
    "Évier",
    "Descente pluviale",
    "Machine à laver",
    "Douche",
    "Siphon disconnecteur",
    "Sterput",
    "Fosse septique ACCESSIBLE",
    "DEGRAISSEUR ACCESSIBLE",
    "Avaloirs",
    "Autre",
  ];

  // === Pièces possibles ===
  const pieces = [
    "Cuisine",
    "Salle de bain",
    "WC",
    "Garage",
    "Cave",
    "Jardin",
    "Autre",
  ];

  // === Étages possibles ===
  const etages = [
    "Cave",
    "RDC",
    "Parking",
    "Étage 1",
    "Étage 2",
    "Étage 3",
    "Étage 4",
    "Étage 5",
    "Étage 6",
    "Étage 7",
    "Étage 8",
    "Étage 9",
    "Étage 10",
    "Autre",
  ];

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

      const newStart = {
        photo: uri,
        point: "",
        customPoint: "",
        piece: "",
        customPiece: "",
        etage: "",
        customEtage: "",
        detail: "",
      };
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

  const SelectButton = ({ selected, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 8,
        backgroundColor: selected ? "#007AFF20" : "#f0f0f0",
        borderRadius: 6,
        margin: 4,
        flexGrow: 1,
      }}
    >
      <Text style={{ fontWeight: selected ? "bold" : "normal" }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🚀 Point de départ
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
              width: 300,
            }}
          >
            {start.photo && (
              <Image
                source={{ uri: start.photo }}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
            )}

            {/* Sélection du point */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>📍 Point</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {startPoints.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={start.point === p}
                  onPress={() => updateStart(index, "point", p)}
                />
              ))}
            </View>

            {start.point === "Autre" && (
              <TextInput
                label="Préciser le point"
                value={start.customPoint}
                onChangeText={(text) => updateStart(index, "customPoint", text)}
                style={{ marginTop: 10 }}
              />
            )}

            {/* Sélection de la pièce */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>🏠 Pièce</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {pieces.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={start.piece === p}
                  onPress={() => updateStart(index, "piece", p)}
                />
              ))}
            </View>

            {start.piece === "Autre" && (
              <TextInput
                label="Préciser la pièce"
                value={start.customPiece}
                onChangeText={(text) => updateStart(index, "customPiece", text)}
                style={{ marginTop: 10 }}
              />
            )}

            {/* Sélection de l’étage */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>🏢 Étage</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {etages.map((e) => (
                <SelectButton
                  key={e}
                  label={e}
                  selected={start.etage === e}
                  onPress={() => updateStart(index, "etage", e)}
                />
              ))}
            </View>

            {start.etage === "Autre" && (
              <TextInput
                label="Préciser l’étage"
                value={start.customEtage}
                onChangeText={(text) => updateStart(index, "customEtage", text)}
                style={{ marginTop: 10 }}
              />
            )}

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
