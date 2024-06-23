// import { CustomResponse } from "../common_infrastructure/response";

/**
 * print error if a response failed
 * @param {CustomResponse<T>} response 
 * @returns {T}
 */
function expectSuccess(response) {
    let code = response.statusCode || response.status;
    if (code>= 200 && code < 300) {
        return response.payload;
    }
    alert(`We are Sorry!\n Something failed in our BackEnd\nerror: ${code}\n\n${response.message}`)
    console.error(response.message);
    return null;
}


export { expectSuccess };