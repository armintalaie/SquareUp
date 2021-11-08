import * as functions from "firebase-functions";
import { v4 as uuidv4 } from 'uuid';
import * as crypto from "crypto";
import { Client, Environment } from 'square';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

const admin = require('firebase-admin');
admin.initializeApp();
const NOTIFICATION_URL = "EXAMPLE";
// dev portal for app
// Note: Signature key is truncated for illustration
const sigKey = "EXAMPLE";

function isFromSquare(NOTIFICATION_URL, request, sigKey) {
  const hmac = crypto.createHmac("sha1", sigKey);
  hmac.update(NOTIFICATION_URL + JSON.stringify(request.body));
  const hash = hmac.digest("base64");

  return request.get("X-Square-Signature") === hash;
}

let programIdTest: string = 'EXAMPLE';

exports.createPartnerProgram = functions.https.onRequest(async (req, res) => {
  
  //const newProgramId: string = uuidv4();
  const storeId = req.query.storeId as string;
  const storeName = req.query.storeName as string;
  //const programName = req.query.programName;
  
  await admin.firestore().collection(programIdTest).doc(storeId).set({ storeId: storeId, storeName: storeName });

  //await admin.firestore().collection(newProgramId).doc('meta').set({ programName: programName, [storeId]: admin.firestore().collection("/" + newProgramId).doc(writeResult.id) });
  
  res.status(200);
  //programIdTest = newProgramId;
  res.send(`successfully added new program with id ${programIdTest} and store ${storeName} : ${storeId}`);

});

exports.joinPartnerProgram = functions.https.onRequest(async (req, res) => {

  //const newProgramId = req.query.programId as string;
  const storeId = req.query.storeId as string;
  const storeName = req.query.storeName as string;
  
 await admin.firestore().collection(programIdTest).doc(storeId).set({ storeId: storeId, storeName: storeName });
 // await admin.firestore().collection(newProgramId).doc('meta').set({[storeId]: admin.firestore().collection("/" + newProgramId).doc(writeResult.id)}, {merge: true});

  res.status(200);
  res.send(`successfully added new store to program id ${programIdTest} as store ${storeName} : ${storeId}`);

});

exports.customer = functions.https.onRequest(async (req, res) => {

  if (isFromSquare(NOTIFICATION_URL, req, sigKey)) {
    res.status(200);
    
  } else {
    res.status(400);
  }
  res.send(req);

});


exports.updateLoyaltyforCustomer = functions.https.onRequest(async (req, res) => {


  const customerNumber = req.body.data.object.loyalty_account.mapping.phone_number;
  const customerPoints = req.body.data.object.loyalty_account.balance;
  const allClients = await fetchStores(req.body.merchant_id);

  const message = `${allClients.callingBusiness} modified customer loyaty points`
  allClients.clients.forEach(client => {
    updateCustomer(client, customerNumber, customerPoints, message);
  });

  res.status(200);
  res.send();
})


async function updateCustomer(client: Client, customerNumber: string, customerPoints: number, message?: string) {
  try {
    const response = await client.customersApi.searchCustomers({
      query: {
        filter: {
          phoneNumber: {
            exact: customerNumber
          }
        }
      }
    });
  
    if (response.result.customers) {
      console.log("CUSTOMER EXISTS");
      const loyaltySearch = await client.loyaltyApi.searchLoyaltyAccounts({
        query: {
          customerIds: [
            response.result.customers[0].id as string
          ]
        }
      });

      if (loyaltySearch.result.loyaltyAccounts) {
        console.log("CUSTOMER LOYALTY FOUND");
        client.loyaltyApi.adjustLoyaltyPoints(loyaltySearch.result.loyaltyAccounts[0].id!, {
          idempotencyKey: uuidv4(),
          adjustPoints: {
            points: customerPoints,
            reason: message!
          }
        });
      }
      
    }    
  } catch(error) {
    console.log(error);
  }
}


async function fetchStores(merchantId: string) {

  let callingClient: Client| undefined = undefined;
  let callingBusiness: string = "";

  const partners = await admin.firestore().collection(programIdTest).get();
  let clients: Client[] = [];
  for (const doc of partners.docs) {
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: doc.data().storeId as string,
    })

    try {
      if (callingClient === undefined) {
        const currMerchant = await client.merchantsApi.retrieveMerchant("me");
        if (currMerchant.result.merchant?.id == merchantId) {
          callingClient = client;
          callingBusiness = currMerchant.result.merchant.businessName as string;
        } else {
          clients.push(client);
        }
      } else {
        clients.push(client);
      }
    } catch (err) {
      console.log(err);
    };
  };
  return {clients: clients, callingClient: callingClient!, callingBusiness: callingBusiness};
}

