import { ref } from 'vue'
import { getTask, getUser } from '../util/back_end_calls.js';
import { organization } from './organization.js';
export const selectedTask  = ref({});
export const selectedAssignees = ref([]);
export const selectedManager = ref({});

export async function updateAssignees(){
    if (selectedTask.value == undefined || selectedTask.value.taskAssignees == undefined){
        assignees.value = [];
        return;
    }
  let newAssignees = selectedTask.value.taskAssignees.map( async (assignee) => {
    let name = (await getUser(assignee)).userName;
    return {id: assignee, name: name}
  });
  newAssignees = await Promise.all(newAssignees);
  selectedAssignees.value = newAssignees;
}

/**
 * 
 * @param {Number} taskId
 */
export async function setSelectedTask(taskId) {
    if (taskId == undefined || organization.current == undefined) {
        selectedTask.value = {};
        return;
    }
    selectedTask.value = await getTask(taskId, organization.current);
    await updateAssignees();
}