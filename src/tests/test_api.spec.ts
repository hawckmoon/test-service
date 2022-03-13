import { expect } from 'chai';
import 'mocha';
import { agent as request } from 'supertest';

import App from '../index';

describe('Test API', () => {
    it("Message response from NLUA - 'hey jibo, what’s the time'", async () => {
        const message = encodeURIComponent("hey jibo, what’s the time");

        const res = await request(App).get('/best_response?message=' + message);
        expect(res.status).to.equal(200);
        expect(res.type).to.equal('application/json');

        const response = res.body;

        expect(response).not.to.be.a('undefined');
        expect(response.intent).to.be.a('string');
        expect(response.confidence).to.be.a('number');

        expect(response.confidence > 90).to.be.true;
    });

    it("Message response from NLUB - 'hey jibo, I'm hungry'", async () => {
        const message = encodeURIComponent("hey jibo, I'm hungry");

        const res = await request(App).get('/best_response?message=' + message);
        expect(res.status).to.equal(200);
        expect(res.type).to.equal('application/json');

        const response = res.body;

        expect(response).not.to.be.a('undefined');
        expect(response.intent).to.be.a('string');
        expect(response.confidence).to.be.a('number');

        expect(response.confidence > 90).to.be.true;
    });

    it("Not enough confidence - 'hey jibo, any news?'", async () => {
        const message = encodeURIComponent("hey jibo, any news?");

        const res = await request(App).get('/best_response?message=' + message);
        expect(res.status).to.equal(422);
        expect(res.type).to.equal('application/json');

        const response = res.body;

        expect(response.details.requestBody.message).to.equal('No confiable response found for client message!!');
    });

    it("Not answer found - 'hey jibo, you don't know this'", async () => {
        const message = encodeURIComponent("hey jibo, you don't know this");

        const res = await request(App).get('/best_response?message=' + message);
        expect(res.status).to.equal(422);
        expect(res.type).to.equal('application/json');

        const response = res.body;

        expect(response.details.requestBody.message).to.equal('No response found for client message!!');
    });
});