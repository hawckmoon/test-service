"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAPIController = void 0;
const tsoa_1 = require("tsoa");
const test_api_service_1 = require("../services/test_api_service");
//@Example<Response>({
//    intent: "clock",
//    confidence: 90
//  })
let testAPIController = 
//@Response<ObtainResponseErrorJSON>(422, "Obtain Response Failure", {
//    message: "Operation failed",
//    details: {
//        requestBody: {
//            message: "cannot get a suitable response from server",
//            value: "xxxx-1111",
//        },
//    },
//})
class testAPIController extends tsoa_1.Controller {
    getBestResponse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let testAPIService;
            
            testAPIService = new test_api_service_1.TestApiService();

            response = testAPIService.getBestResponse(message);
            
            this.setStatus(201); // set return status 201
            
            return response;
        });
    }
};
__decorate([
    (0, tsoa_1.Get)(""),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], testAPIController.prototype, "getBestResponse", null);
testAPIController = __decorate([
    (0, tsoa_1.Route)("best_response")
    //@Response<ObtainResponseErrorJSON>(422, "Obtain Response Failure", {
    //    message: "Operation failed",
    //    details: {
    //        requestBody: {
    //            message: "cannot get a suitable response from server",
    //            value: "xxxx-1111",
    //        },
    //    },
    //})
], testAPIController);

exports.testAPIController = testAPIController;
