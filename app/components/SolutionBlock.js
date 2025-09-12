import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";

export default function SolutionBlock({ initialData, onChange }) {
  const [solution, setSolution] = useState(initialData?.[0] || null);

  const solutionTypes = ["Décalcarisation", "Chemisage", "Remplacement canalisation"];
  const points = ["WC", "Siphon", "Regard", "CDV","Evier", "Baignoire", "Douche", "Fosse", "Citerne", "Avaloirs", "Autre"];
  const pieces = ["Cuisine","Salle de bain","WC","Garage","Cave","Jardin","Salon","Cour","Devant la maison"];
  const etages = ["Cave","RDC","Parking","Étage 1","Étage 2","Étage 3","Étage 4","Autre"];
  const diametres = ["40","80","100","110","125"];

  const updateField = (field, value) => {
    const updated = { ...solution, [field]: value };
    setSolution(updated);
    onChange && onChange([updated]);
  };

  const addSolution = () => {
    if (solution) return; // une seule solution autorisée
    const newSolution = {
      type: "",
      diametre: "",
      metree: "",
      devis: "Non",
      camion: "Non",
      panneaux: "Non",
      startPoint: "",
      customStartPoint: "",
      startPiece: "",
      customStartPiece: "",
      startEtage: "",
      customStartEtage: "",
      endPoint: "",
      customEndPoint: "",
      endPiece: "",
      customEndPiece: "",
      endEtage: "",
      customEndEtage: "",
      etatAcces: "",
      customEtatAcces: "",
      sprayOuManchette: "",
      apparenteOuEnterree: "",
      siphon: "Non",
      repiquage: "",
      tRegardMur: "",
      deterrer: "Non",
      taque: "",
      commentaire: "",
    };
    setSolution(newSolution);
    onChange && onChange([newSolution]);
  };

  const removeSolution = () => {
    setSolution(null);
    onChange && onChange([]);
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
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🛠️ Solution
      </Text>

      {!solution && (
        <Button mode="contained" onPress={addSolution}>
          Ajouter une solution
        </Button>
      )}

      {solution && (
        <ScrollView horizontal style={{ marginTop: 15 }}>
          <View
            style={{
              marginRight: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              width: 360,
            }}
          >
            {/* Type de solution */}
            <Text style={{ fontWeight: "bold" }}>Type de solution</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {solutionTypes.map((t) => (
                <SelectButton
                  key={t}
                  label={t}
                  selected={solution.type === t}
                  onPress={() => updateField("type", t)}
                />
              ))}
            </View>

            {/* Diamètre */}
            <Text style={{ marginTop: 10 }}>Diamètre</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {diametres.map((d) => (
                <SelectButton
                  key={d}
                  label={d}
                  selected={solution.diametre === d}
                  onPress={() => updateField("diametre", d)}
                />
              ))}
            </View>

            {/* Métrée */}
            <TextInput
              label="Métrée"
              value={solution.metree}
              onChangeText={(text) => updateField("metree", text)}
              style={{ marginTop: 10 }}
            />

            {/* Départ */}
            <Text style={{ marginTop: 15, fontWeight: "bold" }}>📍 Point de départ</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {points.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={solution.startPoint === p}
                  onPress={() => updateField("startPoint", p)}
                />
              ))}
            </View>
            {solution.startPoint === "Autre" && (
              <TextInput
                label="Préciser le point de départ"
                value={solution.customStartPoint}
                onChangeText={(text) => updateField("customStartPoint", text)}
              />
            )}

            <Text style={{ marginTop: 10 }}>Pièce départ</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {pieces.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={solution.startPiece === p}
                  onPress={() => updateField("startPiece", p)}
                />
              ))}
            </View>
            {solution.startPiece === "Autre" && (
              <TextInput
                label="Préciser la pièce départ"
                value={solution.customStartPiece}
                onChangeText={(text) => updateField("customStartPiece", text)}
              />
            )}

            <Text style={{ marginTop: 10 }}>Étage départ</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {etages.map((e) => (
                <SelectButton
                  key={e}
                  label={e}
                  selected={solution.startEtage === e}
                  onPress={() => updateField("startEtage", e)}
                />
              ))}
            </View>
            {solution.startEtage === "Autre" && (
              <TextInput
                label="Préciser l'étage départ"
                value={solution.customStartEtage}
                onChangeText={(text) => updateField("customStartEtage", text)}
              />
            )}

            {/* Arrivée */}
            <Text style={{ marginTop: 15, fontWeight: "bold" }}>🎯 Point d’arrivée</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {points.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={solution.endPoint === p}
                  onPress={() => updateField("endPoint", p)}
                />
              ))}
            </View>
            {solution.endPoint === "Autre" && (
              <TextInput
                label="Préciser le point d’arrivée"
                value={solution.customEndPoint}
                onChangeText={(text) => updateField("customEndPoint", text)}
              />
            )}

            <Text style={{ marginTop: 10 }}>Pièce arrivée</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {pieces.map((p) => (
                <SelectButton
                  key={p}
                  label={p}
                  selected={solution.endPiece === p}
                  onPress={() => updateField("endPiece", p)}
                />
              ))}
            </View>
            {solution.endPiece === "Autre" && (
              <TextInput
                label="Préciser la pièce arrivée"
                value={solution.customEndPiece}
                onChangeText={(text) => updateField("customEndPiece", text)}
              />
            )}

            <Text style={{ marginTop: 10 }}>Étage arrivée</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {etages.map((e) => (
                <SelectButton
                  key={e}
                  label={e}
                  selected={solution.endEtage === e}
                  onPress={() => updateField("endEtage", e)}
                />
              ))}
            </View>
            {solution.endEtage === "Autre" && (
              <TextInput
                label="Préciser l'étage arrivée"
                value={solution.customEndEtage}
                onChangeText={(text) => updateField("customEndEtage", text)}
              />
            )}

            {/* Commentaire libre */}
            <TextInput
              label="Commentaire"
              value={solution.commentaire}
              onChangeText={(text) => updateField("commentaire", text)}
              style={{ marginTop: 10 }}
              multiline
            />

            <IconButton
              icon="delete"
              iconColor="red"
              size={24}
              onPress={removeSolution}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
