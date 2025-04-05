export const basePrices = {
    phone: 400,
    laptop: 700,
    headphones: 50,
    earbuds: 40,
    tv: 500,
    camera: 300,
    tablet: 250,
    monitor: 180,
    watch: 150,
    smartwatch: 180,
    speaker: 70,
    mouse: 20,
    keyboard: 30,
    printer: 100,
    scanner: 90,
    projector: 150,
    remote_control: 25,
    microphone: 60,
    joystick: 40,
    modem: 50,
    router: 60,
    hard_disk: 80,
    usb_drive: 15,
    webcam: 45,
    stylus: 25,
    gamepad: 45,
    vr_headset: 300,
    radio: 40,
    camcorder: 200,
    walkie_talkie: 35,
    gps: 150,
    calculator: 20,
    coffee_maker: 90,
    vacuum_cleaner: 150,
    toaster: 35,
    blender: 60,
    oven: 200,
    fridge: 600,
    washing_machine: 550,
    dryer: 500,
    electric_kettle: 40,
    hair_dryer: 40,
    trimmer: 25,
    treadmill: 400,
    weight_scale: 25,
    iron: 30,
    amplifier: 150,
    piano: 800,
    other: 50
  };
  
  export function normalizeLabel(rawLabel) {
    const lower = rawLabel.toLowerCase();
    // Improve fuzzy matching to handle minor variations
    for (const key of Object.keys(basePrices)) {
      const match = key.replace(/_/g, ' ').toLowerCase();
      if (lower.includes(match)) {
        return key;
      }
    }
    // Default to 'other' for unmatched labels
    return 'other';
  }
  
  export function predictPrice({ label, condition, age, warranty }) {
    // Normalize the detected label
    const normalized = normalizeLabel(label);
    const base = basePrices[normalized] ?? basePrices['other'];
  
    // Adjust formula to handle price scaling
    const conditionFactor = 1 - (5 - condition) * 0.05;  // Depreciation based on condition
    const ageFactor = 1 - age * 0.02;  // Depreciation based on age
    const warrantyBonus = warranty * 2;  // Add value based on warranty months
  
    // Calculate the predicted price
    let price = base * conditionFactor * ageFactor + warrantyBonus;
    price = Math.max(price, 5);  // Ensure a minimum price
  
    return {
      price: price.toFixed(2),
      usedDefault: normalized === 'other',  // Flag if default price is used
    };
  }
  