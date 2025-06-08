import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { taskContainer } from "../../databases/task-app/task-app";
import { RequiredBodyParams } from "../../utils/required-params";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";
import { v4 as uuidv4 } from "uuid";

export async function InsertTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const params = await RequiredBodyParams(request, ["organizationId"]);
        params.id = uuidv4();
        console.log(params);
        const { resource: task } = await taskContainer.items.create(params);
        return SuccessResponse(task, "Task inserted successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in InsertTask");
    }
};