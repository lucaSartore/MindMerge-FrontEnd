// import { CustomResponse } from "../common_infrastructure/response";

/**
 * print error if a response failed
 * @param {CustomResponse<T>} response 
 * @returns {T}
 */
function expectSuccess(response) {
    if (response.statusCode !== 200) {
        console.error(response.message);
    }
    return response.payload;
}


export { expectSuccess };