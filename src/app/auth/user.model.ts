export class User {
    constructor(
        public id:number,
        public email: string,
        private _token: string,
        private _tokenExpirationDate: Date | string
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token; 
    }
}
