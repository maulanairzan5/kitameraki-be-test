import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { taskContainer } from "../../databases/task-app/task-app";
import { RequiredBodyParams } from "../../utils/required-params";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

export async function InsertTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = await RequiredBodyParams(request, context, ["id", "organizationId"]);
        const { resource: task } = await taskContainer.items.create(params);
        return SuccessResponse(task, "Task inserted successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in InsertTask");
    }
};