<script setup>
import { ref } from 'vue';

const errorMessage = ref('');

const handleGoogleSignIn = () => {
  window.location.href = '/auth/google'; // Reindirizza l'utente a Google per l'autenticazione
};
</script>

<template>
  <div class="sign-in-view">
    <h2>Sign In</h2>
    <button class="google-sign-in-button" @click="handleGoogleSignIn">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google icon" width="20" height="20" />
      Sign In with Google
    </button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.sign-in-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.google-sign-in-button {
  background-color: #4285f4; /* Google blue */
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.google-sign-in-button:hover {
  background-color: #357ae8;
}

.google-sign-in-button:active {
  background-color: #3367d6;
}

.google-sign-in-button img {
  margin-right: 8px;
}
</style>
