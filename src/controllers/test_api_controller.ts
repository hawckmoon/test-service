import {
    Body,
    Controller,
    Get,
    Path,
    Query,
    Route,
    Response,
    SuccessResponse,
} from "tsoa";

import { NLUResponse } from "../models/response";
import { ObtainResponseErrorJSON } from "../models/obtainResponseErrorJSON";
import { TestApiService } from "../services/test_api_service";

//@Example<NLUResponse>({
//    intent: "clock",
//    confidence: 90
//  })

@Route("best_response")
@Response('200', 'Succesfull request')
@Response('400', 'Bad request')
@Response<ObtainResponseErrorJSON>(422, "Obtain NLUResponse Failure", {
    name:"Obtain Response Error",
    message: "Operation failed",
    details: {
        requestBody: {
            message: "cannot get a suitable response from server",
            value: "message_text",
        },
    },
})
export class testAPIController extends Controller {
   /**
   * Returns the best suitable answer to a client message. The answer will be obtained
   * asking to the different NLU servers.
   * @param message The client message that needs a server answer.
   */
    @Get("")
    public async getBestResponse(
        @Query() message: string
    ): Promise<NLUResponse> {
        let response: NLUResponse;
        let testAPIService: TestApiService;
        
//        console.log("INCOMING MESSAGE:'", message + "'");

        testAPIService = new TestApiService();

        this.setStatus(200); // set return status 200

        return testAPIService.getBestResponse(message);
    }
}