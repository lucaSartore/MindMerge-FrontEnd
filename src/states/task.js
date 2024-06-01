import { ref } from 'vue'
import { getTask } from '../util/back_end_calls.js';
import { organization } from './organization.js';
export const selectedTask  = ref({  
});


/**
 * 
 * @param {Number} taskId
 */
export async function setSelectedTask(taskId) {

    if (taskId == undefined || organization.current == undefined) {
        selectedTask.value = undefined;
        return;
    }
   
    selectedTask.value = await getTask(taskId, organization.current);

}