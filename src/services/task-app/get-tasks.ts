import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { taskContainer } from "../../databases/task-app/task-app";
import { RequiredQueryParams } from "../../utils/required-params";
import { SuccessResponse, ErrorResponse } from "../../utils/response-handler";
import { FeedOptions } from "@azure/cosmos";
import { EncodeContinuationToken, DecodeContinuationToken } from "../../utils/token"
import { CreatePageInfo } from "../../utils/pagination"

export async function GetTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { organizationId } = RequiredQueryParams(request, context, ["organizationId"]);
        const status = request.query.get("status");
        const search = request.query.get("search");
        const filters = { organizationId, status, search };

        const sortBy = request.query.get("sortBy");
        const sortDirRaw = request.query.get("sortDir") || "asc";
        const sortDir = sortDirRaw.toLowerCase() === "desc" ? "DESC" : "ASC";
        const validSortKeys = ["id", "name", "status"];
        const sortColumn = validSortKeys.includes(sortBy || "") ? sortBy : null;

        const querySpec = BuildQuerySpec(filters, "select", sortColumn, sortDir);
        const countQuerySpec = BuildQuerySpec(filters, "count");
        const { resources: countResult } = await taskContainer.items.query(countQuerySpec).fetchAll();
        const totalItems = countResult[0] || 0;
        const currentPage = Math.max(1, parseInt(request.query.get("page") || "1"));
        const rawLimit = parseInt(request.query.get("limit") || "10");
        const limit = Math.max(1, Math.min(rawLimit, 50));
        const continuationToken = DecodeContinuationToken(request.query.get("continuationToken"));
        const options: FeedOptions = {
            maxItemCount: limit,
            continuationToken
        };
        const iterator = taskContainer.items.query(querySpec, options);
        const { resources: tasks, continuationToken: nextToken } = await iterator.fetchNext();
        const encodedToken = EncodeContinuationToken(nextToken);
        const pageInfo = CreatePageInfo(totalItems, limit, currentPage);
        return SuccessResponse({
            data: tasks,
            continuationToken: encodedToken || null,
            pageInfo
        }, "Tasks fetched successfully");
    } catch (error: any) {
        return ErrorResponse(context, error, "Error in GetTasks");
    }
}

interface FilterParams {
    organizationId: string;
    status?: string;
    search?: string;
}
type QueryType = "select" | "count";

function BuildQuerySpec(filters: FilterParams,
    queryType: QueryType = "select",
    sortBy?: string | null,
    sortDir: "ASC" | "DESC" = "ASC") {
    let baseQuery = queryType === "count"
        ? "SELECT VALUE COUNT(1) FROM c"
        : "SELECT * FROM c";

    const conditions: string[] = [];
    const parameters: { name: string; value: any }[] = [];

    conditions.push("c.organizationId = @organizationId");
    parameters.push({ name: "@organizationId", value: filters.organizationId });

    if (filters.status) {
        conditions.push("c.status = @status");
        parameters.push({ name: "@status", value: filters.status });
    }

    if (filters.search) {
        const searchableFields = ["name", "description"];
        const searchLower = filters.search.toLowerCase();
        const searchConds = searchableFields.map((field, idx) => {
            const paramName = `@search${idx}`;
            parameters.push({ name: paramName, value: searchLower });
            return `CONTAINS(LOWER(c.${field}), ${paramName})`;
        });
        conditions.push(`(${searchConds.join(" OR ")})`);
    }

    if (conditions.length > 0) {
        baseQuery += " WHERE " + conditions.join(" AND ");
    }

    if (queryType === "select" && sortBy) {
        baseQuery += ` ORDER BY c.${sortBy} ${sortDir}`;
    }

    return {
        query: baseQuery,
        parameters
    };
}