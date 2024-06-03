<script setup>
import TreeMenu from '../components/TreeMenu.vue';
import { ref } from 'vue';
import { organization } from '../states/organization.js'
import { getTaskTree, createTask, updateTaskName } from '../util/back_end_calls.js'
import { loggedUser } from '../states/loggedUser.js'
import { setSelectedTask } from '../states/task.js';
import { selectedTask } from '../states/task.js';
import UpdateButton from '../components/UpdateButton.vue';

var treeData = ref([{}]);

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

async function createChildTask(taskName, taskFatherId) {
  let organizationId = organization.current;
  let manager = loggedUser.id;
  let assignees = [manager];
  await createTask(organizationId, taskName, assignees, manager, taskFatherId)
  await updateTaskTree();
}

async function deleteTask(){
  let organizationId = organization.current;
  let taskId = selectedTask.value.taskId;
  
}

createChildTask("Test", 1)

updateTaskTree()



</script>

<template>
  <main>
    <h1>Home Page</h1>
    <br>

    <div v-if="organization.current == undefined"> You need to select/create an organization from the page
      "organization" before you can see the details in this page</div>

    <div v-if="organization.current != undefined" class=main_container>
      <div class="side_bar">
        <!-- <TreeMenu class="item" :model="treeData"></TreeMenu > -->
        <ul v-for="tree in treeData">
          <TreeMenu class="item" :model="tree"></TreeMenu>
        </ul>
      </div>
      <div class="main_content">

        <button v-if="selectedTask.taskName!= undefined" @click="createChildTask('New Child Task', selectedTask.taskId)">Add child task </button>
        <button @click="createChildTask('New Root Task', null)">Add root task </button>
        <button v-if="selectedTask.taskName!= undefined" @click="">Delete selected task</button>
        <br>

        <div v-if="selectedTask.taskName!= undefined">
          <h1> Current task: {{ selectedTask.taskName }}
            <UpdateButton :text="selectedTask.taskName" :updateFunction="updateTaskNameWrapper" :argsForUpdateFunction="null"
              :callbackAfterUpdate="updateTaskTree">
            </UpdateButton>
          </h1>
        </div>

      </div>
    </div>

  </main>
</template>


<style scoped>
.main_container {
  overflow: auto;
  height: 100%;
  padding: 0%;
  margin: 0%;
}

.side_bar {
  border-color: black;
  border-radius: 5%;
  border-width: 4px;
  border-style: solid;
  float: left;
  width: 25%;
  padding: 20px;
  margin: 0px;
  height: 100%;
  box-sizing: border-box
}

.main_content {
  float: right;
  width: 75%;
  padding: 20px;
  margin: 0px;
  height: 100%;
  box-sizing: border-box
}
</style>