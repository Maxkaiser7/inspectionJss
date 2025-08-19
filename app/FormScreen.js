import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, Menu, Provider as PaperProvider } from "react-native-paper";
import { createTable, openDatabase, saveInspection } from "../app/db/database"; // Importation des fonctions
import { generatePdf } from "../app/utils/pdf";

export default function FormScreen() {
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [facadePhotoUri, setFacadePhotoUri] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [floor, setFloor] = useState(""); // Pour étage si bâtiment à appartements

  // Menu
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Fonction pour ouvrir la base de données
  const initializeDb = async () => {
    const db = await openDatabase();
    await createTable(db); // Créer la table si elle n'existe pas
    return db;
  };

  // Sauvegarde des données dans la base de données
  const handleSaveData = async () => {
    if (!facadePhotoUri) {
      alert("Veuillez prendre ou sélectionner une photo.");
      return;
    }

    try {
      const db = await openDatabase();
      await createTable(db);
      await saveInspection(
        db,
        clientName,
        address,
        facadePhotoUri,
        buildingType,
        floor
      );

      const date = new Date().toISOString();

      const pdfPath = await generatePdf({
        clientName,
        address,
        photoUri: facadePhotoUri,
        date,
        buildingType,
        floor,
      });
      // Partager le PDF
      await Sharing.shareAsync(pdfPath);
      console.log("generatePdf =", generatePdf);

      alert("PDF généré :\n" + pdfPath);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  // Prendre une photo
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "La permission d'utiliser la caméra est nécessaire."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"], // ✅ Nouveau format
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFacadePhotoUri(result.assets[0].uri);
      } else {
        console.log("Aucune photo prise.");
      }
    } catch (error) {
      console.error("Erreur lors de la prise de photo :", error);
    }
  };

  // Sélectionner une photo dans la bibliothèque
  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // ✅ Nouveau format
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFacadePhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
    }
  };

  // Choisir entre prendre une photo ou en sélectionner une de la bibliothèque
  const handlePickFacadePhoto = () => {
    Alert.alert(
      "Ajouter une photo de la façade",
      "Choisissez une option",
      [
        { text: "Caméra", onPress: () => takePhoto() },
        { text: "Bibliothèque", onPress: () => pickFromLibrary() },
        { text: "Annuler", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <PaperProvider>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Inspection Camera JSS</Text>
        <Text style={styles.label}>Nom du client</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom du client"
          value={clientName}
          onChangeText={setClientName}
        />
        <Text style={styles.label}>Adresse du client</Text>

        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.card}>
          <Button
            mode="contained"
            onPress={handlePickFacadePhoto}
            style={styles.button}
          >
            Prendre une photo de la façade
          </Button>

          {facadePhotoUri !== "" && (
            <Image source={{ uri: facadePhotoUri }} style={styles.image} />
          )}
        </View>

        {/* Menu pour choisir le type de bâtiment */}
        <Text style={styles.label}>Type de bâtiment</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button onPress={openMenu}>
              {buildingType ? buildingType : 'Choisir le type de bâtiment'}
            </Button>
          }
        >
          <Menu.Item onPress={() => { setBuildingType('maison'); closeMenu(); }} title="Maison unifamiliale" />
          <Menu.Item onPress={() => { setBuildingType('commerce'); closeMenu(); }} title="Commerce" />
          <Menu.Item onPress={() => { setBuildingType('batiment'); closeMenu(); }} title="Bâtiment" />
          <Menu.Item onPress={() => { setBuildingType('appartement'); setFloor(''); closeMenu(); }} title="Bâtiment à appartements" />
        </Menu>

        <Button mode="contained" onPress={handleSaveData} style={styles.button}>
          Sauvegarder
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  card: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 4,
  },
  button: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
});
