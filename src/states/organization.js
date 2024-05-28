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
})


export async function updateOrganization() {

    if(loggedUser.id == undefined){
        return
    }
    let user = await getUser(loggedUser.id,loggedUser.token)

    let organizations = user.organizations.map(
        async function(organizationId){
            return {
                id: organizationId,
                name: await getOrganizationName(organizationId)
            }
        }
    )

    organization.organizations = await Promise.all(organizations)
    if(organization.organizations.length > 0){
        organization.current = organization.organizations[organization.organizations.length-1].id
    }
}
// await updateOrganization()