export class ObtainResponseErrorJSON extends Error {
    details: any;

    constructor(m: string, details: any) {
        super(m);

        this.name = 'Obtain Response Error';
        this.details = details;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ObtainResponseErrorJSON.prototype);
    }
}