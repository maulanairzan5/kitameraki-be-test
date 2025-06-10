**Requirements**
Before starting, ensure you have the following installed:
Node.js (version 18 or 20)
Azure Functions Core Tools (version 4)
Azure Cosmos DB (NoSQL with SQL API)
npm

1. Clone the Repository
git clone https://github.com/ingmaramzan/kitameraki-be-test.git
cd kitameraki-be-test

2. Install Dependencies
npm install

3. Configure Table and Environment Variables
for first time running see databases\task-app\task-app.ts there is commented line, please uncomment it for initial data
**Using the Cosmos DB Emulator Locally**
The emulator is available only on Windows
-> Download the Emulator
-> Launch the Emulator — it will expose the following:
Endpoint: https://localhost:8081
Primary Key: C2y6yDjf5/R+...==
-> Update Your .env File
NODE_ENV="DEV"
COSMOS_DB_CONNECTION_STRING=AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
Create a .env file in the root directory like .env.local

**Running the Function App Locally**
npm run clean
npm run build
func start
By default, your functions will be available at:
http://localhost:7071/api/{function-name}


4. Trust the Emulator's Self-Signed Certificate (Optional)
To allow Node.js to accept the self-signed certificate, run: