import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { createTable, openDatabase, saveInspection } from '../app/db/database'; // Importation des fonctions
import { generatePdf } from '../app/utils/pdf';

export default function FormScreen() {
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [facadePhotoUri, setFacadePhotoUri] = useState("");

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
      await saveInspection(db, clientName, address, facadePhotoUri);
  
      const date = new Date().toISOString();
  
      const pdfPath = await generatePdf({
        clientName,
        address,
        photoUri: facadePhotoUri,
        date,
      });
  
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
        Alert.alert("Permission refusée", "La permission d'utiliser la caméra est nécessaire.");
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'], // ✅ Nouveau format
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
        mediaTypes: ['images'], // ✅ Nouveau format
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inspection Camera JSS</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom du client"
          value={clientName}
          onChangeText={setClientName}
        />
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

        <Button
          mode="contained"
          onPress={handleSaveData}
          style={styles.button}
        >
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
});
