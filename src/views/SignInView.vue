<script setup>
import { ref } from 'vue';

const errorMessage = ref('');

const handleGoogleSignIn = () => {
};
</script>

<template>
  <div class="sign-in-view">
    <h2>Sign In</h2>
    <button @click="handleGoogleSignIn">Sign In with Google</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.sign-in-view {
}
</style>
