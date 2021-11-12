import { Client, Environment } from 'square'
import { client1, client2 } from './app'
import { v4 as uuidv4 } from 'uuid';
import async from 'async';

const PARTNER_PROGRAM_NAME = "PartnerCustomerssss"
const PARTNER_PROGRAM_ID = "5a12a1fe-4b3a-43f0-9e07-21715f4a4334"

// Managing individual loyalty programs
// TODO:
export async function getLoyaltyProgram(client: Client) {
    try {
        const response = await  client.loyaltyApi.retrieveLoyaltyProgram('main');
        console.log(response.result);
        return response.result;
      } catch(error) {
        console.log(error);
      }
}

// TODO:
export async function createLoyaltyProgram(client: Client) {
    if (await hasActiveLoyaltyProgram(client)) {
        throw new Error("Client already has a loyalty program");
    } else {
        return true;
    }
}

// TODO:
export async function deleteLoyaltyProgram(client: Client) {
    
}

// TODO:
export async function modifyLoyaltyProgram(client: Client) {
    
}

// TODO:
export async function hasActiveLoyaltyProgram(client: Client) {
    try {
        const response = await  client.loyaltyApi.retrieveLoyaltyProgram('main');
        return response.result.program?.status === "ACTIVE";
      } catch(error) {
        console.log(error);
      }
}



// Managing partnering loyalties

// TODO:
export async function createPartnerProgram(clients: Client[]) {

}

// TODO:
export async function modifyPartnerProgram(clients: Client[]) {
    
}

// TODO:
export async function deletePartnerProgram(clients: Client[]) {
    
}

// TODO:
export async function setPartnerProgramConversion(clients: Client[]) {
    
}



// Customer Base

// FIXME: dfmddff
export async function createSharedCustomerGroup(clients: Client[]) {
    
    let result: any[] = [];

    try {
        await Promise.all(clients.map(async (client) => {
            const response = await client.customerGroupsApi.createCustomerGroup({
                idempotencyKey: PARTNER_PROGRAM_ID,
                group: {
                  name: PARTNER_PROGRAM_NAME
                }
            });
    
            await result.push(response.result.group?.id);
        }))

        return result;
        
      } catch(error) {
        console.log(error);
      }
    
}

// FIXME: dfmddff
export async function deleteSharedCustomerGroup(clients: Client[]) {
    try {
        
        await Promise.all(clients.map(async (client) => {
            const id: string = 'ss';
            const response = await client.customerGroupsApi.deleteCustomerGroup(id);
        }))
        
      } catch(error) {
        console.log(error);
      }
    
}

// TODO:
export async function getSharedCustomerGroup(client: Client) {
    
    let result: any[] = [];

    try {
       
        const response = await client.customerGroupsApi.createCustomerGroup({
            idempotencyKey: uuidv4(),
            group: {
                name: PARTNER_PROGRAM_NAME
                }
            });
    
            await result.push(response.result.group?.id);
        

        return result;
        
      } catch(error) {
        console.log(error);
      }
    
}

// TODO:
export async function createExternalCustomerBaseGroup(clients: Client[]) {
    
}

// TODO:
export async function isCustomerInProgram(clients: Client[], acountid: string) {
    
}

// TODO:
export async function isCustomerInternal(clients: Client, acountid: string) {
    
}



// Individual Customer Interactions

// TODO:
export async function adjustCustomerPoints(clients: Client[], acountid: string, points: number) {
    
}

// TODO:
export async function redeemCustomerPoints(clients: Client[], acountid: string, points: number) {
    
}

// TODO:
export async function PurchasePoints(clients: Client[], acountid: string, points: number) {
    
}

// TODO:
export async function addCustomerToBase(clients: Client[], acountid: string) {
    
}

// TODO:
export async function deleteCustomerFromBase(clients: Client[], acountid: string) {
    
}



// Loyalty Partnership Insights

// TODO:
export async function totalLoyaltyCustomers(client: Client) {
    
}

// TODO:
export async function internalLoyaltyCustomers(client: Client) {
    
}

// TODO:
export async function externaloyaltyCustomers(client: Client) {
    
}

// TODO:
export async function internalAccumulated(client: Client) {
    
}

// TODO:
export async function internalRedeemed(client: Client) {
    
}

// TODO:
export async function externalAccumulated(client: Client) {
    
}

// TODO:
export async function externalRedeemed(client: Client) {
    
}