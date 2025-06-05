import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../databases/CosmosDatabase";
import { RequiredQueryParams } from "../utils/RequiredParams";
import { SuccessResponse, ErrorResponse } from "../utils/ResponseHandler";

export async function DeleteTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = RequiredQueryParams(request, context, ["id", "organizationId"]);
        await container.item(params.id, params.organizationId).delete();
        return SuccessResponse(null, "Task deleted successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in DeleteTask");
    }
}

app.http('DeleteTask', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: DeleteTask
});
