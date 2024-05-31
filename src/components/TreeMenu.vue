<script setup>
import { ref, computed } from 'vue';
import { selectedTask, setSelectedTask } from '../states/task.js'

const props = defineProps({
    model: Object
})

const isOpen = ref(false);

const hasChildren = computed(() => {
    return props.model.childTasks && props.model.childTasks.length;
});

const isSelected = computed(() => {
    if (selectedTask.value == null) {
        return false;
    }
    return props.model.taskId === selectedTask.value.taskId;
});

function toggle() {
    if (hasChildren.value) {
        isOpen.value = !isOpen.value;
    }
}

async function select() {
    await setSelectedTask(props.model.taskId);
}
</script>

<template>
    <li>
        <div class="task-item">
            <span :class="{ selected: isSelected }" @click="select">
                {{ model.taskName }}
            </span>
            <span :class="{ bold: isSelected }" @click="toggle" class="toggle-icon">
                <span v-if="hasChildren">[{{ isOpen ? '-' : '+' }}]</span>
            </span>
        </div>
        <ul v-show="isOpen" v-if="hasChildren">
            <TreeMenu v-for="model in model.childTasks" :model="model">
            </TreeMenu>
        </ul>
    </li>
</template>

<style scoped>
.task-item {
    display: flex;
    align-items: center;
    margin: 5px 0;
    padding: 5px;
    cursor: pointer;
}

.task-item:hover {
    background-color: #f0f0f0;
}

.selected {
    font-weight: bold;
    color: #007bff;
}

.bold {
    font-weight: bold;
}

.toggle-icon {
    margin-left: 10px;
    font-weight: bold;
    cursor: pointer;
}

ul {
    list-style-type: none;
    padding-left: 20px;
    margin: 0;
}

li {
    margin: 5px 0;
}
</style>
