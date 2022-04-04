<template>
  <div>
    <h1>Todo-page</h1>
    <div>
      <TodoForm :editing="true"/>
    </div>
  </div>
  
</template>

<script>
import TodoForm from '@/components/TodoForm.vue';

export default {
    components:{
      TodoForm
    },
    
}
</script>

<style scoped>

</style>