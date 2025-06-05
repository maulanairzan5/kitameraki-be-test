import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../databases/CosmosDatabase";
import { RequiredQueryParams } from "../utils/RequiredParams";
import { SuccessResponse, ErrorResponse } from "../utils/ResponseHandler";

export async function GetTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { organizationId } = RequiredQueryParams(request, context, ['organizationId']);
        const querySpec = {
            query: "SELECT * FROM c WHERE c.organizationId = @organizationId",
            parameters: [
                { name: "@organizationId", value: organizationId }
            ]
        };
        const { resources: tasks } = await container.items.query(querySpec).fetchAll();
        return SuccessResponse(tasks, "Tasks fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetTasks");
    }
}

app.http('GetTasks', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetTasks
});
