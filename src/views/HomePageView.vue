<script setup>
import TreeMenu from '../components/TreeMenu.vue';
import { ref } from 'vue';
import { organization } from '../states/organization.js'
import { getTaskTree, createTask, updateTaskName, createNote, updateTaskNotes, deleteTaskNotes, removeAssigneeFromTask, addAssigneeToTask, getUserIdByName, deleteTask, updateTaskStatus, getTaskAutomaticReport } from '../util/back_end_calls.js'
import { loggedUser } from '../states/loggedUser.js'
import { setSelectedTask, selectedAssignees, updateAssignees } from '../states/task.js';
import { selectedTask } from '../states/task.js';
import UpdateButton from '../components/UpdateButton.vue';
import TaskStatus from '../common_infrastructure_es6/task_status.js';

var treeData = ref([{}]);
var selectedNote = ref(null);   //This variable is used to keep track of the selected note in the dropdown

async function updateTaskTree() {
  if (organization.current == undefined) {
    return
  }
  let value = await getTaskTree(organization.current, loggedUser.id)
  if (value == null) {
    return
  }

  let currentTaskId = selectedTask.value?.taskId ?? undefined;

  let currentTaskIdInInTree = JSON.stringify(value).replace(" ", "").includes('"taskId":' + currentTaskId)

  if (value.length > 0) {
    if (currentTaskIdInInTree) {
      setSelectedTask(currentTaskId)
    } else {
      setSelectedTask(value[0].taskId)
    }
  } else {
    setSelectedTask(undefined);
  }
  treeData.value = value
}


async function updateTaskNameWrapper(newName) {
  await updateTaskName(organization.current, selectedTask.value.taskId, newName)
}

async function updateTaskNotesWrapper(newNotes) {
  await updateTaskNotes(organization.current, selectedTask.value.taskId, selectedNote.value, newNotes)
}

async function changeStatusWrapper() {
  await updateTaskStatus(organization.current, selectedTask.value.taskId, selectedTask.value.taskStatus);
  await updateTaskTree();
}

async function createChildTask(taskName, taskFatherId) {
  let organizationId = organization.current;
  let manager = loggedUser.id;
  let assignees = [manager];
  await createTask(organizationId, taskName, assignees, manager, taskFatherId)
  await updateTaskTree();
}

async function deleteTaskWrapper() {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  await deleteTask(organizationId, taskId);
  await updateTaskTree();
}

async function deleteNote() {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  let noteId = selectedNote.value;
  await deleteTaskNotes(organizationId, taskId, noteId);
  await updateTaskTree();
  selectedNote.value = null;
}

async function createNewNote() {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  await createNote(organizationId, taskId);
  await updateTaskTree();
};

//debugging function to get the current task
function getCurrentTask() {
  console.log(selectedTask.value);
}

async function getAutomaticReport() {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  let userId = loggedUser.id;
  await getTaskAutomaticReport(organizationId, taskId, userId, automaticReportQuestion.value);
  closeAutomaticReportPopup();
  alert("You will recieve an email soon");
}

async function removeAssigneeFromTaskWrapper(userId) {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  await removeAssigneeFromTask(organizationId, taskId, userId)
  await setSelectedTask(selectedTask.value.taskId);
}


const showAddAssigneePopup = ref(false);
const showAutomaticReportPopup = ref(false);
const errorMessage = ref('');
const userName = ref('');
const automaticReportQuestion = ref('');

async function addAssigneeToTaskWrapper(userName) {
  let v = await getUserIdByName(userName)
  if (v.statusCode === 404) {
    errorMessage.value = "User not found";
    return false
  }
  v = await addAssigneeToTask(organization.current, selectedTask.value.taskId, v.payload)
  if (v.statusCode === 404) {
    errorMessage.value = "User not found in organization";
    return false
  }
  return true
}

async function handleAddAssignee() {
  const result = await addAssigneeToTaskWrapper(userName.value);
  if (result) {
    closeAddAssigneePopup();
    setSelectedTask(selectedTask.value.taskId);
  }
}

function closeAddAssigneePopup() {
  showAddAssigneePopup.value = false;
  userName.value = '';
  errorMessage.value = '';
}

function closeAutomaticReportPopup() {
  showAutomaticReportPopup.value = false;
  automaticReportQuestion.value = '';
}

updateTaskTree()

</script>

<template>
  <main class="main-container">
    <h1>Home Page</h1>
    <br>

    <div v-if="organization.current == undefined"> You need to select/create an organization from the page
      "organization" before you can see the details in this page</div>

    <div v-if="organization.current != undefined" class="content-wrapper">
      <div class="side-bar">
        <button v-if="selectedTask.taskName != undefined"
          @click="createChildTask('New Child Task', selectedTask.taskId)">Add child task </button>
        <button @click="createChildTask('New Root Task', null)">Add root task </button>
        <button v-if="selectedTask.taskName != undefined" @click="deleteTaskWrapper">Delete selected task</button>
        <ul v-for="tree in treeData">
          <TreeMenu class="item" :model="tree"></TreeMenu>
        </ul>
      </div>
      <div class="main-content">

        <br>

        <div v-if="selectedTask.taskName != undefined">
          <h1> Current task: {{ selectedTask.taskName }}
            <UpdateButton :text="selectedTask.taskName" :updateFunction="updateTaskNameWrapper"
              :argsForUpdateFunction="null" :callbackAfterUpdate="updateTaskTree">
            </UpdateButton>
          </h1>
          <br>
          <div class="task-status-container">
            <h3> Task Status:
              <select id="statusSelector" v-model="selectedTask.taskStatus" style="width: 200px;"
                @change="changeStatusWrapper()">
                <option v-for="status in 6" :key="status" :value="status">
                  {{ Object.keys(TaskStatus.TaskStatus)[status] }}
                </option>
              </select>
            </h3>
            <button @click="showAutomaticReportPopup = true">Get automatic Report</button>
          </div>
          <br>
          <div class="manage-task-notes">
            <h2>Task notes
              <button @click="createNewNote()">create New Note</button>
              <button @click="deleteNote()">delete selected Note</button>
              <h3> Select note:
                <select id="noteSelector" v-model="selectedNote" style="width: 200px;">
                  <option v-for="note in selectedTask.taskNotes" :key="note.noteId" :value="note.noteId">
                    {{ note.noteId }}
                  </option>
                </select>
              </h3>
            </h2>
            <br>
            <div v-if="selectedTask.taskNotes[selectedNote - 1] != undefined">
              <div v-if="selectedTask.taskNotes[selectedNote - 1] != undefined">
                <div class="task-note-container">
                  <p class="task-notes-label">Note {{ selectedNote }}
                    <UpdateButton :text="selectedTask.taskNotes[selectedNote - 1].notes"
                      :updateFunction="updateTaskNotesWrapper" :argsForUpdateFunction="null"
                      :callbackAfterUpdate="updateTaskTree">
                    </UpdateButton>
                  </p>
                  <p class="task-notes-text">{{ selectedTask.taskNotes[selectedNote - 1].notes }}</p>

                  <p class="last-updated">Last updated: {{ selectedTask.taskNotes[selectedNote - 1].date }}</p>
                </div>
              </div>
            </div>

            <div class="manage-task-assignees">

              <div v-if="showAddAssigneePopup" class="popup">
                <div class="popup-content">
                  <h2>Add User</h2>
                  <label for="user-name">User Name:</label>
                  <input id="user-name" v-model="userName" type="text" />
                  <button @click="handleAddAssignee">OK</button>
                  <button @click="closeAddAssigneePopup">Cancel</button>
                  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                </div>
              </div>

              <div v-if="showAutomaticReportPopup" class="popup">
                <div class="popup-content">
                  <h2>Automatic Report</h2>
                  <label for="question">Question about the task</label>
                  <input id="question" v-model="automaticReportQuestion" type="text" />
                  <button @click="getAutomaticReport">OK</button>
                  <button @click="closeAutomaticReportPopup">Cancel</button>
                </div>
              </div>


              <h2>Assignees <button @click="showAddAssigneePopup = true">Add assignee </button></h2>
              <ul class="assignee-list-container">
                <li class="assignee-list" v-for="assignee in selectedAssignees">
                  {{ assignee.name }}
                  <button @click="removeAssigneeFromTaskWrapper(assignee.id)">Remove</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
}

.side-bar {
  border-right: 1px solid #ddd;
  width: 25%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  color: #333;
  text-align: center;
}

button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

input,
select {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  margin: 10px 0;
}

.assignee-list-container {
  list-style-type: none;
  padding: 0;
}

.assignee-list {
  background-color: #f9f9f9;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assignee-list button {
  background-color: #dc3545;
  font-size: 14px;
}

.assignee-list button:hover {
  background-color: #c82333;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 300px;
}

.error {
  color: red;
  margin-top: 10px;
}

.task-note-container {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
  text-align: left;
}

.task-notes-label {
  font-weight: bold;
  font-size: larger;
  margin: 0;
}

.task-notes-text {
  font-weight: normal;
  font-size: smaller;
  margin: 0;
  margin-top: 5px;
}

.last-updated {
  font-size: smaller;
  color: gray;
  margin-top: 10px;
}

.task-status-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.task-status-container h3 {
  margin: 0;
  display: flex;
  align-items: center;
}

.task-status-container button {
  margin-left: auto;
}
</style>