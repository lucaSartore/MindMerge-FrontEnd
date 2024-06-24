<script setup>
import { RouterView } from 'vue-router'
import TopBar from '@/components/TopBar.vue'
import { ref } from 'vue'
import { loadingRequests } from './states/loadingRequests';
</script>

<template>
 
  <TopBar />
  <br>
  <div class="content">
    <RouterView />
  </div>

  <!-- Loading Overlay -->
  <div v-if="loadingRequests != 0" class="loading-overlay">
    <div class="spinner"></div>
  </div>

</template>

<style>

.content {
  padding-top: 5%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 60px;
  margin: 0%;
}


.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;  /* Ensure it appears above other content */
}

.spinner {
  border: 16px solid #333333; /* Light grey */
  border-top: 16px solid #db7434; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
