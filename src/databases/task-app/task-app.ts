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
    // use for first time setting
    // const defaultFormSetting = [
    //     { id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "ID", required: true, type: "Text", isVisible: false, order: 1 },
    //     { id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Organization ID", required: true, type: "Text", isVisible: false, order: 2 },
    //     { id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Title", required: true, type: "Text", order: 3 },
    //     { id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Description", required: false, type: "Text", order: 4 },
    //     {
    //         id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Status", required: true, type: "Enum", isFilter: true, order: 5, value: [
    //             {
    //                 id: uuidv4(),
    //                 name: "To Do",
    //                 default: true
    //             },
    //             {
    //                 id: uuidv4(),
    //                 name: "In Progress"
    //             },
    //             {
    //                 id: uuidv4(),
    //                 name: "Completed"
    //             }
    //         ]
    //     },
    //     { id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Due Date", required: false, type: "Date", order: 6 },
    //     {
    //         id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Priority", required: false, type: "Enum", order: 7, value: [
    //             {
    //                 id: uuidv4(),
    //                 name: "Low",
    //                 default: true
    //             },
    //             {
    //                 id: uuidv4(),
    //                 name: "Medium"
    //             },
    //             {
    //                 id: uuidv4(),
    //                 name: "High"
    //             }
    //         ]
    //     },
    //     { id: uuidv4(), organizationId: "a349f1e2-b52d-4085-9402-8100a6ae4333", name: "Tags", required: false, type: "Array", order: 8 },
    // ]
    // for (const formSetting of defaultFormSetting) {
    //     await formSettingContainer.items.upsert(formSetting);
    }
}
setup().catch(console.error);

export { client, database, taskContainer, formSettingContainer };