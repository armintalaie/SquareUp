import * as functions from "firebase-functions";
import { v4 as uuidv4 } from 'uuid';
import * as crypto from "crypto";
import { Client, Environment } from 'square';
import { ClientDoc, ClientInfo, ProgramInfo, StoreMap } from "./model";

const CLIENT_ID_2 = "sandbox-sq0idb-VJnyyzDH0JqdQMHHRvtZKQ";
const CLIENTT_SECRET_2 = "sandbox-sq0csb-aVfFdHjmx1GZPOzE3mZ9aeW91jqaQUE6vC7s4gLD3q8";
const admin = require('firebase-admin');
const NOTIFICATION_URL = "EXAMPLE";
const META = "clients";

const sigKey = "EXAMPLE";

admin.initializeApp();

function isFromSquare(NOTIFICATION_URL, request, sigKey) {
  const hmac = crypto.createHmac("sha1", sigKey);
  hmac.update(NOTIFICATION_URL + JSON.stringify(request.body));
  const hash = hmac.digest("base64");

  return request.get("X-Square-Signature") === hash;
}


// TODO: update
exports.createPartnerProgram = functions.https.onRequest(async (req, res) => {

  try {
    const newProgramId: string = uuidv4();
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken:req.query.token as string,
    })

    const merchant = (await client.merchantsApi.retrieveMerchant("me"));
    const storeId = merchant.result.merchant!.id as string;
    const storeName = merchant.result.merchant!.businessName as string;

    const refClient = await checkForExisitingClients(storeId);

    if (refClient.exists) {
      const program = refClient.data().programId;
      const document = await admin.firestore().collection(program).doc(META).get();
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program: document.programName });
      
    } else {
      checkIfLoyaltyIsActive();
      const newClient: ClientInfo = { programId: newProgramId, storeName: storeName, isActive: true, storeId: storeId};
      const clientDoc: ClientDoc = { storeName: newClient.storeName, storeId: newClient.storeId, storeToken: req.query.token as string, pointsRecieved: 0, pointsRedeemed: 0 }
      let storeMap: StoreMap = {};
      storeMap[newClient.storeId] = false;
      const newProgram: ProgramInfo = { stores: [newClient.storeName], storeActivities: [storeMap], storeCount: 1, programName: req.query.program as string, id: newClient.programId};
      await admin.firestore().collection(META).doc(newClient.storeId).set(newClient);
      await admin.firestore().collection(newClient.programId).doc(newClient.storeId).set(clientDoc);
      await admin.firestore().collection(newClient.programId).doc(META).set(newProgram);
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program:  newProgram.programName, stores: newProgram.stores, partnerid: newProgram.id});
    };
  
   
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }

});


// TODO: update
exports.joinPartnerProgram = functions.https.onRequest(async (req, res) => {
  try {
    const ProgramId = req.query.program as string;
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: req.query.token as string,
    })
    const merchant = (await client.merchantsApi.retrieveMerchant("me"));
    const storeId = merchant.result.merchant!.id as string;
    const storeName = merchant.result.merchant!.businessName as string;

    

    const refClient = await checkForExisitingClients(storeId);

    if (refClient.exists) {
      const program = refClient.data().programId;
      const document = await admin.firestore().collection(program).doc(META).get();
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program: document.programName });
      
    } else {
      const newClient: ClientInfo = { programId: ProgramId, storeName: storeName, isActive: true, storeId: storeId};
      const clientDoc: ClientDoc = { storeName: newClient.storeName, storeId: newClient.storeId, storeToken: req.query.token as string, pointsRecieved: 0, pointsRedeemed: 0 }

      await admin.firestore().collection(META).doc(newClient.storeId).set(newClient);
      await admin.firestore().collection(newClient.programId).doc(newClient.storeId).set(clientDoc);

      const doc = await admin.firestore().collection(ProgramId).doc(META).get()
      const data: ProgramInfo = doc.data();
      let stores: string[] =doc.data().stores;
      stores.push(newClient.storeName);

      let storeMap: StoreMap[] = data.storeActivities;
      let newStoreMap: StoreMap = {};
      newStoreMap[newClient.storeId] = false;
      storeMap.push(newStoreMap);
      const updated: ProgramInfo = { stores: stores, storeActivities: storeMap, storeCount: data.storeCount + 1, programName: data.programName as string, id: data.id};
      await admin.firestore().collection(ProgramId).doc(META).set(updated);

      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program:  doc.data().programName, stores: stores,partnerid:ProgramId});
    };
  
    // await admin.firestore().collection(newProgramId).doc('meta').set({[storeId]: admin.firestore().collection("/" + newProgramId).doc(writeResult.id)}, {merge: true});
  } catch (e) {
    console.log(e);
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(400).json({});

  }

});


//TODO:

exports.leavePartnerProgram = functions.https.onRequest(async (req, res) => {

  try {
    console.log("fetching client");
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: req.query.token as string,
    })

    console.log("fetching merchant");
    const merchant = (await client.merchantsApi.retrieveMerchant("me"));
    const storeId: string = merchant.result.merchant!.id as string;

    // find program store belongs to
    console.log("fetching client's info from DS - client is " + merchant.result.merchant!.businessName );
    const store: ClientInfo = await admin.firestore().collection(META).doc(storeId).get().data();

    console.log("fetching program of client");
    const doc = await admin.firestore().collection(store.programId).doc(META);
    const programInfo: ProgramInfo = doc.get().data();
    

    const storeMap: StoreMap[] = programInfo.storeActivities;
    
    let newStoreMap: StoreMap[] = [];

    storeMap.forEach(st => {
      if (!st.hasOwnProperty(storeId)) {
        newStoreMap.push(st);
      }
    });

    console.log("updating database");
    await doc.update({ storeCount: programInfo.storeCount - 1, storeActivities: newStoreMap });
    await admin.firestore().collection(store.programId).doc(storeId).delete();
    await admin.firestore().collection(META).doc(storeId).delete();

  } catch (error) {
    console.error(error);
  }

});



exports.customer = functions.https.onRequest(async (req, res) => {

  if (isFromSquare(NOTIFICATION_URL, req, sigKey)) {
    res.status(200);
    
  } else {
    res.status(400);
  }
  res.send(req);

});



// TODO: update
exports.updateLoyaltyforCustomer = functions.https.onRequest(async (req, res) => {


  const customerNumber = req.body.data.object.loyalty_account.mapping.phone_number;
  const customerPoints = req.body.data.object.loyalty_account.balance;
  //const reason = req.body.data.object.loyalty_account.balance;
  const partnerProgramid = await findPartnerProgram(req.body.merchant_id);
  const allClients = await fetchStores(req.body.merchant_id, partnerProgramid as string);

  const message = `${allClients.callingBusiness} modified customer loyaty points`
  allClients.clients.forEach(client => {
    updateCustomer(client, customerNumber, customerPoints, message);
  });

  res.set({ 'Access-Control-Allow-Origin': '*' }).status(200);

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

async function findPartnerProgram(id: string) {
  const doc = await admin.firestore().collection(META).doc(id).get();
  return doc.data().programId;
}


async function fetchStores(merchantId: string, programId: string) {

  let callingClient: Client| undefined = undefined;
  let callingBusiness: string = "";

  const partners = await admin.firestore().collection(programId).get();
  let clients: Client[] = [];
  for (const doc of partners.docs) {
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: doc.data().token as string,
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


exports.authorize = functions.https.onRequest(async (req, res) => {
  const client: Client = new Client({ environment: Environment.Sandbox });

  try {
    const response = await client.oAuthApi.obtainToken({
      clientId: CLIENT_ID_2,
      clientSecret: CLIENTT_SECRET_2,
      grantType: "authorization_code",
      code: req.query.code as string
    });
    // if (response.statusCode.valueOf() == 200) {
    //   await createSellerAccount(response.result.accessToken as string, response.result.refreshToken as string, response.result.merchantId as string);
   
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ token: response.result.accessToken });
    // } else {
    //   throw new Error("Failed to authenticate");
    // }
  } catch (error) {
  
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(400).json({ token: error });
   
  }
})


exports.authorize_me = functions.https.onRequest(async (req, res) => {
  const scope = [
    "CUSTOMERS_WRITE",
    "CUSTOMERS_READ",
    "MERCHANT_PROFILE_READ",
    "MERCHANT_PROFILE_WRITE",
    "LOYALTY_WRITE",
    "LOYALTY_READ",
  ];
  //const client: Client = new Client({ environment: Environment.Sandbox });
  const CLIENT_ID_2 = "sandbox-sq0idb-VJnyyzDH0JqdQMHHRvtZKQ";
  const authURL =
    "https://connect.squareupsandbox.com/oauth2/authorize?client_id=" +
    CLIENT_ID_2 +
    "&scope=" +
    scope.join("+") +
    "&session=False&state=82201dd8d83d23cc8a48caf52b";

  res.redirect(authURL);
})

async function checkForExisitingClients(id: string) {
  return await admin.firestore().collection(META).doc(id).get();
}



exports.fetchStats =  functions.https.onRequest(async (req, res) => {
  // program name
  // program id
  // stores
  // for each store the internal and external points
})




async function checkIfLoyaltyIsActive() {

}