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
import { useInspectionStore } from "./store/inspectionStore";
import { generatePdf } from "./utils/pdf";

export default function FormScreen() {
  const [db, setDb] = useState(null);

  // ✅ Récupération de toutes les données depuis Zustand
  const {
    clientName,
    address,
    phoneNumber,
    facadePhotoUri,
    buildingType,
    floor,
    methods,
    photoBlocks,
    sonarPhotos,
    cameraPathStart,
    cameraPathSteps,
    cameraPathEnd,
    solutions,
    setField,
    reset,
  } = useInspectionStore();

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
        solutions,
        date: new Date().toLocaleString("fr-FR"),
      });

      // ✉️ Partager le PDF
      await Sharing.shareAsync(pdfPath, {
        mimeType: "application/pdf",
        dialogTitle: "Envoyer l’inspection",
      });

      Alert.alert("Succès", "Inspection sauvegardée et PDF généré !");
      reset(); // reset du formulaire après enregistrement
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
        onChangeText={(text) => setField("clientName", text)}
        style={styles.input}
      />
      <TextInput
        label="Adresse"
        value={address}
        onChangeText={(text) => setField("address", text)}
        style={styles.input}
      />
      <TextInput
        label="Téléphone"
        value={phoneNumber}
        onChangeText={(text) => setField("phoneNumber", text)}
        style={styles.input}
      />
      <TextInput
        label="Type de bâtiment"
        value={buildingType}
        onChangeText={(text) => setField("buildingType", text)}
        style={styles.input}
      />
      <TextInput
        label="Étage"
        value={floor}
        onChangeText={(text) => setField("floor", text)}
        style={styles.input}
      />

      {/* Bloc façade */}
      <FacadeBlock
        initialData={facadePhotoUri}
        onChange={(val) => setField("facadePhotoUri", val)}
      />

      <SonarPhotosBlock
        initialData={sonarPhotos}
        onChange={(val) => setField("sonarPhotos", val)}
      />

      <CameraPathStartBlock
        initialData={cameraPathStart} 
        onChange={(val) => setField("cameraPathStart", val)}
      />
      <CameraPathStepsBlock
        initialData={cameraPathSteps}
        onChange={(val) => setField("cameraPathSteps", val)}
      />
      <CameraPathEndBlock
        initialData={cameraPathEnd}
        onChange={(val) => setField("cameraPathEnd", val)}
      />

      {/* Méthodes */}
      <MethodsUsedSection onChange={(val) => setField("methods", val)} />
      <SolutionsBlock
        initialData={solutions}
        onChange={(val) => setField("solutions", val)}
      />

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
