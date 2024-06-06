<script setup>
</script>

<template>
  <div class="sign-in-view">
    <h2>Sign In</h2>
    <form @submit.prevent="handleSignIn">
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Sign In</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>
