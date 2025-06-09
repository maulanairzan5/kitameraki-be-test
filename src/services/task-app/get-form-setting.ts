import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { formSettingContainer } from "../../databases/task-app/task-app";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";
import { FeedOptions } from "@azure/cosmos";
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
        const options: FeedOptions = {
            maxItemCount: 1,
        };
        const iterator = formSettingContainer.items.query(querySpec, options);
        const { resources: formSettings } = await iterator.fetchNext();
        return SuccessResponse(formSettings[0], "Form Setting fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetFormSetting");
    }
}
