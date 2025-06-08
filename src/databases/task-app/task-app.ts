import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING!;
const client = new CosmosClient(connectionString);
const database = client.database("TaskApp");
const taskContainer = database.container("Tasks");
const statusContainer = database.container("Statuses");
const formSettingContainer = database.container("FormSetting");

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
        { id: "todo", name: "To Do" },
        { id: "in-progress", name: "In Progress" },
        { id: "completed", name: "Completed" },
    ];
    for (const status of defaultStatuses) {
        await statusContainer.items.upsert(status);
    }
    await database.containers.createIfNotExists({
        id: "FormSetting",
        partitionKey: {
            paths: ["/name"],
        },
    });
    const defaultFormSetting = {
        id: "72f61a10-2524-11ef-8c66-8b55b44d9e5a",
        name: "default",
        data: [
            { name: "id", description: "ID", required: true, type: "String" },
            { name: "organizationId", description: "Organization ID", required: true, type: "String" },
            { name: "title", description: "Title", required: true, type: "String" },
            { name: "description", description: "Description", required: false, type: "String" },
            {
                name: "status", description: "Status", required: true, type: "Enum", value: [
                    {
                        name: "todo",
                        description: "To Do",
                        default: true
                    },
                    {
                        name: "in-progress",
                        description: "In Progress"
                    },
                    {
                        name: "completed",
                        description: "Completed"
                    }
                ]
            },
            { name: "dueDate", description: "Due Date", required: false, type: "Datetime" },
            {
                name: "priority", description: "Priority", required: false, type: "Enum", value: [
                    {
                        name: "low",
                        description: "Low",
                        default: true
                    },
                    {
                        name: "medium",
                        description: "Medium"
                    },
                    {
                        name: "high",
                        description: "High"
                    }
                ]
            },
            { name: "tags", description: "Tags", required: false, type: "Array" },
        ]
    }
    await formSettingContainer.items.upsert(defaultFormSetting);
}
setup().catch(console.error);

export { client, database, taskContainer, statusContainer, formSettingContainer };