// FormScreen.js
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import CameraPathEndBlock from "./components/CameraPathPhotoEndBlock";
import CameraPathStartBlock from "./components/CameraPathStartBlock";
import CameraPathStepsBlock from "./components/CameraPathStepsBlock";
import FacadeBlock from "./components/FacadeBlock";
import MethodsUsedSection from "./components/MethodUseSection";
import SolutionsBlock from "./components/SolutionBlock";
import SonarPhotosBlock from "./components/SonarPhotoBlock";
import { createTable, openDatabase, saveInspection } from "./db/database";
import { generatePdf } from "./utils/pdf";


export default function FormScreen() {
  const [db, setDb] = useState(null);

  // Infos client
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoBlocks, setPhotoBlocks] = useState([]);
  const [sonarPhotos, setSonarPhotos] = useState([]);

  const [solutions, setSolutions] = useState([]);

  // Photos façade / bâtiment
  const [facadePhotoUri, setFacadePhotoUri] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [floor, setFloor] = useState("");

  // Méthodes utilisées
  const [methods, setMethods] = useState({});

  // Parcours caméra
  const [cameraPathStart, setCameraPathStart] = useState({
    photo: null,
    point: "",
    detail: "",
  });

  const [cameraPathEnd, setCameraPathEnd] = useState({
    photo: null,
    point: "",
    detail: "",
  });

  const [cameraPathSteps, setCameraPathSteps] = useState([]);

  useEffect(() => {
    const initDb = async () => {
      const database = await openDatabase();
      setDb(database);
      await createTable(database);
    };
    initDb();
  }, []);

  const handleSaveAndPdf = async () => {
    if (!clientName || !address) {
      Alert.alert("Erreur", "Veuillez remplir le nom et l'adresse du client.");
      return;
    }

    try {
      // 💾 Sauvegarde inspection
      await saveInspection(
        db,
        clientName,
        address,
        phoneNumber,
        facadePhotoUri,
        buildingType,
        floor,
        JSON.stringify(methods),
        JSON.stringify(photoBlocks || []),
        JSON.stringify(cameraPathStart),
        JSON.stringify(cameraPathSteps),
        JSON.stringify(cameraPathEnd)
      );
      console.log("Méthodes actuelles avant PDF :", methods);

      // 📄 Générer le PDF
      const pdfPath = await generatePdf({
        clientName,
        address,
        phoneNumber,
        photoUri: facadePhotoUri,
        buildingType,
        floor,
        methods,
        photoBlocks: photoBlocks || [],
        cameraPathStart,
        cameraPathSteps,
        cameraPathEnd,
        sonarPhotos,
        solutions, // 🔥 on l’ajoute ici
        date: new Date().toLocaleString("fr-FR"),
      });
      

      // ✉️ Partager le PDF
      await Sharing.shareAsync(pdfPath, {
        mimeType: "application/pdf",
        dialogTitle: "Envoyer l’inspection",
      });

      Alert.alert("Succès", "Inspection sauvegardée et PDF généré !");
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
      Alert.alert("Erreur", "Impossible de sauvegarder ou générer le PDF.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nom du client"
        value={clientName}
        onChangeText={setClientName}
        style={styles.input}
      />
      <TextInput
        label="Adresse"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        label="Téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        label="Type de bâtiment"
        value={buildingType}
        onChangeText={setBuildingType}
        style={styles.input}
      />
      <TextInput
        label="Étage"
        value={floor}
        onChangeText={setFloor}
        style={styles.input}
      />

      {/* Bloc façade */}
      <FacadeBlock initialData={facadePhotoUri} onChange={setFacadePhotoUri} />

      <SonarPhotosBlock initialData={sonarPhotos} onChange={setSonarPhotos} />

      {/* Parcours caméra */}
      <CameraPathStartBlock
        initialData={cameraPathStart}
        onChange={setCameraPathStart}
      />
      <CameraPathStepsBlock
        initialData={cameraPathSteps}
        onChange={setCameraPathSteps}
      />
      <CameraPathEndBlock
        initialData={cameraPathEnd}
        onChange={setCameraPathEnd}
      />

      {/* Méthodes */}
      <MethodsUsedSection onChange={setMethods} />
      <SolutionsBlock initialData={solutions} onChange={setSolutions} />

      <View style={{ marginVertical: 20 }}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSaveAndPdf}
        >
          Enregistrer + PDF
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    padding: 8,
  },
});
