import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { formSettingContainer } from "../../databases/task-app/task-app";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";
import { RequiredQueryParams } from "../../utils/required-params";

export async function GetFormSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { organizationId } = RequiredQueryParams(request, ["organizationId"]);
        const querySpec = {
            query: "SELECT * FROM c where c.organizationId = @organizationId",
            parameters: [
                { name: "@organizationId", value: organizationId }
            ]
        };
        const { resources: formSettings } = await formSettingContainer.items.query(querySpec).fetchAll();
        return SuccessResponse(formSettings, "Form Setting fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetFormSetting");
    }
}
