import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const database = client.database("TaskApp");
const taskContainer = database.container("Tasks");
const statusContainer = database.container("Statuses");

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
        id: "Statuses",
        partitionKey: {
            paths: ["/name"],
        },
    });
    const defaultStatuses = [
        { id: "1", name: "Created" },
        { id: "2", name: "In Progress" },
        { id: "3", name: "Pending" },
        { id: "4", name: "Completed" },
    ];

    for (const status of defaultStatuses) {
        await statusContainer.items.upsert(status);
    }
}
setup().catch(console.error);

export { client, database, taskContainer, statusContainer };