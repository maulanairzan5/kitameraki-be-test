import { HttpRequest, InvocationContext } from "@azure/functions";
import { ErrorResponse } from "../utils/ResponseHandler";


export function RequiredQueryParams(
    request: HttpRequest,
    context: InvocationContext,
    params: string[]
): Record<string, string> {
    const missing = params.filter(p => !request.query.get(p));
    if (missing.length > 0) {
        const error = new Error(`Missing required query parameter(s): ${missing.join(", ")}`);
        (error as any).status = 400;
        throw error;
    }
    return Object.fromEntries(params.map(p => [p, request.query.get(p)!]));
}


export async function RequiredBodyParams(
    request: HttpRequest,
    context: InvocationContext,
    requiredFields?: string[]
): Promise<Record<string, any>> {
    let body: Record<string, any>;

    try {
        body = await request.json();
    } catch {
        const error = new Error("Invalid or missing JSON body");
        (error as any).status = 400;
        throw error;
    }

    if (!requiredFields) return body;

    const missing = requiredFields.filter(field => body[field] === undefined || body[field] === null);
    if (missing.length > 0) {
        const error = new Error(`Missing required body field(s): ${missing.join(", ")}`);
        (error as any).status = 400;
        throw error;
    }

    return body;
}
