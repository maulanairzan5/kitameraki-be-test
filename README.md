**note**
for local running, using create file with name .env like .env.local file
using cosmo DB emulator localy, don't forget to download and update node_modules npm

**for run**
npm run clean
npm run build
func start

**for database**
using data like this format
{
  "id": "1",
  "organizationId": "2",
  "name": "My Task 1",
  "description" : "My Task Description 1",
  "status" : "Completed"
}
with status for filter, and here list of status
- Created
- In Progress
- Pending
- Completed
Note : for better development, we must have another table for save All Status
with name and description as search parameter

curl for insert task:
curl --location 'http://localhost:7071/api/InsertTask' \
--header 'Content-Type: application/json' \
--data '{
  "id": "1",
  "organizationId": "2",
  "name": "My Task 1",
  "description" : "My Task Description 1",
  "status" : "Completed"
}
'

Note: Currently, in the FE, data is accepted for organizationId "2", so to display in FE, insert for organizationId "2"
