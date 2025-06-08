import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { taskContainer } from "../../databases/task-app/task-app";
import { RequiredQueryParams } from "../../utils/required-params";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

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
        const { resource: task } = await taskContainer.item(params.id, params.organizationId).patch(patchRequests);
        return SuccessResponse(task, "Tasks updated successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in UpdateTask");
    }
};
