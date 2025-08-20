import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PhotoBlock({ onChange, photoInitiale, sonarPhotoInitiale, roomInitiale }) {
    const [photo, setPhoto] = useState(photoInitiale || null);
    const [sonarPhoto, setSonarPhoto] = useState(sonarPhotoInitiale || null);
    const [room, setRoom] = useState(roomInitiale || '');

    const pickImage = async (setter) => {
        try {
          let result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            allowsEditing: false,
          });
      
          if (!result.canceled) {
            console.log("Photo prise URI :", result.assets[0].uri);
            setter(result.assets[0].uri);
          }
        } catch (error) {
          console.error("Erreur lors de la prise de photo :", error);
        }
      };
      

  // Appelle le parent dès qu'une donnée change
  const updateParent = (newPhoto, newSonar, newRoom) => {
    onChange({
      photo: newPhoto ?? photo,
      sonarPhoto: newSonar ?? sonarPhoto,
      room: newRoom ?? room
    });
  };

  return (
    <View style={styles.block}>
      <Text style={styles.label}>Photo principale</Text>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <Button title="Prendre photo" onPress={() => pickImage((uri) => {
          setPhoto(uri);
          updateParent(uri, null, null);
        })} />
      )}

      <Text style={styles.label}>Photo du sonar</Text>
      {sonarPhoto ? (
        <Image source={{ uri: sonarPhoto }} style={styles.image} />
      ) : (
        <Button title="Ajouter photo sonar" onPress={() => pickImage((uri) => {
          setSonarPhoto(uri);
          updateParent(null, uri, null);
        })} />
      )}

      <Text style={styles.label}>Pièce</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : salle de bain"
        value={room}
        onChangeText={(txt) => {
          setRoom(txt);
          updateParent(null, null, txt);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 8
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    marginVertical: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    marginTop: 5
  }
});
