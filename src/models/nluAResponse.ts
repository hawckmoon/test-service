export interface NluAResponse {
    intents: string[],
    entities: string[],
    confidence: number
}