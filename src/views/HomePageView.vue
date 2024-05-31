<script setup>
import TreeMenu from '../components/TreeMenu.vue';
import { ref } from 'vue';
import {organization} from '../states/organization.js'
import { getTaskTree } from '../util/back_end_calls.js'
import {loggedUser} from '../states/loggedUser.js'
import { setSelectedTask } from '../states/task.js';

var treeData = ref([{}]);

async function updateTaskTree(){
  let value = await getTaskTree(organization.current, loggedUser.id)
  if (value == null){
    return
  }
  if (value.length > 0){
    setSelectedTask(value[0].taskId)
  }
    treeData.value = value
}

updateTaskTree()

</script>

<template>
  <main>
    <h1>Home Page</h1>
    <br>
    
    <div v-if="organization.current == undefined"> You need to select/create an organization from the page "organization" before you can see the details in this page</div>
  
    <div v-if="organization.current != undefined" class=main_container>
      <div class="side_bar">
        <!-- <TreeMenu class="item" :model="treeData"></TreeMenu > -->
        <ul v-for="tree in treeData">
          <TreeMenu class="item" :model="tree"></TreeMenu>
        </ul>
      </div>
      <div class="main_content">
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
  background-color: #6ab6fd;
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
  background-color: #ff8989;
  padding: 20px;
  margin: 0px;
  height: 100%;
  box-sizing: border-box
}
</style>