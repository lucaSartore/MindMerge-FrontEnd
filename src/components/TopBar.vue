
<script setup>
import { RouterLink} from 'vue-router'

import { isUserLoggedIn} from '../states/loggedUser';

</script>

<template>
  <div class="top-bar">
      <nav v-if = "!isUserLoggedIn()">
        <RouterLink to="/about_us">About Us</RouterLink>
        <RouterLink to="/sign_in">Sign In</RouterLink>
        <RouterLink to="/sign_up">Sign Up</RouterLink>
      </nav>
      <nav v-if = "isUserLoggedIn()">
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/reports">Reports</RouterLink>
        <RouterLink to="/organization">Organizations</RouterLink>
        <RouterLink to="/account">Account</RouterLink>
        <RouterLink to="/notifications">Notifications</RouterLink>
      </nav>
  </div>
</template>

<style scoped>

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Adjust height as needed */
  background-color: #333; /* Change to your desired color */
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.top-bar nav * {
  color: gold;
  margin: 0 20px;
  text-decoration: none;
}

</style>
