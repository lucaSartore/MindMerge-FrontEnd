import { ref } from 'vue'

export const selectedTask  = ref({  
});


/**
 * 
 * @param {Number} taskId
 */
export async function setSelectedTask(taskId) {
    
    selectedTask.value = {
        taskId: taskId
    }
}