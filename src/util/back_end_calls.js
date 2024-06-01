
const HOST = import.meta.env.VITE_HOST || 'http://localhost:9000';
import { expectSuccess } from "./expect.js";
import  organizationModule  from "../common_infrastructure_es6/organization.js" 
import Task from '../common_infrastructure_es6/task.js'
import TaskStatus from '../common_infrastructure_es6/task_status.js'
const Organization = organizationModule.Organization

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

/**
 * @param {number} userId
 * @param {string} userToken
 * @returns {User}
 */ 
export async function getUser(userId, userToken) {
    let response = await fetch(HOST + '/api/v1/user/' + userId, {
        headers: {
            userToken: userToken
        }
    });
    response = await response.json();
    return expectSuccess(response);
}

export async function getUserIdByName(userName){
    let response = await fetch(HOST + '/api/v1/user/id?name=' + userName)
    return await response.json();
}

/**
 * 
 * @param {number} organizationId 
 * @returns {Organization}
 */
export async function getOrganization(organizationId){
    let response = await fetch(HOST + '/api/v1/organization/' + organizationId)
    response = await response.json();
    return expectSuccess(response);
}

/**
 * 
 * @param {number} organizationId 
 * @returns {{id: number, name: string}[]}
 */
export async function getOrganizationUsers(organizationId){
    let response = await fetch(HOST + '/api/v1/organization/' + organizationId + '/users')
    response = await response.json();
    return expectSuccess(response);
}

export async function getOrganizationName(organizationId){
    let response = await fetch(HOST + '/api/v1/organization/' + organizationId + '/name')
    response = await response.json();
    return expectSuccess(response);
}

export async function addUserToOrganization(organizationId, userToAddId){
    let response = await fetch(HOST + '/api/v1/organization/' + organizationId + '/user/' + userToAddId,
        {
            method: 'POST',
        }
    )
    response = await response.json();
    return expectSuccess(response);
}

export async function deleteUserFromOrganization(organizationId, userToDeleteId){
    let response = await fetch(HOST + '/api/v1/organization/' + organizationId + '/user/' + userToDeleteId,
        {
            method: 'DELETE',
        }
    )
    response = await response.json();
    return expectSuccess(response);
}

export async function createOrganization(organizationName, ownerId){
    
    let organization = new Organization(0, organizationName, [ownerId], false, new Date(), ownerId);
    organization = JSON.stringify(organization);

    let response = await fetch(HOST + '/api/v1/organization/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: organization,
        }
    )
    response = await response.json();
    return expectSuccess(response);
}


export async function getTask(taskId, organizationId){
    let response = await fetch(HOST + '/api/v1/task/' + taskId + '?organization_id=' + organizationId)
    response = await response.json();
    return expectSuccess(response);
}

export async function getTaskTree(organizationId, userId){
    let response = await fetch(HOST + "/api/v1/task/task_tree?user_id=" + userId + "&organization_id=" + organizationId)
        
    response = await response.json();
    return expectSuccess(response);
}

export async function updateTaskName(organization_id, task_id){

}


export async function createTask(organizationId, taskName, assignee, manager, taskFatherId){
     
    let task = new Task.Task(
        1,
        taskFatherId,
        organizationId,
        new Date(),
        taskName,
        " ",
        TaskStatus.TaskStatus.Idea,
        [],
        assignee,
        manager,
        [],
        false,
        [],
        3
    )

     let response = await fetch(HOST + '/api/v1/task/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task),
        }
    )
    response = await response.json();
    return expectSuccess(response);
}