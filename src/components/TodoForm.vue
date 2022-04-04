<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <form v-else @submit.prevent="onSave">
      <div class="row">
        <div class="col-6">
          <Input label="Subject" :error="subjectError" :subject="todo.subject"/>
          
        </div>
        <div v-if="editing" class="col-6">
          <div class="form-group">
            <label>Status</label>
            <div>
              <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">{{todo.completed ? 'Completed' : 'Incompleted'}}</button>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label>Body</label>
            <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
          </div>
        </div>
      </div>
      
      <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">{{editing? 'Update' : 'Create'}}</button>
      <button class="btn btn-outline-dark m-2" @click="moveToTodoListPage">Cancel</button>
    </form>
    
    <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType"/>
  </div>
</template>

<script>
import {ref, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from 'axios';
import _ from 'lodash';
import Toast from '@/components/Toast.vue';
import {useToast} from '@/hooks/toast';
import Input from '@/components/Input.vue'

export default {
    components:{
      Toast,
      Input
    },
    props:{
        editing: {
            type: Boolean,
            default: false,
            body: ''
        }
    },
    setup(props){
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
        subject : '',
        completed: false,
    });
    const subjectError = ref('');
    const originTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;

    const{
        toastMessage,
        toastAlertType,
        showToast,
        triggerToast
    } = useToast();

    const getTodo = async () => {
        loading.value = true;
        try{
        const res = await axios.get('http://localhost:3000/todos/'+todoId)
        
        todo.value = {...res.data};
        originTodo.value = {...res.data};
        loading.value = false;
        }catch(err){
        triggerToast('error','danger');
        loading.value = false;
        }
    }
    
    const todoUpdated = computed(() => {
        return !_.isEqual(todo.value,originTodo.value);
    })

    const toggleTodoStatus = () => {
        todo.value.completed = !todo.value.completed;
    }

    const moveToTodoListPage = () => {
        router.push({
        name:'Todos'
        })
    }
    
    const onSave = async () => {
        if(!todo.value.subject){
            subjectError.value = 'Subject is required';
            return;
        }
        subjectError.value='';
        try{
            let res;
            const data = {
                subject: todo.value.subject,
                completed: todo.value.completed,
                body: todo.value.body
            }
            if(props.editing){
                res = await axios.put('http://localhost:3000/todos/'+todoId,data)
            }else{
                res = await axios.post('http://localhost:3000/todos/',data)
                todo.value.subject = '';
                todo.value.body = '';
            }
        
            originTodo.value = {...res.data}
            const msg = 'Successfully'+(props.editing? ' Updated':' Created');
            triggerToast(msg);
        }catch(err){
        triggerToast('error','danger');
        }
    
    }
    if(props.editing){
        getTodo();
    }
    
    return{
        todo,
        loading,
        toggleTodoStatus,
        moveToTodoListPage,
        onSave,
        todoUpdated,
        showToast,
        toastMessage,
        toastAlertType,
        subjectError
    }
    }
}
</script>

<style scoped>
    
</style>