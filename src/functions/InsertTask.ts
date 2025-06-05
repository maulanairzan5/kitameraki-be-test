import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../databases/CosmosDatabase";
import { RequiredBodyParams } from "../utils/RequiredParams";
import { SuccessResponse, ErrorResponse } from "../utils/ResponseHandler";

export async function InsertTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = await RequiredBodyParams(request, context, ["id", "organizationId"]);
        const { resource: task } = await container.items.create(params);
        return SuccessResponse(task, "Task inserted successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in InsertTask");
    }
};

app.http('InsertTask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: InsertTask
});
