# Inner Circle - An application for Square ;)



#### Inner Circle ⭕️ uses Square's native Loyalty services to create an enhanced group loyalty program while mainitaining each store's individual loyalties. 


[using this app as a client](#for-the-user)

[behind the works](#how-it-works)


## What This App Can Do for a Seller

- By creating an enhanced loyalty program, you can give a customer more options to redeem their points
- A shared Loyalty system will encourage a customer to return to your store
- By bringing in more stores, customers will redeem their points from multiple stores, rather than redeeming it all from your store
- It can provide incentive to small businesses to compete with large corporations with various stores



## Security and Flexibility

- Your store can easily leave a program and it will not affect your current loyalty program
- Nothing besides the added/redeemed points will be shared with other stores
- Circle will only update exisiting customers in your store and not add external ones
  - You can check where point changes for a customer by clicking on their profile
    - it will show which store updated your cutomer's points and by how much

- You can set up a conversion ratio between your partner points and yours giving you the option to choose what's best for your store



## For the User

#### How to Get Started



###### Step 1: Authorizing Circle

- easily authorize Circle with a few clicks to enrol



###### Step 2: Creating or Joining a Partner Program

after integrating with Circle, you can easily create a program by giving it a name or join a program

- Any Square seller with an active Loyalty program can authorize this app to <u>create</u> a **Partner Program** 
- Other Square sellers can <u>join</u> a Partner Program via a **Partner Id**



###### Step 3: Monitor and modify your program 

after step 2, you can view your loyalty statistics from the app:

- View your instore and external points
- Change your point conversion ratio
- See the participating stores and invite others
- Leave the partner program





## How it Works

<hr>

Under the hood, Circle uses
- Square's **MerchantsAPI**, **LoyaltyAPI**, **CustomersAPI**, **oAuthAPI**
- **Firebase**'s **Cloud functions** for the backend written in **Typescript**
- **Firebase**'s **Firestore** as a database to store and fetch data relevant to the programs and sellers
- A **React** Client and **MaterialUI** for the web application hosted on Firebase
<hr>


#### Authentication

Each user is authenticated via Square's Authentication. The app will recieve an authorization code and the backend server will Call the OAuth API to get an access token



#### Creating or joining a Partner Program 

After initiating create/join a program, the backend will create a collection in FireStore uniqely created for that user and store the user's program infromation. 

- if user is already in a program it will direct them there

For each store, Circle stores:

###### A document with information about a store as a client of Circle

```typescript
{
    programId: string; // id of their program
    storeId: string; // merchant id
    storeName: string; // name of the store
    isActive: boolean; // if store is in an active partner program
}
```

Each Program Collection contains:

###### A document with general program information

```typescript
{
  stores: string[]; // list of store names
  storeActivities: StoreMap; // under construction
  storeCount: number; // number of stores in the program
  programName: string; // name of the program
  id: string; // unique program id
}
```

###### A document for each participating store

```typescript
{
  storeId: string; // merchant id
  storeToken: string; // seller's access token
  storeName: string; // name of the store
  InternalPointsRecieved: number; // internal points given to customers 
  InternalPointsRedeemed: number; // internal points taken from customers 
  ExternalPointsRecieved: number; // external points given to customers 
  ExternalPointsRedeemed: number; // external points taken to customers 
  conversionRate: number; // the conversion ratio to apply to external points before applying to store
}
```

#### Leaving a Partner Program 

- Circle will use the stores info to delete the store's information from Firestore
- it will not affect store's own loyalty program
- any future changes to the partner program will not be applied to the store
- other participating stores will not lose their statisitics or program; but only have one less store in their program
- if no store is left in a program, Circle will delete the program



#### Behind the scenes' Flow



##### Customer interaction with a store

1. Everytime a customer buys something or redeems a reward, Square will send a **webhook** in response to the **loyalty event** to Circle. 

2. Circle uses Square's **LoyaltyAPI** to find customer's id and then the **CustomersAPI** to find the customers number

   - if event type is redeem, Circle will use the reward id and the **LoyaltyAPI** to find the points for that reward

3. Circle will go over the *partner program collection* in firestore and use the MerchantAPI to find all the partner stores

   - Then it uses the **CutomersAPI** to find the customer with the matching number and if found their loyalty account id

   - using **LoyaltyAPI's** adjust points, Circle increments or decrements the customer's point for the other stores based on the conversion ratio for each store and set a message to track for each seller
   - Lastly, will update firestore with the changed points



##### Dashboard

1. Circle will fetch the the program from **Firestore** based on user's credentials
   - Partner stores
   - Points applied internally or externally









