<script setup>
  import { ref } from 'vue';
  import { Vue } from "vue";

</script>

<template>
  <main>
    <h1>Home Page</h1>
    This is your mind merge home page, where you can see all your tasks.
    <br>

    <div class = main_container>
        <div  class="side_bar">
        </div>
        <div  class="main_content">
        </div>
    </div>

  </main>
</template>


<style scoped>

  .main_container {
    overflow: auto;
    height: 100%;
    padding: 0%;
    margin: 0%;
  }

  .side_bar {
    background-color: #6ab6fd;
    float: left;
    width: 25%;
    padding: 20px;
    margin: 0px;
    height: 100%;
    box-sizing: border-box
  }

  .main_content {
    float: right;
    width: 75%;
    background-color: #ff8989;
    padding: 20px;
    margin: 0px;
    height: 100%;
    box-sizing: border-box
  }

</style>