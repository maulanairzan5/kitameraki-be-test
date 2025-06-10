import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { formSettingContainer } from "../../databases/task-app/task-app";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

export async function UpdateTaskSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const formSettings = await request.json() as any[];
        for (const formSetting of formSettings) {
            if (formSetting?.organizationId === undefined) {
                continue;
            }
            await formSettingContainer.items.upsert(formSetting);
        }
        return SuccessResponse(formSettings, "Task Setting updated successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in UpdateTaskSetting");
    }
};
