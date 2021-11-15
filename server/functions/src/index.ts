import * as functions from "firebase-functions";
import { v4 as uuidv4 } from 'uuid';
import * as crypto from "crypto";
import { Client, Environment } from 'square';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//const META = "meta";
//const APPLICATION_LINK = "http://localhost:3000";
// const CLIENT_ID = "sq0idp-gmMyNcJXp6Zhwkc342U_6Q";
// const CLIENTT_SECRET = "sq0csp-Eb_8ixEcxs4Wepv8EzcuRG3FsWauYHs4MU6F3RGTG4A";
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
      await admin.firestore().collection(META).doc(storeId).set({storeName: storeName, programId: newProgramId});
      await admin.firestore().collection(newProgramId).doc(storeId).set({ storeId: storeId, storeName: storeName, token: req.query.token  })
      await admin.firestore().collection(newProgramId).doc(META).set({
        programName: req.query.program,
        stores: [storeName]
      });
      console.log(req.query.program);
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program:  req.query.program, stores: [storeName], partnerid: newProgramId});
    };
  
   
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }

});

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
      await admin.firestore().collection(META).doc(storeId).set({storeName: storeName, programId: ProgramId});
      await admin.firestore().collection(ProgramId).doc(storeId).set({ storeId: storeId, storeName: storeName , token: req.query.token  })
      const doc = await admin.firestore().collection(ProgramId).doc(META).get()
      let stores: string[] =doc.data().stores;
      stores.push(storeName)
      await admin.firestore().collection(ProgramId).doc(META).set({

        stores: stores
      });
      console.log(req.query.program);
      res.set({ 'Access-Control-Allow-Origin': '*' }).status(200).json({ program:  doc.data().programName, stores: stores,partnerid:ProgramId});
    };
  
    // await admin.firestore().collection(newProgramId).doc('meta').set({[storeId]: admin.firestore().collection("/" + newProgramId).doc(writeResult.id)}, {merge: true});
  } catch (e) {
    console.log(e);
    res.set({ 'Access-Control-Allow-Origin': '*' }).status(400).json({});

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


exports.updateLoyaltyforCustomer = functions.https.onRequest(async (req, res) => {


  const customerNumber = req.body.data.object.loyalty_account.mapping.phone_number;
  const customerPoints = req.body.data.object.loyalty_account.balance;
  const reason = req.body.data.object.loyalty_account.balance;
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


exports.testingpost = functions.https.onRequest(async (req, res) => {
  res.set({ 'Access-Control-Allow-Origin': '*' }).json({ token: "response.result.accessToken" });
})
// async function createSellerAccount(accessToken: string, refreshToken: string, merchantId: string) {
//   await admin.firestore().collection(META).doc(merchantId).set({ accessToken: accessToken, refreshToken: refreshToken, active: false });
// }



async function checkForExisitingClients(id: string) {
  return await admin.firestore().collection(META).doc(id).get();
}


exports.fetchStats =  functions.https.onRequest(async (req, res) => {
  // program name
  // program id
  // stores
  // for each store the internal and external points
})

// async function getProgram(id: string) {
  
// }