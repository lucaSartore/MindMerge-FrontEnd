import { reactive } from 'vue'
import { getUser , getOrganization} from '../util/back_end_calls'
import {loggedUser} from './loggedUser.js'

const organization = reactive({
    currentOrganization: undefined,
    currentOrganizationName: "",
    organizations: [],
})


export async function updateOrganization() {

    let user = await getUser(loggedUser.id,loggedUser.token)
    organization.organizations = user.organizations
    
    if(organization.organizations.length > 0){
        organization.currentOrganization = organization.organizations[0]
        let organization = await getOrganization(organization.currentOrganization)
        organization.currentOrganizationName = organization.organizationName
    }
}