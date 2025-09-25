import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";

export default function CameraPathEndBlock({ initialData, onChange }) {
  const [ends, setEnds] = useState(Array.isArray(initialData) ? initialData : []);

  const arrivalPoints = [
    "Citerne d’eau de pluie","Drain","Fosse septique accessible","Fosse septique enterrée",
    "Chambre de visite accessible","Chambre de visite enterrée","Dégraisseur accessible","Dégraisseur enterré",
    "Avaloirs","Autre"
  ];

  const pieces = ["Cuisine","Salle de bain","WC","Garage","Cave","Jardin","devant la maison","cour","Autre"];
  const etages = ["Cave","RDC","Parking","Étage 1","Étage 2","Étage 3","Étage 4","Étage 5","Étage 6","Étage 7","Étage 8","Étage 9","Étage 10","Autre"];

  const addEnd = async () => {
    let result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `end_${Date.now()}.jpg`;
      await FileSystem.downloadAsync(src, dest);
      const uri = dest.startsWith("file://") ? dest : "file://" + dest;

      const newEnd = { photo: uri, point:"", customPoint:"", piece:"", customPiece:"", etage:"", customEtage:"", detail:"", impossible:false };
      const updated = [...ends, newEnd];
      setEnds(updated);
      onChange && onChange(updated);
    }
  };

  const updateEnd = (index, key, value) => {
    const updated = [...ends];
    updated[index][key] = value;
    setEnds(updated);
    onChange && onChange(updated);
  };

  const removeEnd = (index) => {
    const updated = ends.filter((_, i) => i !== index);
    setEnds(updated);
    onChange && onChange(updated);
  };

  const SelectButton = ({ selected, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ padding:8, margin:4, flexGrow:1, borderRadius:6, backgroundColor:selected ? "#007AFF20" : "#f0f0f0" }}>
      <Text style={{ fontWeight:selected ? "bold" : "normal" }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical:20 }}>
      <Text style={{ fontSize:18, fontWeight:"bold", marginBottom:10 }}>Point d’arrivée</Text>
      <Button mode="contained" onPress={addEnd}>Ajouter un point d’arrivée</Button>
      <ScrollView horizontal style={{ marginTop:15 }}>
        {ends.map((end,index)=>(
          <View key={index} style={{ marginRight:10, padding:10, borderWidth:1, borderColor:"#ddd", borderRadius:10, width:300 }}>
            {end.photo && <Image source={{uri:end.photo}} style={{width:"100%", height:150, borderRadius:10}} />}
            
            <Text style={{fontWeight:"bold", marginTop:10}}>Point</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {arrivalPoints.map(p=> <SelectButton key={p} label={p} selected={end.point===p} onPress={()=>updateEnd(index,"point",p)} />)}
            </View>
            {end.point==="Autre" && <TextInput label="Préciser" value={end.customPoint} onChangeText={t=>updateEnd(index,"customPoint",t)} style={{marginTop:10}} />}

            <Text style={{fontWeight:"bold", marginTop:10}}>Pièce</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {pieces.map(p=> <SelectButton key={p} label={p} selected={end.piece===p} onPress={()=>updateEnd(index,"piece",p)} />)}
            </View>
            {end.piece==="Autre" && <TextInput label="Préciser" value={end.customPiece} onChangeText={t=>updateEnd(index,"customPiece",t)} style={{marginTop:10}} />}

            <Text style={{fontWeight:"bold", marginTop:10}}>Étage</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {etages.map(e=> <SelectButton key={e} label={e} selected={end.etage===e} onPress={()=>updateEnd(index,"etage",e)} />)}
            </View>
            {end.etage==="Autre" && <TextInput label="Préciser" value={end.customEtage} onChangeText={t=>updateEnd(index,"customEtage",t)} style={{marginTop:10}} />}

            <TextInput label="Détail" value={end.detail} onChangeText={t=>updateEnd(index,"detail",t)} style={{marginTop:10}} />

            <TouchableOpacity onPress={()=>updateEnd(index,"impossible",!end.impossible)} style={{marginTop:15, padding:10, backgroundColor:end.impossible ? "#ff4d4d" : "#ddd", borderRadius:8, alignItems:"center"}}>
              <Text style={{color:end.impossible ? "#fff" : "#000", fontWeight:"bold"}}>Impossible d’aller plus loin</Text>
            </TouchableOpacity>

            <IconButton icon="delete" iconColor="red" size={24} onPress={()=>removeEnd(index)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
