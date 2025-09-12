import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function SonarPhotosBlock({ initialData = [], onChange }) {
  const [photos, setPhotos] = useState(initialData);

  const pieces = ["Cuisine", "Salle de bain", "WC", "Salon", "Chambre", "Autre"];
  const usages = [
    "Bouchon de calcaire",
    "Gravats",
    "Cassure",
    "Déboîtement",
    "Chambre de visite",
    "Impossible d'aller plus loin",
    "Autre",
  ];
  const etages = ["Cave","RDC","Parking","Étage 1","Étage 2","Étage 3","Étage 4","Autre"];

  const addPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newPhoto = {
        photo: result.assets[0].uri,
        piece: "",
        customPiece: "",
        etage: "",
        customEtage: "",
        usage: "",
        customUsage: "",
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      onChange && onChange(updated);
    }
  };

  const updatePhoto = (index, key, value) => {
    const updated = [...photos];
    updated[index][key] = value;
    setPhotos(updated);
    onChange && onChange(updated);
  };

  const SelectButton = ({ selected, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 8,
        backgroundColor: selected ? "#007AFF20" : "#f0f0f0",
        borderRadius: 6,
        margin: 4,
      }}
    >
      <Text style={{ fontWeight: selected ? "bold" : "normal" }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>📡 Photos Sonar</Text>

      <ScrollView horizontal>
        {photos.map((item, index) => (
          <View
            key={item.photo + index}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginRight: 10,
              borderRadius: 8,
              width: 300,
            }}
          >
            {item.photo && (
              <Image
                source={{ uri: item.photo }}
                style={{ width: 140, height: 140, marginBottom: 10, borderRadius: 6 }}
              />
            )}

            {/* Pièce */}
            <Text style={{ fontWeight: "bold" }}>Pièce</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {pieces.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={item.piece === p}
                  onPress={() => updatePhoto(index, "piece", p)}
                />
              ))}
            </View>
            {item.piece === "Autre" && (
              <TextInput
                mode="outlined"
                label="Préciser la pièce"
                value={item.customPiece}
                onChangeText={(text) => updatePhoto(index, "customPiece", text)}
                style={{ marginBottom: 10 }}
              />
            )}

            {/* Étage */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>Étage</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {etages.map((e) => (
                <SelectButton
                  key={e}
                  label={e}
                  selected={item.etage === e}
                  onPress={() => updatePhoto(index, "etage", e)}
                />
              ))}
            </View>
            {item.etage === "Autre" && (
              <TextInput
                mode="outlined"
                label="Préciser l'étage"
                value={item.customEtage}
                onChangeText={(text) => updatePhoto(index, "customEtage", text)}
                style={{ marginBottom: 10 }}
              />
            )}

            {/* Usage */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>Usage du sonar</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {usages.map((u) => (
                <SelectButton
                  key={u}
                  label={u}
                  selected={item.usage === u}
                  onPress={() => updatePhoto(index, "usage", u)}
                />
              ))}
            </View>
            {item.usage === "Autre" && (
              <TextInput
                mode="outlined"
                label="Préciser l'usage"
                value={item.customUsage}
                onChangeText={(text) => updatePhoto(index, "customUsage", text)}
                style={{ marginBottom: 10 }}
              />
            )}
          </View>
        ))}
      </ScrollView>

      <Button mode="contained" onPress={addPhoto} style={{ marginTop: 10 }}>
        Ajouter une photo sonar
      </Button>
    </View>
  );
}
