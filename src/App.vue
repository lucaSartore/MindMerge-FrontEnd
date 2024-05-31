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
  padding-top: 5%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 60px;
  margin: 0%;
}

</style>
