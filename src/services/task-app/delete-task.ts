import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { taskContainer } from "../../databases/task-app/task-app";
import { RequiredQueryParams } from "../../utils/required-params";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

export async function DeleteTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = RequiredQueryParams(request, ["id", "organizationId"]);
        await taskContainer.item(params.id, params.organizationId).delete();
        return SuccessResponse(null, "Task deleted successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in DeleteTask");
    }
}
