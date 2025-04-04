import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let model = null;

export async function loadPriceModel() {
  try {
    await tf.ready();
    await tf.setBackend('cpu'); // Optional, 'webgl' can also be used

    const modelJson = require('../assets/models/price_model/model.json');
    const modelWeights = [require('../assets/models/price_model/group1-shard1of1.bin')];

    model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    console.log("✅ Price model loaded");
  } catch (error) {
    console.error("❌ Failed to load price model:", error);
  }
}

export function predictPrice({ label, condition, age, warranty }) {
  if (!model) {
    console.warn("❌ Price model not loaded");
    return null;
  }

  const labelToIndex = {
    phone: 0,
    laptop: 1,
    headphones: 2,
    earbuds: 3,
    tv: 4,
    camera: 5,
    tablet: 6,
    monitor: 7,
    watch: 8,
    speaker: 9,
    other: 10,
  };

  const index = labelToIndex[label.toLowerCase()] ?? labelToIndex['other'];
  const oneHot = new Array(11).fill(0);
  oneHot[index] = 1;

  const inputTensor = tf.tensor2d([[...oneHot, condition, age, warranty]]);
  const prediction = model.predict(inputTensor);
  const price = prediction.dataSync()[0];

  tf.dispose([inputTensor, prediction]);
  return price.toFixed(2);
}
