import { Picker } from "@react-native-picker/picker"; // liste déroulante
import React, { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";

const pieces = ["Cuisine", "Salle de bain", "WC", "Garage", "Cave", "Grenier", "Autre"];
const etages = ["Sous-sol", "RDC", "1er", "2e", "3e+", "Combles"];

export default function SonarPhotoItem({ photo, onChange }) {
  const [piece, setPiece] = useState("");
  const [etage, setEtage] = useState("");
  const [autre, setAutre] = useState("");

  const handleChange = (updates) => {
    const newData = { photo, piece, etage, autre, ...updates };
    onChange(newData);
  };

  return (
    <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderColor: "#ccc" }}>
      <Image source={{ uri: photo }} style={{ width: 200, height: 150, marginBottom: 10 }} />

      <Text>Pièce :</Text>
      <Picker
        selectedValue={piece}
        onValueChange={(val) => {
          setPiece(val);
          handleChange({ piece: val });
        }}
      >
        {pieces.map((p) => (
          <Picker.Item label={p} value={p} key={p} />
        ))}
      </Picker>

      {piece === "Autre" && (
        <>
          <Text>Précisez :</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 5 }}
            value={autre}
            onChangeText={(txt) => {
              setAutre(txt);
              handleChange({ autre: txt });
            }}
          />
        </>
      )}

      <Text>Étage :</Text>
      <Picker
        selectedValue={etage}
        onValueChange={(val) => {
          setEtage(val);
          handleChange({ etage: val });
        }}
      >
        {etages.map((e) => (
          <Picker.Item label={e} value={e} key={e} />
        ))}
      </Picker>
    </View>
  );
}
