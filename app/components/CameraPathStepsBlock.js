import * as FileSystem from "expo-file-system"; // ✅ ajoute ça
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";

export default function CameraPathStepsBlock({ initialData, onChange }) {
  const [steps, setSteps] = useState(initialData || []);

  const sonarTypes = [
    "Localiser la direction de la caméra",
    "Localiser une fissure",
    "Localiser une cassure",
    "Localiser un déboîtement",
    "Localiser un désaxement",
    "Localiser un bouchon",
    "Autre",
  ];

  const pieces = ["Cuisine", "Salle de bain", "WC", "Garage", "Cave", "Jardin", "Autre"];

  // === Ajouter étape classique ===
  const addStep = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      // ✅ Sauvegarde locale de la photo dans documentDirectory
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });

      const uri = dest.startsWith("file://") ? dest : "file://" + dest;


      const newStep = { type: "photo", photo: uri, point: "", detail: "" };
      const updatedSteps = [...steps, newStep];
      setSteps(updatedSteps);
      onChange(updatedSteps);
    }
  };

  // === Ajouter étape sonar ===
  const addSonar = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `sonar_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });

      const newStep = {
        type: "sonar",
        photo: uri,
        piece: "",
        sonarType: "",
        customSonar: "",
        customPiece: "",
      };
      
      const updatedSteps = [...steps, newStep];
      setSteps(updatedSteps);
      onChange(updatedSteps);
    }
  };

  const updateStep = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
    onChange(updatedSteps);
  };

  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    onChange(updatedSteps);
  };

  const SelectButton = ({ selected, label, onPress }) => (
    <Button mode={selected ? "contained" : "outlined"} onPress={onPress} style={{ margin: 4 }}>
      {label}
    </Button>
  );

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        📸 Étapes du parcours caméra
      </Text>

      <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
        <Button mode="contained" onPress={addStep}>
          Ajouter une étape (photo)
        </Button>
        <Button mode="outlined" onPress={addSonar}>
          Ajouter sonar
        </Button>
      </View>

      <ScrollView horizontal>
        {steps.map((step, index) => (
          <View
            key={index}
            style={{
              marginTop: 15,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              marginRight: 10,
              width: 280,
            }}
          >
            {step.photo && (
              <Image
                source={{ uri: step.photo }}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
            )}

            {step.type === "photo" && (
              <>
                <TextInput
                  label="Point intermédiaire"
                  value={step.point}
                  onChangeText={(text) => updateStep(index, "point", text)}
                  style={{ marginTop: 10 }}
                />
                <TextInput
                  label="Détail (ex: coude, jonction...)"
                  value={step.detail}
                  onChangeText={(text) => updateStep(index, "detail", text)}
                  style={{ marginTop: 10 }}
                />
              </>
            )}

            {step.type === "sonar" && (
              <>
                <Text style={{ fontWeight: "bold", marginTop: 10 }}>⚡ Sonar</Text>
                <Text style={{ marginTop: 5 }}>📍 Pièce</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {pieces.map((p) => (
                    <SelectButton
                      key={p}
                      label={p}
                      selected={step.piece === p}
                      onPress={() => updateStep(index, "piece", p)}
                    />
                  ))}
                </View>
                {step.piece === "Autre" && (
                  <TextInput
                    label="Préciser la pièce"
                    value={step.customPiece}
                    onChangeText={(text) => updateStep(index, "customPiece", text)}
                    style={{ marginTop: 10 }}
                  />
                )}

                <Text style={{ marginTop: 10 }}>🎯 Type sonar</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {sonarTypes.map((t) => (
                    <SelectButton
                      key={t}
                      label={t}
                      selected={step.sonarType === t}
                      onPress={() => updateStep(index, "sonarType", t)}
                    />
                  ))}
                </View>
                {step.sonarType === "Autre" && (
                  <TextInput
                    label="Préciser utilisation sonar"
                    value={step.customSonar}
                    onChangeText={(text) => updateStep(index, "customSonar", text)}
                    style={{ marginTop: 10 }}
                  />
                )}
              </>
            )}

            <IconButton icon="delete" iconColor="red" size={24} onPress={() => removeStep(index)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
