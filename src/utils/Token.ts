import { Buffer } from "buffer";

export function EncodeContinuationToken(token: any): string | null {
    if (!token) return null;
    try {
        return Buffer.from(JSON.stringify(token)).toString("base64");
    } catch (error) {
        console.error("Failed to encode continuation token", error);
        return null;
    }
}

export function DecodeContinuationToken(encodedToken: string | undefined | null): any | undefined {
    if (!encodedToken) return undefined;
    try {
        const decoded = Buffer.from(encodedToken, "base64").toString("utf8");
        return JSON.parse(decoded);
    } catch (error) {
        console.error("Failed to decode continuation token", error);
        return undefined;
    }
}