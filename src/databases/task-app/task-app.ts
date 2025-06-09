import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const database = client.database("TaskApp");
const taskContainer = database.container("Tasks");
const formSettingContainer = database.container("FormSetting");
import { v4 as uuidv4 } from "uuid";

// for setup database
if (process.env.NODE_ENV !== "PROD") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
async function setup() {
    const { database } = await client.databases.createIfNotExists({
        id: "TaskApp",
    });
    await database.containers.createIfNotExists({
        id: "Tasks",
        partitionKey: {
            paths: ["/organizationId"],
        },
    });

    await database.containers.createIfNotExists({
        id: "FormSetting",
        partitionKey: {
            paths: ["/organizationId"],
        },
    });
    const defaultFormSetting = {
        id: "72f61a10-2524-11ef-8c66-8b55b44d9e5a",
        organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333",
        data: [
            { id: uuidv4(), description: "ID", required: true, type: "String", isVisible: false },
            { id: uuidv4(), description: "Organization ID", required: true, type: "String", isVisible: false },
            { id: uuidv4(), description: "Title", required: true, type: "String" },
            { id: uuidv4(), description: "Description", required: false, type: "String" },
            {
                id: uuidv4(), description: "Status", required: true, type: "Enum", isFilter: true, value: [
                    {
                        id: uuidv4(),
                        description: "To Do",
                        default: true
                    },
                    {
                        id: uuidv4(),
                        description: "In Progress"
                    },
                    {
                        id: uuidv4(),
                        description: "Completed"
                    }
                ]
            },
            { id: uuidv4(), description: "Due Date", required: false, type: "Date" },
            {
                id: uuidv4(), description: "Priority", required: false, type: "Enum", value: [
                    {
                        id: uuidv4(),
                        description: "Low",
                        default: true
                    },
                    {
                        id: uuidv4(),
                        description: "Medium"
                    },
                    {
                        id: uuidv4(),
                        description: "High"
                    }
                ]
            },
            { id: uuidv4(), description: "Tags", required: false, type: "Array" },
        ]
    }
    await formSettingContainer.items.upsert(defaultFormSetting);
}
setup().catch(console.error);

export { client, database, taskContainer, formSettingContainer };