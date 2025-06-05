import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../databases/CosmosDatabase";
import { RequiredQueryParams } from "../utils/RequiredParams";
import { SuccessResponse, ErrorResponse } from "../utils/ResponseHandler";

export async function GetTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = RequiredQueryParams(request, context, ["id", "organizationId"]);
        const { resource: task } = await container.item(params.id, params.organizationId).read();
        return SuccessResponse(task, "Task fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetTask");
    }
}

app.http("GetTask", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: GetTask,
});
