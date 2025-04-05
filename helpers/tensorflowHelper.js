import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

let model = null;

export async function loadModel() {
  await tf.ready();
  model = await mobilenet.load();
  console.log('✅ MobileNet model loaded');
}

export async function classifyImage(uri) {
  if (!model) throw new Error('Model not loaded');

  // Read image as base64
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert the base64 string into a tensor
  const buffer = tf.util.encodeString(b64, 'base64').buffer;
  const raw = new Uint8Array(buffer);
  const imageTensor = decodeJpeg(raw);

  // Classify image using MobileNet model
  const predictions = await model.classify(imageTensor);
  tf.dispose(imageTensor);

  return predictions[0] || { className: 'other', probability: 0 };
}
