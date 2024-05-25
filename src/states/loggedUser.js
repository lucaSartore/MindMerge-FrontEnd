// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { reactive } from 'vue'
import {expectSuccess} from '../util/expect.js'
const loggedUser = reactive({
    token: undefined,
    id: undefined,
})

function isUserLoggedIn () {
    return loggedUser.id != undefined;
}

function setLoggedUser (data) {
    let user = expectSuccess(data);
    loggedUser.token = user.userToken;
    loggedUser.id = user.userId;
}

function clearLoggedUser () {
    loggedUser.token = undefined;
    loggedUser.id = undefined;
}

export { loggedUser, isUserLoggedIn, setLoggedUser, clearLoggedUser } 