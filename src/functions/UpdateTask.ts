import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../databases/CosmosDatabase";
import { RequiredQueryParams } from "../utils/RequiredParams";
import { SuccessResponse, ErrorResponse } from "../utils/ResponseHandler";

export async function UpdateTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = RequiredQueryParams(request, context, ["id", "organizationId"]);
        const body = await request.json() as object;
        let patchRequests = [];
        for (let key in body) {
            patchRequests.push({
                "op": "add",
                "path": `/${key}`,
                "value": body[key]
            });
        }
        const { resource: task } = await container.item(params.id, params.organizationId).patch(patchRequests);
        return SuccessResponse(task, "Tasks updated successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in UpdateTask");
    }
};

app.http('UpdateTask', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    handler: UpdateTask
});
