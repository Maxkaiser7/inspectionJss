import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";

export default function PhotoPicker({ onChange }) {
  const [photo, setPhoto] = useState(null);

  const pickImage = async (setter) => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: false,
      });
  
      if (!result.canceled) {
        setter(result.assets[0].uri);
      }
    } catch (e) {
      console.error("Erreur lors de la prise de photo :", e);
    }
  };
  

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <Button title="Ajouter une photo" onPress={pickImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 5 },
  image: { width: 120, height: 120, borderRadius: 8, marginTop: 5 },
});
