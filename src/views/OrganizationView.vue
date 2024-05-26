<script setup>
import { ref } from 'vue';
import { organization, updateOrganization } from "../states/organization.js";
import { getOrganizationUsers, getUserIdByName, addUserToOrganization, deleteUserFromOrganization, createOrganization} from "../util/back_end_calls.js"
import { defineComponent } from "vue";
import { loggedUser } from "../states/loggedUser.js";

const userName = ref('');
const showPopup = ref(false);
const errorMessage = ref('');

const showModal = ref(false);
const organizationName = ref('');

/**
 * @type {number | undefined}
 */
let currentOrganization = organization.current;
/**
* @type {{id: number, name: string}[]}
*/
//let organizations = organization.organizations;

async function createOrganizationWrapper(organizationName) {
  let r = await createOrganization(organizationName,loggedUser.id);
  if (r != undefined) {
    await updateOrganization();
    return true;
  }
  return false;
}

/**
* @type {{id: number, name: string}[]}
*/
let userList = ref([]);

function deleteUserFromOrganizationWrapper(userId) {
  deleteUserFromOrganization(currentOrganization, userId).then(() => {
    updateUserList();
  });
}

function updateUserList() {
  if (currentOrganization === undefined) {
    return;
  }
  getOrganizationUsers(currentOrganization).then((v) => {
    userList.value = v;
  });
}

function addUserToOrganizationWrapper(userName) {
  getUserIdByName(userName).then((v) => {
    if (v.statusCode === 404) {
      errorMessage.value = "User not found";
    } else {
      addUserToOrganization(currentOrganization,v.payload).then(() => {
        updateUserList();
        closePopup();
      });
    }
  });
}

function handleAddUser() {
  const result = addUserToOrganizationWrapper(userName.value);
  if (result) {
    closePopup();
    updateUserList();
  } else {
    errorMessage.value = "User not found";
  }
}

function closePopup() {
  showPopup.value = false;
  userName.value = '';
  errorMessage.value = '';
}

function handleCreateOrganization() {
  if (organizationName.value) {
    createOrganizationWrapper(organizationName.value);
    showModal.value = false;
    organizationName.value = '';
  } else {
    alert('Please enter an organization name.');
  }
}

updateUserList();

</script>

<template>
  <main>
    <h1>Organization Management</h1>
    <br>

    <button @click="showModal = true">Create Organization</button>

    <br>

    <div v-if="showModal" class="popup">
      <div class="popup-content">
        <h2>Create Organization</h2>
        <input v-model="organizationName" placeholder="Enter organization name">
        <br>
        <button @click="handleCreateOrganization">OK</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>

    <br>


    <!-- If user already have one or more organizations -->
    <div v-if="organization.organizations.length != 0">

      <label for="organization-select">Select Organization:</label>
      <select id="organization-select" v-model="currentOrganization"
        @change="updateOrganization(currentOrganization); updateUserList()">
        <option v-for="org in organization.organizations" :key="org.id" :value="org.id">
          {{ org.name }}
        </option>
      </select>

      <br>
      <br>
      <br>

      <button @click="showPopup = true">Add User to Organization</button>

      <div v-if="showPopup" class="popup">
        <div class="popup-content">
          <h2>Add User</h2>
          <label for="user-name">User Name:</label>
          <input id="user-name" v-model="userName" type="text" />
          <button @click="handleAddUser">OK</button>
          <button @click="closePopup">Cancel</button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </div>

    <ul>
      <li v-for="user in userList" :key="user.id">
        {{ user.name }}
        <button @click="deleteUserFromOrganizationWrapper(user.id)">Remove</button>
      </li>
    </ul>

    </div>

  </main>
</template>

<style scoped>
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
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
