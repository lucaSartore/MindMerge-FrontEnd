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


export async function updateOrganization(currentOrganizationIndex) {

    if(loggedUser.id == undefined){
        return
    }
    let user = await getUser(loggedUser.id,loggedUser.token)

    let organizations = user.organizations.map(
        async function(organizationId){
            return {
                id: organizationId,
                name: await getOrganizationName(organizationId),
                initialized: true
            }
        }
    )

    organization.organizations = await Promise.all(organizations)
    if(organization.organizations.length > 0){
        if (currentOrganizationIndex != undefined && currentOrganizationIndex < organization.organizations.length){
            organization.current = organization.organizations[currentOrganizationIndex].id
        }else{
            organization.current = organization.organizations[organization.organizations.length-1].id
        }
    }
}

if (organization.initialized == false){
    updateOrganization()
}