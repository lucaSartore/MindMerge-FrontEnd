<script setup>
import { RouterView } from 'vue-router'
import TopBar from '@/components/TopBar.vue'

</script>

<template>
 
  <TopBar />
  <br>
  <div class="content">
    <RouterView />
  </div>
</template>

<style>

.content {
  padding-top: 60px; /* Adjust this value to match the height of your TopBar */
  padding-left: 70px; /* Adjust this value to match the height of your TopBar */
  padding-right: 70px; /* Adjust this value to match the height of your TopBar */
  padding-bottom: 60px; /* Adjust this value to match the height of your TopBar */
}

</style>
