import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton } from "react-native-paper";

export default function CameraPathStepsBlock({ initialData, onChange }) {
  const [steps, setSteps] = useState(initialData || []);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "L’application a besoin de la caméra et de la galerie pour fonctionner."
        );
      }
    })();
  }, []);
  
  const pieces = [
    "Cuisine",
    "Salle de bain",
    "WC",
    "Garage",
    "Cave",
    "Jardin",
    "Salon",
    "Cour",
    "Devant la maison",
  ];

  const etages = [
    "Cave",
    "Parking",
    "RDC",
    "Étage 1",
    "Étage 2",
    "Étage 3",
    "Étage 4",
    "Étage 5",
  ];

  const commonProblems = [
    "RAS",
    "Calcaire",
    "Contre pente",
    "Terre",
    "Gravats",
    "Canalisation remplie d’eau",
    "Fissure",
    "Cassure",
  ];

  const otherProblems = [
    "Déboîtement et non étanche",
    "Graisse",
    "Canalisation désaxée et non étanche",
    "Canalisation plus étanche",
    "Racines",
    "Affaissement",
    "Sent bon dans la canalisation",
    "CDV accessible",
    "CDV enterrée",
    "Fosse septique accessible",
    "Fosse septique enterrée",
    "Citerne d’eau de pluie accessible",
    "Citerne d’eau de pluie enterrée",
    "Dégraisseur accessible",
    "Dégraisseur enterré",
    "Rétrécissement de la canalisation",
  ];

  // === Ajouter étape classique ===
  const addStep = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: [ImagePicker.MediaTypeOptions.Images],
      quality: 0.7,
    });
    

    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });

      const uri = dest.startsWith("file://") ? dest : "file://" + dest;

      const newStep = {
        type: "photo",
        photo: uri,
        piece: "",
        etage: "",
        problems: [],
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

  const toggleProblem = (index, value) => {
    const updatedSteps = [...steps];
    let probs = [...updatedSteps[index].problems];
    if (probs.includes(value)) {
      probs = probs.filter((p) => p !== value);
    } else {
      probs.push(value);
    }
    updatedSteps[index].problems = probs;
    setSteps(updatedSteps);
    onChange(updatedSteps);
  };

  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    onChange(updatedSteps);
  };

  const SelectButton = ({ selected, label, onPress }) => (
    <Button
      mode={selected ? "contained" : "outlined"}
      onPress={onPress}
      style={{ margin: 4, flexGrow: 1 }}
    >
      {label}
    </Button>
  );

  const ToggleButton = ({ selected, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
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
        📸 Étapes du parcours caméra
      </Text>

      <Button mode="contained" onPress={addStep}>
        Ajouter une étape (photo)
      </Button>

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
              width: 300,
            }}
          >
            {step.photo && (
              <Image
                source={{ uri: step.photo }}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
            )}

            {/* Pièce */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>📍 Pièce</Text>
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

            {/* Étage */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>🏢 Étage</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {etages.map((e) => (
                <SelectButton
                  key={e}
                  label={e}
                  selected={step.etage === e}
                  onPress={() => updateStep(index, "etage", e)}
                />
              ))}
            </View>

            {/* Problèmes */}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              ⚡ Problèmes détectés
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {commonProblems.map((p) => (
                <ToggleButton
                  key={p}
                  label={p}
                  selected={step.problems.includes(p)}
                  onPress={() => toggleProblem(index, p)}
                />
              ))}

              {showMore &&
                otherProblems.map((p) => (
                  <ToggleButton
                    key={p}
                    label={p}
                    selected={step.problems.includes(p)}
                    onPress={() => toggleProblem(index, p)}
                  />
                ))}
            </View>

            <Button
              mode="outlined"
              onPress={() => setShowMore(!showMore)}
              style={{ marginTop: 8 }}
            >
              {showMore ? "Voir moins" : "Voir plus"}
            </Button>

            <IconButton
              icon="delete"
              iconColor="red"
              size={24}
              onPress={() => removeStep(index)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
