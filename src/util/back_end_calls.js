const HOST = import.meta.env.VITE_HOST || 'http://localhost:9000';
import { expectSuccess } from "./expect.js";
import  organizationModule  from "../common_infrastructure_es6/organization.js" 
import Task from '../common_infrastructure_es6/task.js'
import TaskStatus from '../common_infrastructure_es6/task_status.js'
import TaskNote from '../common_infrastructure_es6/task_note.js'
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

export async function updateTaskName(organizationId, taskId, newName){
   let response = await fetch(HOST + '/api/v1/task/'+taskId+'/name/'+newName + "?organization_id=" + organizationId, {
    method: "PUT"
   });
   response = await response.json();
   return expectSuccess(response);
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

export async function deleteTask(organizationId, taskId){
    let response = await fetch(HOST + "/api/v1/task/"+taskId+"?organization_id="+organizationId,{
        method: "DELETE"
    });
    response = await response.json();
    return expectSuccess(response);
}

export async function deleteTaskNotes(organizationId, taskId, noteId){
    let response = await fetch(HOST + "/api/v1/task/"+taskId+"/notes/"+noteId+"?organization_id="+organizationId,{
        method: "DELETE"
    });
    return await response.json();
}

export async function getTaskAutomaticReport(organizationId, taskId, userId){
    let response = await fetch(HOST + "/api/v1/report/automatic/?organization_id="+organizationId+"&user_id="+userId+"&task_id="+taskId);
    response = await response.json();
    return expectSuccess(response);
}    

export async function addAssigneeToTask(organizationId, taskId, assigneeId){
    let response = await fetch(HOST + "/api/v1/task/"+taskId+"/assignee/"+assigneeId+"?organization_id="+organizationId,{
        method: "POST"
    });
    return await response.json();
}

export async function removeAssigneeFromTask(organizationId, taskId, assigneeId){
    let response = await fetch(HOST + "/api/v1/task/"+taskId+"/assignee/"+assigneeId+"?organization_id="+organizationId,{
        method: "DELETE"
    });
    response = await response.json();
    return expectSuccess(response);
}

export async function createNote(organizationId, taskId){
    let tasknote = new TaskNote.TaskNote(
        1,
        taskId,
        "",
        new Date()
    )
    let response = await fetch(HOST + '/api/v1/task/'+taskId+'/notes'+"?organization_id="+organizationId,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tasknote),
        }
    )
    response = await response.json();
    return expectSuccess(response);
}

export async function updateTaskNotes(organizationId, taskId, notesId, newNotes){
    let response = await fetch(HOST + '/api/v1/task/'+taskId+'/notes/'+notesId + "?organization_id=" + organizationId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({notes: newNotes})
    });

    response = await response.json();
    return expectSuccess(response);

}

export async function updateTaskStatus(organizationId, taskId, newStatus){
    let response = await fetch(HOST + '/api/v1/task/'+taskId+'/status/'+newStatus + "?organization_id=" + organizationId, {
        method: "PUT"
    });
    response = await response.json();
    return expectSuccess(response);
}