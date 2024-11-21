// import * as faceapi from "face-api.js";
// import canvas from "canvas";
// import fs from "fs";
// import path from "path";

// // Initialize face-api.js with canvas environment
// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// // Load face-api.js models
// const loadModels = async () => {
//   await Promise.all([
//     faceapi.nets.ssdMobilenetv1.loadFromDisk("./models"),
//     faceapi.nets.faceLandmark68Net.loadFromDisk("./models"),
//     faceapi.nets.faceRecognitionNet.loadFromDisk("./models"),
//   ]);
// };

// // Load face descriptors from the dataset folder
// export const loadFaceDescriptors = async () => {
//   const datasetPath = path.join(__dirname, "../mockUpDataSet");  // Assuming dataset folder is outside services
//   const files = fs.readdirSync(datasetPath);
//   const descriptors = [];

//   for (const file of files) {
//     const filePath = path.join(datasetPath, file);
//     const image = await canvas.loadImage(filePath);
//     const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

//     if (detections) {
//       descriptors.push({ id: path.basename(file, path.extname(file)), descriptor: detections.descriptor });
//     }
//   }

//   return descriptors;
// };

// // Compare incoming face image with stored descriptors
// export const compareFace = async (imagePath, descriptors) => {
//   const image = await canvas.loadImage(imagePath);
//   const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

//   if (!detections) {
//     return null;
//   }

//   const queryDescriptor = detections.descriptor;
//   let bestMatch = { id: null, distance: Infinity };

//   descriptors.forEach(({ id, descriptor }) => {
//     const distance = faceapi.euclideanDistance(queryDescriptor, descriptor);
//     if (distance < bestMatch.distance) {
//       bestMatch = { id, distance };
//     }
//   });

//   if (bestMatch.distance < 0.6) {
//     return bestMatch.id; 
//   }

//   return null; 
// };



