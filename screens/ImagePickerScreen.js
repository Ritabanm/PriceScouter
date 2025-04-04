import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { loadModel, classifyImage, predictPrice } from '../helpers/tensorflowHelper';

export default function ImagePickerScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedLabel, setDetectedLabel] = useState('');
  const [condition, setCondition] = useState(3);
  const [age, setAge] = useState(12);
  const [warranty, setWarranty] = useState(6);
  const [loading, setLoading] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [modelMessage, setModelMessage] = useState('');
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [usedDefaultPrice, setUsedDefaultPrice] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setModelMessage('🔄 Loading models...');
      try {
        await loadModel();
        setModelsReady(true);
        setModelMessage('✅ Models loaded!');
        setTimeout(() => setModelMessage(''), 3000);
      } catch (err) {
        console.error('❌ Error loading models:', err);
        setModelMessage('❌ Failed to load models.');
        Alert.alert('Failed to load ML models.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImageSelected = async (uri) => {
    if (!modelsReady) {
      Alert.alert('Models not ready yet');
      return;
    }

    setLoading(true);
    setImageUri(uri);
    setDetectedLabel('');
    setPredictedPrice(null);
    setModelMessage('🔍 Analyzing image...');

    try {
      const label = await classifyImage(uri);
      setDetectedLabel(label || 'other');
    } catch (err) {
      console.error('❌ classifyImage error:', err);
      setDetectedLabel('other');
      Alert.alert('Error detecting object.');
    } finally {
      setModelMessage('');
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        handleImageSelected(result.assets[0].uri);
      }
    } catch (err) {
      console.error('❌ Error picking image:', err);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permission denied');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        handleImageSelected(result.assets[0].uri);
      }
    } catch (err) {
      console.error('❌ Error taking photo:', err);
    }
  };

  const handlePredict = () => {
    if (!detectedLabel) {
      Alert.alert('No detected object to price.');
      return;
    }

    const result = predictPrice({ label: detectedLabel, condition, age, warranty });

    if (result) {
      setPredictedPrice(result.price);
      setUsedDefaultPrice(result.usedDefault);
    } else {
      Alert.alert('Prediction failed.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholder}>No Image Selected</Text>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#9b59b6" />}
      {modelMessage !== '' && <Text style={styles.modelMessage}>{modelMessage}</Text>}
      {!loading && detectedLabel !== '' && (
        <Text style={styles.info}>🧠 Detected: {detectedLabel}</Text>
      )}

      {predictedPrice && (
        <Text style={styles.predictedText}>
          💰 Estimated Price: ${predictedPrice}
          {usedDefaultPrice ? '' : ''}
        </Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>📷 Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sliderGroup}>
        <Text style={styles.sliderLabel}>Condition: {condition}</Text>
        <Slider
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={condition}
          onValueChange={setCondition}
          minimumTrackTintColor="#9b59b6"
        />

        <Text style={styles.sliderLabel}>Age (months): {age}</Text>
        <Slider
          minimumValue={0}
          maximumValue={24}
          step={1}
          value={age}
          onValueChange={setAge}
          minimumTrackTintColor="#9b59b6"
        />

        <Text style={styles.sliderLabel}>Warranty (months): {warranty}</Text>
        <Slider
          minimumValue={0}
          maximumValue={24}
          step={1}
          value={warranty}
          onValueChange={setWarranty}
          minimumTrackTintColor="#9b59b6"
        />
      </View>

      <TouchableOpacity style={styles.predictButton} onPress={handlePredict}>
        <Text style={styles.predictText}>🔮 Predict Price</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  imageBox: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: '#9b59b6',
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: '#aaa',
  },
  modelMessage: {
    color: '#aaa',
    fontStyle: 'italic',
    marginVertical: 6,
  },
  info: {
    color: '#eee',
    fontSize: 16,
    marginBottom: 6,
  },
  predictedText: {
    color: '#27ae60',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#9b59b6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sliderGroup: {
    width: '100%',
    marginTop: 20,
  },
  sliderLabel: {
    color: '#fff',
    marginBottom: 4,
    marginTop: 10,
  },
  predictButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  predictText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
