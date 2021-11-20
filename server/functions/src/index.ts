import * as functions from "firebase-functions";
import { v4 as uuidv4 } from 'uuid';
import * as crypto from "crypto";
import { Client, Environment } from 'square';
import { Activity, ClientDoc, ClientInfo, ProgramInfo, StoreMap } from "./model";
import { SQUARE_API } from "./API";

//import * as admin from 'firebase-admin';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const META = "META";
const CLIENT_ID = functions.config().square != undefined ? functions.config().square.client_id : SQUARE_API.client_id;
const CLIENTT_SECRET = functions.config().square != undefined? functions.config().square.client_secret: SQUARE_API.client_secret;

const NOTIFICATION_URL = "EXAMPLE";


const sigKey = "EXAMPLE";

function isFromSquare(NOTIFICATION_URL, request, sigKey) {
  const hmac = crypto.createHmac("sha1", sigKey);
  hmac.update(NOTIFICATION_URL + JSON.stringify(request.body));
  const hash = hmac.digest("base64");

  return request.get("X-Square-Signature") === hash;
}


// TODO: clean up
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
      const document = await db.collection(program).doc(META).get();
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program: document.programName });
      
    } else {
      if (!hasActiveLoyaltyProgram(client)) {
        res.send("You need to have an active loyalty program")
      }
      const newClient: ClientInfo = { programId: newProgramId, storeName: storeName, isActive: true, storeId: storeId};
      const clientDoc: ClientDoc = { storeName: newClient.storeName, storeId: newClient.storeId, storeToken: req.query.token as string, InternalPointsRecieved: 0, InternalPointsRedeemed: 0, ExternalPointsRecieved: 0, ExternalPointsRedeemed: 0, conversionRate:1 }
      let storeMap: StoreMap = {};
      storeMap[newClient.storeId] = false;
      const activities: Activity = {};
  
      const newProgram: ProgramInfo = { stores: [newClient.storeName], storeActivities: storeMap, storeCount: 1, programName: req.query.program as string, id: newClient.programId};
      await db.collection(META).doc(newClient.storeId).set(newClient);
      await db.collection(newClient.programId).doc(newClient.storeId).set(clientDoc);
      await db.collection(newClient.programId).doc(META).set(newProgram);
      await db.collection(newClient.programId).doc("Activities").set(activities);
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program:  newProgram.programName, stores: newProgram.stores, partnerid: newProgram.id,  storeId: clientDoc.storeId});
    };
   
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }

});


// TODO: clean up
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
      const document = await db.collection(program).doc(META).get();
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program: document.programName });
      
    } else {
      if (!hasActiveLoyaltyProgram(client)) {
        res.send("You need to have an active loyalty program")
      }
      const newClient: ClientInfo = { programId: ProgramId, storeName: storeName, isActive: true, storeId: storeId};
      const clientDoc: ClientDoc = { storeName: newClient.storeName, storeId: newClient.storeId, storeToken: req.query.token as string,  InternalPointsRecieved: 0, InternalPointsRedeemed: 0, ExternalPointsRecieved: 0, ExternalPointsRedeemed: 0 , conversionRate: 1 }

      await db.collection(META).doc(newClient.storeId).set(newClient);
      await db.collection(newClient.programId).doc(newClient.storeId).set(clientDoc);

      const doc = await db.collection(ProgramId).doc(META).get()
      const data: ProgramInfo = doc.data();
      let stores: string[] =doc.data().stores;
      stores.push(newClient.storeName);

      let storeMap: StoreMap = data.storeActivities;
      storeMap[newClient.storeId] = false;
      const updated: ProgramInfo = { stores: stores, storeActivities: storeMap, storeCount: data.storeCount + 1, programName: data.programName as string, id: data.id};
      await db.collection(ProgramId).doc(META).set(updated);

      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program:  doc.data().programName, stores: stores,partnerid:ProgramId , storeId: clientDoc.storeId});
    };
    } catch (e) {
    console.log(e);
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(400).json({});

  }

});


// TODO: clean up
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
    const store: ClientInfo = (await db.collection(META).doc(storeId).get()).data();

    console.log("fetching program of client");
    const doc = await db.collection(store.programId).doc(META).get();
    const programInfo: ProgramInfo = doc.data();
    const storeMap: StoreMap = programInfo.storeActivities;
    let newStoreMap: StoreMap = {};

    for (const [key, value] of Object.entries(storeMap)) {
      if (key != storeId)
        newStoreMap[key] = value;
    }
   

    console.log("updating database");
    await db.collection(store.programId).doc(META).update({ storeCount: programInfo.storeCount - 1, storeActivities: newStoreMap });
    await db.collection(store.programId).doc(storeId).delete();
    await db.collection(META).doc(storeId).delete();
    if (programInfo.storeCount == 1) {
      deletePartnerProgram(programInfo.id);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }

});




async function deletePartnerProgram(programId: string) {
  console.log("deleting " + programId);
  await db.collection(programId).doc(META).delete();
}

exports.customer = functions.https.onRequest(async (req, res) => {

  if (isFromSquare(NOTIFICATION_URL, req, sigKey)) {
    res.status(200);
    
  } else {
    res.status(400);
  }
  res.send(req);

});



// FIXME: swap out webhook
exports.updateLoyaltyforCustomer = functions.https.onRequest(async (req, res) => {

  const EVENT_TYPE =  {REDEEM:"REDEEM_REWARD", ACCUMULATE: "ACCUMULATE_POINTS"}
  const loyaltyEventType = req.body.data.object.loyalty_event.type;
  console.log(loyaltyEventType);


  const partnerProgramid = await findPartnerProgram(req.body.merchant_id);
  const merchant_id = req.body.merchant_id;

  const token = (await db.collection(partnerProgramid).doc(merchant_id).get()).data();
  console.log(token);
  const client = new Client({
    environment: Environment.Sandbox,
    accessToken: token.storeToken as string,
  })


  let customerPoints: number = 0;
  if (EVENT_TYPE.REDEEM == loyaltyEventType) {
    const rewardId = req.body.data.object.loyalty_event["redeem_reward"].reward_id;
    const reward = await client.loyaltyApi.retrieveLoyaltyReward(rewardId);
    if (reward.result.reward?.points)
      customerPoints = -1 * reward.result.reward?.points as number;
    else {
      throw new Error("something went wrong with finding the reward")
    }
    
  } else if (EVENT_TYPE.ACCUMULATE == loyaltyEventType) {
    customerPoints = req.body.data.object.loyalty_event["accumulate_points"].points;
  } else {
    console.log("NOT SUPPORTED EVENT TYPE")
    res.status(400).send("NOT SUPPORTED EVENT TYPE");
    return;
  }

 
  updateDBPoints(merchant_id,  customerPoints, partnerProgramid , false);
  
  const customerNumber = await findCustomerNumber(client, req.body.data.object.loyalty_event.loyalty_account_id) as string;
  const allStores = await fetchStores(merchant_id, partnerProgramid, customerPoints);
  const programInfo: ProgramInfo = (await db.collection(partnerProgramid).doc(META).get()).data();
  allStores.clients.forEach(currClient => {
    updateCustomer(currClient, customerNumber, customerPoints, programInfo.programName + ":" + allStores.callingBusiness + ":"+ loyaltyEventType);
  })
  
  
  res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).send("ALL STORES HAVE BEEN UPDATED FOR CLIENT:" + customerNumber);

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


async function findCustomerNumber(client: Client, loyatyAccountId: string) {

  try {
    console.log((await client.merchantsApi.retrieveMerchant("me")).result.merchant?.businessName);
    console.log(loyatyAccountId);
    const loyaltyAccount = await client.loyaltyApi.retrieveLoyaltyAccount(loyatyAccountId);
    console.log(loyaltyAccount.result.loyaltyAccount);
    return loyaltyAccount.result.loyaltyAccount?.mapping?.phoneNumber;
  
  } catch (e) {
    console.log(e);
    return "NOT FOUND";
  }

}

async function findPartnerProgram(id: string) {
  const doc = await db.collection(META).doc(id).get();
  return doc.data().programId;
}



exports.authorize = functions.https.onRequest(async (req, res) => {
  const client: Client = new Client({ environment: Environment.Sandbox });

  try {
    console.log(CLIENT_ID + "  " + CLIENTT_SECRET + "  " + req.query.code);
    const response = await client.oAuthApi.obtainToken({
      clientId: CLIENT_ID,
      clientSecret: CLIENTT_SECRET,
      grantType: "authorization_code",
      code: req.query.code as string
    });
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ token: response.result.accessToken });
  } catch (error) {
    console.log(error);
  
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(400).json({ token: error });
   
  }
})


// TODO:
exports.fetchStats = functions.https.onRequest(async (req, res) => {
  // program name
  try {
    const storeToken = req.query.token;
    // program id
    const programId = req.query.program;
    const storeId = req.query.storeId;
    const data =  (await db.collection(programId).doc(storeId).get()).data();
    if (data.storeToken == storeToken) {
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json(data);
    }
  } catch (e) {
    console.log(e);
    res.set({ 'Access-Control-Allow-Origin': '*' }).sendStatus(400);
  }

})



// TODO:
export async function hasActiveLoyaltyProgram(client: Client) {
  try {
      const response = await  client.loyaltyApi.retrieveLoyaltyProgram('main');
      return response.result.program?.status === "ACTIVE";
  } catch (error) {
    console.log(error);
    return false;
     
    }
}

async function checkForExisitingClients(id: string) {
  return await admin.firestore().collection(META).doc(id).get();
}


export async function createSharedCustomerGroup(clients: Client[], partnerPorgramName: string ) {
    
  let result: any[] = [];

  try {
      await Promise.all(clients.map(async (client) => {
          const response = await client.customerGroupsApi.createCustomerGroup({
              idempotencyKey: uuidv4(),
              group: {
                name: partnerPorgramName
              }
          });
  
          await result.push(response.result.group?.id);
      }))

      
      
  } catch (error) {
    
    console.log(error);

  }
  
  return result;
  
}


export async function deleteSharedCustomerGroup(clients: Client[]) {
  try {
      
      await Promise.all(clients.map(async (client) => {
          const id: string = 'ss';
          await client.customerGroupsApi.deleteCustomerGroup(id);
      }))
    

      
    } catch(error) {
    console.log(error);

    }
  
}


async function fetchStores(merchantId: string, programId: string, customerPoints: number) {

  let callingClient: Client| undefined = undefined;
  let callingBusiness: string = "";

  const partners = await admin.firestore().collection(programId).get();
  let clients: Client[] = [];
  for (const doc of partners.docs) {
    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: doc.data().storeToken as string,
    })

    try {
      if (callingClient === undefined) {
        const currMerchant = await client.merchantsApi.retrieveMerchant("me");
        if (currMerchant.result.merchant?.id == merchantId) {
          callingClient = client;
          callingBusiness = currMerchant.result.merchant.businessName as string;
        } else {
          updateDBPoints(currMerchant.result.merchant?.id as string,  customerPoints, programId , true);
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


async function updateDBPoints(storeid: string, customerPoints: number, programId: string, isExternal: boolean) {
  let key: string = isExternal ? "External" : "Internal";

  let conversion = 1;
  if (!isExternal) {
    conversion = (await db.collection(programId).doc(storeid).get()).data().conversionRate;
  }
  if (customerPoints > 0) {
    await db.collection(programId).doc(storeid).update({[key + "PointsRecieved"]: admin.firestore.FieldValue.increment(customerPoints / conversion)})

  } else {
    await db.collection(programId).doc(storeid).update({[key + "PointsRedeemed"]: admin.firestore.FieldValue.increment(customerPoints / conversion)})

  }
 
}

 // let activities: Activity = (await db.collection(programInfo.id).doc("Activities").get()).data();

  // if (!activities.hasOwnProperty(customerNumber)) {
  //  activities =  await createCustomerAcitivty(customerNumber, programInfo.storeActivities, programInfo.id);
  // }

  // let storeMap: StoreMap = activities[customerNumber];

  // if (storeMap[merchant_id]) {
  //   console.log("customer update is looped through - deleting activitie");
  //   delete activities[customerNumber];
  //   await db.collection(programInfo.id).doc("Activities").set(activities);

  // } else {

  //   storeMap[merchant_id] = true;
  //   for (const [key, value] of Object.entries(storeMap)) {
  //     if (!value) {
  //       storeMap[key] = true;
  //       try {
  //         const message = `modified customer loyaty points`;
  //         console.log("fetching client to update " + key);
  //         const token = (await db.collection(programInfo.id).doc(key).get()).data().storeToken;
  //         activities[customerNumber] = storeMap;
  //         await db.collection(programInfo.id).doc("Activities").set(activities);
  //         console.log(token);
  //         const client = new Client({
  //           environment: Environment.Sandbox,
  //           accessToken: token as string,
  //         })
  //         updateCustomer(client, customerNumber, customerPoints, message);

  //       } catch (e) {
  //         console.log(e);
  //       }
   
  //       break;
  //     }

//     }
// }