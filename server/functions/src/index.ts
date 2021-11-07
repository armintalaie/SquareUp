import * as functions from "firebase-functions";
import { v4 as uuidv4 } from 'uuid';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();


exports.createPartnerProgram = functions.https.onRequest(async (req, res) => {
  
  const newProgramId: string = uuidv4();
  const storeId = req.query.storeId as string;
  const storeName = req.query.storeName as string;
  const programName = req.query.programName;
  
  const writeResult = await admin.firestore().collection(newProgramId).doc(storeId).set({ storeId: storeId, storeName: storeName });

  await admin.firestore().collection(newProgramId).doc('meta').set({ programName: programName, [storeId]: admin.firestore().collection("/" + newProgramId).doc(writeResult.id) });
  
  res.status(200);
  res.send(`successfully added new program with id ${newProgramId} and store ${storeName} : ${storeId}`);

});


exports.joinPartnerProgram = functions.https.onRequest(async (req, res) => {

  const newProgramId = req.query.programId as string;
  const storeId = req.query.storeId as string;
  const storeName = req.query.storeName as string;
  
  const writeResult = await admin.firestore().collection(newProgramId).doc(storeId).set({ storeId: storeId, storeName: storeName });
  await admin.firestore().collection(newProgramId).doc('meta').set({[storeId]: admin.firestore().collection("/" + newProgramId).doc(writeResult.id)}, {merge: true});

  res.status(200);
  res.send(`successfully added new store to program id ${newProgramId} as store ${storeName} : ${storeId}`);

});



// const doc = admin.firestore().collection('cities').doc('SF');

// const observer = doc.onSnapshot(docSnapshot => {
//   console.log(`Received doc snapshot: ${docSnapshot}`);
//   let data = docSnapshot.data();
//   console.log(`Retrieved data: ${JSON.stringify(data)}`);
//   // ...
// }, err => {
//   console.log(`Encountered error: ${err}`);
// })

// console.log(observer)