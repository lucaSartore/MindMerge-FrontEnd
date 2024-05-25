import { reactive } from 'vue'
import { getUser , getOrganization} from '../util/back_end_calls'
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

    let user = await getUser(loggedUser.id,loggedUser.token)

    let organizations = user.organizations.map(
        async function(organizationId){
            return {
                id: await getOrganization(organizationId),
                name: organization.organizationName
            }
        }
    )

    organization.organizations = await Promise.all(organizations)
}
await updateOrganization()