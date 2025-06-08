import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { formSettingContainer } from "../../databases/task-app/task-app";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";

export async function GetFormSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const query = {
            query: "SELECT * FROM c"
        };
        const { resources: formSetting } = await formSettingContainer.items.query(query).fetchAll();
        return SuccessResponse(formSetting[0], "Form Setting fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetFormSetting");
    }
}