
const HOST = import.meta.env.VITE_HOST || 'http://localhost:9000';
import { expectSuccess } from "./expect.js";

/**
 * Get the URL to redirect to for Google OAuth
 * @returns {string}
 */
export async function getGoogleRedirectUrl() {
    let response = await fetch(HOST + '/api/v1/account/google/oauth_info')
    response = await response.json()
    return expectSuccess(response).redirectUrl;
}

/**
 * 
 * @param {string} token 
 * @returns {{token: , userId: string}}
 */
export async function createGoogleUser(token){
    let response = await fetch(HOST + '/api/v1/account/google/create_user')
    response = await response.json()
    return expectSuccess(response).redirectUrl;
}