import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../databases/CosmosDatabase";
import { RequiredQueryParams, RequiredBodyParams } from "../utils/RequiredParams";
import { SuccessResponse, ErrorResponse } from "../utils/ResponseHandler";

export async function BulkDeleteTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const ids = await RequiredBodyParams(request, context, ["id"]) as { id: any[] };
        const params = RequiredQueryParams(request, context, ["organizationId"]);
        let countSuccessDeletedItem = 0;
        let countFailedDeletedItem = 0;
        let deletedItem = [];
        await Promise.all(
            ids.id.map(async (id) => {
                try {
                    await container.item(id, params.organizationId).delete();
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

app.http('BulkDeleteTasks', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: BulkDeleteTasks
});
