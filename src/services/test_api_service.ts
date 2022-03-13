import { NluBModels } from "../models/nluModels";
import { NluARequest } from "../models/nluARequest";
import { NluBRequest } from "../models/nluBRequest";
import { NluAResponse } from "../models/nluAResponse";
import { NluBResponse } from "../models/nluBResponse";
import { NLUResponse } from "../models/response";
import { ObtainResponseErrorJSON } from "../models/obtainResponseErrorJSON";
import HttpRequestMock from 'http-request-mock';
import axios from 'axios';

const responseMinimumTime:number=1000; // NLUResponse minimum time (ms)

export class TestApiService {
    public async getBestResponse(message: string): Promise<NLUResponse> {
        let response: NLUResponse;
        let requestNLUA: NluARequest;
        let requestNLUB: NluBRequest;
        let promise;
        let promiseResolve:any, promiseReject:any;
        let done: boolean = false, found:boolean=false;
        let self = this;

//        response = {
//            intent: "clock",
//            confidence: 90
//        };

        const mocker = HttpRequestMock.setup();

        // Mock nlu A server behaviour
        mocker.mock({
            url: 'www.nlu_a.com/api/answer',
            response(requestInfo: any) {
                return self.processNLUAServerResponse(requestInfo);
            },
            delay: 300,
            status: 200,
            header: {
                'content-type': 'application/json',
            }
        });

        // Mock nlu B server behaviour
        mocker.mock({
            url: 'www.nlu_b.com/api/answer',
            response(requestInfo: any) {
                return self.processNLUBServerResponse(requestInfo);
            },
            delay: 250,
            status: 200,
            header: {
                'content-type': 'application/json',
            }
        });

        promise = new Promise<NLUResponse>(function(resolve, reject){
            promiseResolve = resolve;
            promiseReject = reject;
       });

        // CALL SERVERS AND GET OPTIMAL RESPONSE
        // Prepare NLU A server request
        requestNLUA = {
            text: message,
            model: NluBModels.modelA
        };

        // Request to the NLU_A server
        axios.post('www.nlu_a.com/api/answer', requestNLUA, { responseType: 'json' }).then(res => {
            let data;
            // NLU returns an array
//            console.log(done,res.data);
            
            data=res.data;
            if(Array.isArray(res.data)){
                data=res.data[0];
            } 

            if(!data){
//                console.log("NLU A no response");
                return;
            }   

            // A response has been found
            found=true;

//           console.log(done,res.data.confidence<=90);
            if (done || data.confidence<=90) {
//                console.log("NLU A response discarded");
                return;
            }

            done = true;
//            console.log('NLUResponse A:', data);

           promiseResolve({intent:data.intents[0], confidence:data.confidence}); 
        });

        // Prepare NLU_server request
        requestNLUB = {
            utterance: message,
            model: NluBModels.modelA
        };

        // Request to the NLU_B server
        axios.post('www.nlu_b.com/api/answer', requestNLUB, { responseType: 'json' }).then(res => {
            let data;
            // NLU returns an array
//            console.log(done,res.data);
            
            data=res.data;
            if(Array.isArray(res.data)){
                data=res.data[0];
            }

            if(!data){
//                console.log("NLU B no response");
                return;
            }   

            // A response has been found
            found=true;

            if (done || data.confidence<=90) {
//                console.log("NLU B response discarded");
                return;
            }
            
            done = true;
//            console.log('NLUResponse B:', data);

            promiseResolve({intent:data.intent, confidence:data.confidence});
        });

        // If no response is received in responseMinimumTime
        setTimeout(()=> {
            let messageText:string;
            let error: ObtainResponseErrorJSON;

            if (done) {
                return;
            }

            messageText="No confiable response found for client message!!";
            if(!found){
                messageText="No response found for client message!!";
            }

            error=new ObtainResponseErrorJSON(
               "Operation failed",
                {
                   requestBody: {
                       message: messageText,
                       value: message,
                   },
                }
            );

            done=true;
//            promiseReject("No response found for" + message + "message!!");
            promiseReject(error);
        },responseMinimumTime);

        return promise;
    }

    processNLUAServerResponse(requestInfo: any): any {
        let intents: string[] = [];
        let entity: string = "NLU_A";
        let confidence: number = 0;
        let data = JSON.parse(requestInfo.body);
        let nluAResponse: NluAResponse;

        //console.log('info:', requestInfo);
        //        console.log('Data:', data);

        // If message contains the word time
        if (data.text.indexOf("time") >= 0) {
            intents.push("clock");
            confidence = 95;
        };

        if (data.text.indexOf("eat") >= 0) {
            intents.push("food");
            confidence = 81;
        };

        nluAResponse = {
            intents: intents,
            entities: [entity],
            confidence: confidence
        };

        if(intents.length===0){
            return;
        }

        return nluAResponse;
    }

    processNLUBServerResponse(requestInfo: any): any {
        let intents: string[] = [];
        let entity: string = "NLU_B";
        let confidence: number = 0;
        let data = JSON.parse(requestInfo.body);
        let nluBResponse: NluBResponse;
        let nluBResponses: NluBResponse[] = [];

        //console.log('info:', requestInfo);
        //        console.log('Data:', data);

        // If message contains the word time
        if (data.utterance.indexOf("time") >= 0) {
            nluBResponse = {
                intent: "clock",
                entity: entity,
                confidence: 81
            };

            nluBResponses.push(nluBResponse);
        };
        if (data.utterance.indexOf("hungry") >= 0) {
            nluBResponse = {
                intent: "food",
                entity: entity,
                confidence: 93
            };
            nluBResponses.push(nluBResponse);
        };
        if (data.utterance.indexOf("news") >= 0) {
            nluBResponse = {
                intent: "newspaper",
                entity: entity,
                confidence: 62
            };
            nluBResponses.push(nluBResponse);
        };

        return nluBResponses;
    }
}