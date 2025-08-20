import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

export default function MethodsUsedSection({ onChange }) {
  const [methods, setMethods] = useState({
    controleVisuel: true,
    curageAvantEndoscopie: true,
    sonar: true,
    endoscopie: true,
    camionHydrocureur: false,
    contreSens: false,
    tropInterference: false,
    sonarPhotos: [],
    sonarRoom: "",
  });

  const toggleMethod = (key) => {
    const updated = { ...methods, [key]: !methods[key] };
    setMethods(updated);
    onChange(updated);
    console.log(methods);
  };



  const updateRoom = (text) => {
    const updated = { ...methods, sonarRoom: text };
    setMethods(updated);
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Méthodes utilisées</Text>

      {renderCheckbox("Contrôle visuel", "controleVisuel", methods, toggleMethod)}
      {renderCheckbox("Curage avant endoscopie", "curageAvantEndoscopie", methods, toggleMethod)}
      {renderCheckbox("Sonar", "sonar", methods, toggleMethod)}
      {renderCheckbox("Endoscopie par caméra", "endoscopie", methods, toggleMethod)}
      {renderCheckbox("Camion hydrocureur", "camionHydrocureur", methods, toggleMethod)}
      {renderCheckbox("Contre sens de l’évacuation", "contreSens", methods, toggleMethod)}

    </View>
  );
}

const renderCheckbox = (label, key, methods, toggle) => (
  <View style={styles.checkboxRow} key={key}>
    <Checkbox
      status={methods[key] ? "checked" : "unchecked"}
      onPress={() => toggle(key)}
    />
    <Text>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  subLabel: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
});
