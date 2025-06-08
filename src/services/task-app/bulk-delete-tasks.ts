import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { taskContainer } from "../../databases/task-app/task-app";
import { RequiredQueryParams, RequiredBodyParams } from "../../utils/required-params";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

export async function BulkDeleteTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const ids = await RequiredBodyParams(request, ["id"]) as { id: any[] };
        const params = RequiredQueryParams(request, ["organizationId"]);
        let countSuccessDeletedItem = 0;
        let countFailedDeletedItem = 0;
        let deletedItem = [];
        await Promise.all(
            ids.id.map(async (id) => {
                try {
                    await taskContainer.item(id, params.organizationId).delete();
                    countSuccessDeletedItem++;
                    deletedItem.push(id);
                } catch (err: any) {
                    countFailedDeletedItem++;
                    if (err.code === 404) {
                        context.log(`Item with id ${id} not found, skipping delete.`);
                    } else {
                        throw err;
                    }
                }
            })
        );
        const bodyJson = {
            countDeletedItem: {
                success: countSuccessDeletedItem,
                failed: countFailedDeletedItem
            },
            deletedItem
        }
        return SuccessResponse(bodyJson, "Tasks deleted successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in BulkDeleteTask");
    }
};