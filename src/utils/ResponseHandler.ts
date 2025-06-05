import { HttpResponseInit, InvocationContext } from "@azure/functions";


export function SuccessResponse(
    data: any,
    message = "Success",
    status = 200
): HttpResponseInit {
    return {
        status,
        jsonBody: {
            responseCode: status,
            message,
            data,
            error: null,
            timestamp: new Date().toISOString(),
        },
    };
}

export function ErrorResponse(
    context: InvocationContext,
    error: any,
    logPrefix: string = "Error"
): HttpResponseInit {
    const status = error?.status || 500;
    let message = "Internal server error";

    if (error?.message) {
        try {
            const match = error.message.match(/"Errors":\s*\[(.*?)\]/);
            if (match && match[1]) {
                const parsed = JSON.parse(`[${match[1]}]`);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    message = parsed[0];
                } else {
                    message = error.message;
                }
            } else {
                message = error.message;
            }
        } catch (parseError) {
            message = error.message;
        }
    }

    context.error(`${logPrefix}:`, message);
    context.error(`${logPrefix}:`, error);

    return {
        status,
        jsonBody: {
            responseCode: status,
            message,
            data: null,
            error: message,
            timestamp: new Date().toISOString(),
        },
    };
}
