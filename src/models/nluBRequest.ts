import { NluBModels } from "./nluModels";

export interface NluBRequest {
    utterance: string,
    model: NluBModels
}