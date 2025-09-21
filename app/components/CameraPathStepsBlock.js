import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton } from "react-native-paper";

export default function CameraPathStepsBlock({ initialData, onChange }) {
  const [steps, setSteps] = useState(initialData || []);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert("Permission requise", "L’application a besoin de la caméra et de la galerie pour fonctionner.");
      }
    })();
  }, []);

  const pieces = ["Cuisine","Salle de bain","WC","Garage","Cave","Jardin","Salon","Cour","Devant la maison"];
  const etages = ["Cave","Parking","RDC","Étage 1","Étage 2","Étage 3","Étage 4","Étage 5"];
  const commonProblems = ["RAS","Calcaire","Contre pente","Terre","Gravats","Canalisation remplie d’eau","Fissure","Cassure"];
  const otherProblems = [
    "Déboîtement et non étanche","Graisse","Canalisation désaxée et non étanche","Canalisation plus étanche","Racines",
    "Affaissement","Sent bon dans la canalisation","CDV accessible","CDV enterrée","Fosse septique accessible",
    "Fosse septique enterrée","Citerne d’eau de pluie accessible","Citerne d’eau de pluie enterrée","Dégraisseur accessible",
    "Dégraisseur enterré","Rétrécissement de la canalisation"
  ];

  const addStep = async () => {
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality:0.7 });
    if (!result.canceled) {
      const src = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: src, to: dest });
      const uri = dest.startsWith("file://") ? dest : "file://" + dest;

      const newStep = { photo: uri, piece:"", etage:"", problems:[] };
      const updated = [...steps, newStep];
      setSteps(updated);
      onChange && onChange(updated);
    }
  };

  const updateStep = (index, key, value) => {
    const updated = [...steps];
    updated[index][key] = value;
    setSteps(updated);
    onChange && onChange(updated);
  };

  const toggleProblem = (index, problem) => {
    const updated = [...steps];
    const probs = updated[index].problems.includes(problem)
      ? updated[index].problems.filter(p => p !== problem)
      : [...updated[index].problems, problem];
    updated[index].problems = probs;
    setSteps(updated);
    onChange && onChange(updated);
  };

  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
    onChange && onChange(updated);
  };

  const SelectButton = ({ selected, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ padding:8, margin:4, borderRadius:6, backgroundColor:selected ? "#007AFF20" : "#f0f0f0", flexGrow:1 }}>
      <Text style={{ fontWeight:selected ? "bold" : "normal" }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical:20 }}>
      <Text style={{ fontSize:18, fontWeight:"bold", marginBottom:10 }}>📸 Étapes du parcours caméra</Text>
      <Button mode="contained" onPress={addStep}>Ajouter une étape (photo)</Button>

      <ScrollView horizontal style={{ marginTop:15 }}>
        {steps.map((step,index)=>(
          <View key={index} style={{ marginRight:10, padding:10, borderWidth:1, borderColor:"#ddd", borderRadius:10, width:300 }}>
            {step.photo && <Image source={{uri:step.photo}} style={{width:"100%", height:150, borderRadius:10}} />}
            
            <Text style={{fontWeight:"bold", marginTop:10}}>📍 Pièce</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {pieces.map(p => <SelectButton key={p} label={p} selected={step.piece===p} onPress={()=>updateStep(index,"piece",p)} />)}
            </View>

            <Text style={{fontWeight:"bold", marginTop:10}}>🏢 Étage</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {etages.map(e => <SelectButton key={e} label={e} selected={step.etage===e} onPress={()=>updateStep(index,"etage",e)} />)}
            </View>

            <Text style={{fontWeight:"bold", marginTop:10}}>⚡ Problèmes détectés</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {commonProblems.map(p => <SelectButton key={p} label={p} selected={step.problems.includes(p)} onPress={()=>toggleProblem(index,p)} />)}
              {showMore && otherProblems.map(p => <SelectButton key={p} label={p} selected={step.problems.includes(p)} onPress={()=>toggleProblem(index,p)} />)}
            </View>

            <Button mode="outlined" onPress={()=>setShowMore(!showMore)} style={{ marginTop:8 }}>{showMore ? "Voir moins" : "Voir plus"}</Button>
            <IconButton icon="delete" iconColor="red" size={24} onPress={()=>removeStep(index)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
