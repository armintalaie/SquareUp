import { Client, Environment } from 'square'
import { client1, client2 } from './app'


// Managing individual loyalty programs
// TODO
export async function getLoyaltyProgram(client: Client) {
    
}

// TODO
export async function createLoyaltyProgram(client: Client) {
    
}

// TODO
export async function deleteLoyaltyProgram(client: Client) {
    
}

// TODO
export async function modifyLoyaltyProgram(client: Client) {
    
}



// Managing partnering loyalties

// TODO
export async function createPartnerProgram(clients: Client[]) {

}

// TODO
export async function modifyPartnerProgram(clients: Client[]) {
    
}

// TODO
export async function deletePartnerProgram(clients: Client[]) {
    
}

// TODO
export async function setPartnerProgramConversion(clients: Client[]) {
    
}



// Customer Base

// TODO
export async function createSharedCustomerGroup(clients: Client[]) {
    
}

// TODO
export async function createExternalCustomerBaseGroup(clients: Client[]) {
    
}

// TODO
export async function isCustomerInProgram(clients: Client[], acountid: string) {
    
}

// TODO
export async function isCustomerInternal(clients: Client, acountid: string) {
    
}



// Individual Customer Interactions

// TODO
export async function adjustCustomerPoints(clients: Client[], acountid: string, points: number) {
    
}

// TODO
export async function redeemCustomerPoints(clients: Client[], acountid: string, points: number) {
    
}

// TODO
export async function PurchasePoints(clients: Client[], acountid: string, points: number) {
    
}

// TODO
export async function addCustomerToBase(clients: Client[], acountid: string) {
    
}

// TODO
export async function deleteCustomerFromBase(clients: Client[], acountid: string) {
    
}



// Loyalty Partnership Insights

// TODO
export async function totalLoyaltyCustomers(client: Client) {
    
}

// TODO
export async function internalLoyaltyCustomers(client: Client) {
    
}

// TODO
export async function externaloyaltyCustomers(client: Client) {
    
}

// TODO
export async function internalAccumulated(client: Client) {
    
}

// TODO
export async function internalRedeemed(client: Client) {
    
}

// TODO
export async function externalAccumulated(client: Client) {
    
}

// TODO
export async function externalRedeemed(client: Client) {
    
}