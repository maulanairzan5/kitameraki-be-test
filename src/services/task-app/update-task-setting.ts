import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { formSettingContainer } from "../../databases/task-app/task-app";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";
import { RequiredBodyParams } from "../../utils/required-params";

export async function UpdateTaskSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { organizationId, data } = await RequiredBodyParams(request, ["organizationId"]) as any;

        const query = `SELECT c.id FROM c WHERE c.organizationId = @organizationId`;
        const { resources: existingFormSetting } = await formSettingContainer.items
            .query({
                query,
                parameters: [{ name: "@organizationId", value: organizationId }]
            })
            .fetchAll();

        const existingIds = new Set(existingFormSetting.map((t: any) => t.id));
        const newIds = new Set(data.map(t => t.id));

        const idsToDelete = [...existingIds].filter(id => !newIds.has(id));
        await Promise.all(idsToDelete.map(id =>
            formSettingContainer.item(id, organizationId).delete()
        ));

        for (const formSetting of data) {
            if (formSetting?.organizationId === undefined) {
                continue;
            }
            await formSettingContainer.items.upsert(formSetting);
        }
        return SuccessResponse(data, "Task Setting updated successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in UpdateTaskSetting");
    }
};
