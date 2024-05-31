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
        <div>
            <span :class="{ selected: isSelected }" @click="select">
                {{ model.taskName}}
            </span>
            <span :class="{ bold: isSelected }" @click="toggle">
                <span v-if="hasChildren">[{{ isOpen ? '-' : '+' }}]</span>
            </span>
        </div>
        <ul v-show="isOpen" v-if="hasChildren">
            <TreeMenu class="item" v-for="model in model.childTasks" :model="model">
            </TreeMenu>
        </ul>
    </li>
</template>

<style scoped>
.selected{
    font-weight: bold;
}
</style>


