import { reactive } from 'vue'
import { getUser , getOrganizationName} from '../util/back_end_calls'
import {loggedUser} from './loggedUser.js'

export const organization = reactive({
    /**
     * @type {number | undefined}
     */
    current: undefined,
    /**
     * @type {{id: number, name: string}[]}
     */
    organizations: [],
    /**
     * @type {bool}
     */ 
    initialized: false
})


export async function updateOrganization(currentOrganizationId) {


    if(loggedUser.id == undefined){
        return
    }
    let user = await getUser(loggedUser.id,loggedUser.token)

    let organizations = user.organizations.map(
        async function(organizationId){
            return {
                id: organizationId,
                name: await getOrganizationName(organizationId),
            }
        }
    )

    organization.organizations = await Promise.all(organizations)

    let currentOrganizationIndex = undefined;
    if (currentOrganizationId != undefined){
        currentOrganizationIndex = organization.organizations.findIndex(organization => organization.id == currentOrganizationId)
    }else if (organization.organizations.length > 0){
        currentOrganizationIndex = organization.organizations.length - 1
    }
    if (currentOrganizationIndex == undefined){
        organization.current = undefined
        organization.initialized = false
    }else{
        organization.current = organization.organizations[currentOrganizationIndex].id
        organization.initialized = true
    }
}

if (organization.initialized == false){
    updateOrganization()
}