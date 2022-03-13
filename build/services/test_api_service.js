"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestApiService = void 0;
class TestApiService {
    getBestResponse(message) {
        let response;
        if (!message) {
            //            return new ObtainResponseErrorJSON({ message: "sfd", value: "asdf" });
        }
        response = {
            intent: "clock",
            confidence: 90
        };
        return response;
    }
}
exports.TestApiService = TestApiService;
