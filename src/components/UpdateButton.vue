
<script setup>
import { ref, computed, callWithAsyncErrorHandling } from 'vue';

const props = defineProps({
    text: Object,
    argsForUpdateFunction: Object,
    updateFunction: Object,
    callbackAfterUpdate: Object,
})

async function update(newText) {
    await props.updateFunction(newText, props.argsForUpdateFunction)
    if(props.callbackAfterUpdate == undefined){
        return;
    }
    await props.callbackAfterUpdate()
}

const isOpen = ref(false);
const editedText = ref("");

function popupOpen(){
    editedText.value = props.text;
    isOpen.value = true;
}

function popupCancel(){
    isOpen.value = false;
}

async function popupOk(){
    await update(editedText.value);
    isOpen.value = false;
}

</script>

<template>

  <button @click="popupOpen" class="edit-button">
    <i class="fas fa-pencil-alt"></i>
  </button>


<div v-if="isOpen" class="popup">
    <div class="popup-content">
        <textarea v-model="editedText"></textarea>    
        <br>
        <button @click="popupCancel">Cancel</button>
        <button @click="popupOk">Ok</button>
    </div>
</div>

</template>


<style scoped>

.popup-content textarea{
    height: 80%;
    width: 90%;
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
  width: 60%;
  height: 60%;
}



.edit-button {
  background-color: #007BFF77; /* Transparent background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 15px; /* Padding for the button */
  text-align: center; /* Center the text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Make the container fit the text */
  font-size: 16px; /* Increase font size */
  margin: 4px 2px; /* Add some margin */
  cursor: pointer; /* Pointer/hand icon on hover */
  border-radius: 50%; /* Circle shape */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition */
}

.edit-button:hover {
  background-color: #007BFF; /* Blue background on hover */
  color: white; /* White text on hover */
}

.edit-button i {
  margin-right: 0; /* No space between icon and text */
}
</style>