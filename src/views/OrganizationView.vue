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
    currentOrganization = r;
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

    <div v-if="organization.organizations.length != 0">

      <label for="organization-select">Select Organization:</label>
      <select id="organization-select" v-model="currentOrganization"
        @change="updateOrganization(currentOrganization-1); updateUserList()">
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
body {
  background-color: #f5f5f5;
  color: #333;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

input, select {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li button {
  background-color: #dc3545;
  font-size: 14px;
}

li button:hover {
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
