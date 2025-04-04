import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

export async function loadModel() {
  try {
    await tf.ready();
    model = await mobilenet.load();
    console.log("✅ MobileNet model loaded");
  } catch (err) {
    console.error("❌ Failed to load MobileNet:", err);
  }
}

export async function classifyImage(uri) {
  if (!model) {
    console.warn("⚠️ MobileNet not loaded");
    return [];
  }

  // Just return a dummy label
  return [{ className: 'laptop', probability: 0.9 }];
}
