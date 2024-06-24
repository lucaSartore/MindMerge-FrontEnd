
import { ref } from 'vue'

export const loadingRequests = ref(0)

export function startLoadingRequest(){
    loadingRequests.value += 1
}

export function endLoadingRequest(){
    loadingRequests.value -= 1
}