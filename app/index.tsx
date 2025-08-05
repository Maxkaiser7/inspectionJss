import { StyleSheet, Text, View } from 'react-native';
import FormScreen from '../app/FormScreen';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>JSS INSPECTION CAMERA</Text>
      <FormScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
