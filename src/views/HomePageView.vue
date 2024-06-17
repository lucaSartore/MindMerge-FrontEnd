<script setup>
import TreeMenu from '../components/TreeMenu.vue';
import { ref } from 'vue';
import { organization } from '../states/organization.js'
import { getTaskTree, createTask, updateTaskName, createNote, updateTaskNotes, deleteTaskNotes, removeAssigneeFromTask, addAssigneeToTask, getUserIdByName } from '../util/back_end_calls.js'
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
  console.log(selectedTask.value);
}


async function updateTaskNameWrapper(newName) {
  await updateTaskName(organization.current, selectedTask.value.taskId, newName)
}

async function updateTaskNotesWrapper(newNotes) {
  await updateTaskNotes(organization.current, selectedTask.value.taskId, selectedNote.value, newNotes)
}

async function createChildTask(taskName, taskFatherId) {
  let organizationId = organization.current;
  let manager = loggedUser.id;
  let assignees = [manager];
  await createTask(organizationId, taskName, assignees, manager, taskFatherId)
  await updateTaskTree();
}

async function deleteTask() {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
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

async function removeAssigneeFromTaskWrapper(userId) {
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  await removeAssigneeFromTask(organizationId, taskId, userId)
  await setSelectedTask(selectedTask.value.taskId);
}


const showAddAssigneePopup = ref(false);
const errorMessage = ref('');
const userName = ref('');

function addAssigneeToTaskWrapper(userName) {
  getUserIdByName(userName).then((v) => {
    if (v.statusCode === 404) {
      errorMessage.value = "User not found";
    } else {
      addAssigneeToTask(organization.current, selectedTask.value.taskId, v.payload).then(() => {
        setSelectedTask(selectedTask.value.taskId);
        closeAddAssigneePopup();
      });
    }
  });
}

function handleAddAssignee() {
  const result = addAssigneeToTaskWrapper(userName.value);
  if (result) {
    closePopup();
    updateUserList();
  } else {
    errorMessage.value = "User not found";
  }
}

function closeAddAssigneePopup() {
  showAddAssigneePopup.value = false;
  userName.value = '';
  errorMessage.value = '';
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
        <button v-if="selectedTask.taskName != undefined" @click="">Delete selected task</button>
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
          <h3> Task Status:
            <select id="statusSelector" v-model="selectedTask.taskStatus" style="width: 200px;">
              <option v-for="status in 6" :key="status" :value="status">
                {{ Object.keys(TaskStatus.TaskStatus)[status] }}
              </option>
            </select>
          </h3>
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
              <h1> Task Notes: {{ selectedTask.taskNotes[selectedNote - 1].notes }}
                <UpdateButton :text="selectedTask.taskNotes[selectedNote - 1].notes"
                  :updateFunction="updateTaskNotesWrapper" :argsForUpdateFunction="null"
                  :callbackAfterUpdate="updateTaskTree">
                </UpdateButton>
              </h1>
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
</style>
