import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { statusContainer } from "../../databases/task-app/task-app";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

export async function GetTaskStatuses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const query = {
            query: "SELECT * FROM c"
        };
        const { resources: statuses } = await statusContainer.items.query(query).fetchAll();
        return SuccessResponse(statuses, "Task Status fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetTaskStatus");
    }
}