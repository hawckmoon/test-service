/**
 * The response object to the client.
 */
export interface NLUResponse {
   /**
   * A message utterance is mapped to an intent
   * @example "clock"
   */
    intent: string;
   /**
   * Confidence level for the intent (%)
   * @example "95"
   */
    confidence: number;
}