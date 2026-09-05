import { normalizeWhatsAppNumber, calculateFramePrice, formatRupee } from "../src/lib/framePricing.js";
import fs from "fs";
import path from "path";

console.log("=== VERIFYING FRAME UPDATES ===");

// 1. Verify WhatsApp Normalization
console.log("\n1. Testing WhatsApp Number Normalization:");
const testCases = [
  { input: "+91 90427 82559", expected: "919042782559" },
  { input: "9042782559", expected: "919042782559" },
  { input: "+91-90427-82559", expected: "919042782559" },
  { input: "+91 (904) 278-2559", expected: "919042782559" },
  { input: "919042782559", expected: "919042782559" },
];

let allNormPassed = true;
for (const tc of testCases) {
  const result = normalizeWhatsAppNumber(tc.input);
  const pass = result === tc.expected;
  if (!pass) allNormPassed = false;
  console.log(`  Input: "${tc.input}" -> Result: "${result}" [${pass ? "PASS" : "FAIL"}]`);
}

// 2. Verify WhatsApp Message Template
console.log("\n2. Testing WhatsApp Message Construction:");
const mockOrder = {
  id: "SS-FR-20260905-971",
  customerName: "S.V. Hari Siva Balan",
  phone: "+91 90427 82559",
  whatsapp: "+91 90427 82559",
  woodType: "Rose Wood",
  woodPrice: 750,
  frameDesign: "Classic Gold",
  designPrice: 0,
  frameRatio: "8 × 10",
  ratioPrice: 900,
  totalAmount: 1650,
  status: "New",
};

const customerPhone = mockOrder.whatsapp || mockOrder.phone;
const dest = normalizeWhatsAppNumber(customerPhone);
const messageLines = [
  "Subash Studio Frame Order",
  "",
  `Order ID: ${mockOrder.id}`,
  "",
  `Customer Name: ${mockOrder.customerName}`,
  "",
  `Wood Type: ${mockOrder.woodType}`,
  "",
  `Frame Design: ${mockOrder.frameDesign}`,
  "",
  `Frame Ratio: ${mockOrder.frameRatio}`,
  "",
  `Amount: ${formatRupee(mockOrder.totalAmount)}`,
  "",
  `Order Status: ${mockOrder.status || "New"}`,
  "",
  "Thank you for ordering with Subash Studio.",
];

const messageText = messageLines.join("\n");
console.log("Constructed Message:\n" + messageText);
console.log("\nDestination: https://wa.me/" + dest);
const hasExpectedDestination = dest === "919042782559";
console.log(`Destination verification: [${hasExpectedDestination ? "PASS" : "FAIL"}]`);

// 3. Verify Pricing Calculations
console.log("\n3. Testing Pricing Model (Wood Base + Design Add + Ratio):");
// Teak (800) + Classic Gold (0) + 10x12 (1200) = 2000
const p1 = calculateFramePrice({
  wood: { basePrice: 800 },
  design: { additionalPrice: 0 },
  ratio: { price: 1200 },
});
console.log(`  Teak (800) + Gold (0) + 10x12 (1200) = ${p1.totalAmount} [${p1.totalAmount === 2000 ? "PASS" : "FAIL"}]`);

// Rose (750) + Modern Black (150) + 8x10 (900) = 1800
const p2 = calculateFramePrice({
  wood: { basePrice: 750 },
  design: { additionalPrice: 150 },
  ratio: { price: 900 },
});
console.log(`  Rose (750) + Modern Black (150) + 8x10 (900) = ${p2.totalAmount} [${p2.totalAmount === 1800 ? "PASS" : "FAIL"}]`);

// 4. Verify Frame Asset Files
console.log("\n4. Checking Frame Texture & Profile Assets in public/images/frames/:");
const expectedAssets = [
  "teak-wood.jpg",
  "rose-wood.jpg",
  "pine-wood.jpg",
  "black-wood.jpg",
  "walnut-wood.jpg",
  "classic-gold.jpg",
  "modern-black.jpg",
  "vintage-brown.jpg",
  "minimal-white.jpg",
];

const framesDir = path.resolve("public/images/frames");
let allAssetsPresent = true;
for (const file of expectedAssets) {
  const fullPath = path.join(framesDir, file);
  const exists = fs.existsSync(fullPath);
  if (!exists) allAssetsPresent = false;
  const size = exists ? fs.statSync(fullPath).size : 0;
  console.log(`  ${file}: ${exists ? "FOUND (" + Math.round(size / 1024) + " KB)" : "MISSING"}`);
}

console.log("\n=== SUMMARY ===");
console.log(`WhatsApp Normalization: ${allNormPassed ? "ALL PASS" : "FAIL"}`);
console.log(`WhatsApp Destination: ${hasExpectedDestination ? "PASS" : "FAIL"}`);
console.log(`Pricing Calculations: ${p1.totalAmount === 2000 && p2.totalAmount === 1800 ? "ALL PASS" : "FAIL"}`);
console.log(`Frame Assets: ${allAssetsPresent ? "ALL PRESENT" : "FAIL"}`);
