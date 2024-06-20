<script setup>
  import {getGoogleRedirectUrl} from "../util/back_end_calls.js";
  
  async function handleGoogleSignIn() {
    console.log("Redirecting to Google login page");
    const redirectUrl = await getGoogleRedirectUrl();
    window.location.href = redirectUrl;
  }
</script>

<template>
  <div class="sign-in-view">
    <img id="logo" src="../../public/sign_in.png">
    <h2>Sign In</h2>
    <button class="google-sign-in-button" @click="handleGoogleSignIn">
      <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google icon" class="google-icon" />
      <span class="button-text">Sign In with Google</span>
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

.sign-in-view #logo {
  padding: 0 0;
  margin: 20px 0;
  width: 30vh;
}

.google-sign-in-button {
  background-color: white;
  color: #757575;
  border: 1px solid #dcdcdc;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.google-sign-in-button:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.google-sign-in-button:active {
  background-color: #e1e1e1;
}

.google-icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

.button-text {
  white-space: nowrap;
}
</style>