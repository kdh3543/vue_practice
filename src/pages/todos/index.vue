<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h1>To-Do List</h1>
      <button class="btn btn-primary" @click="moveToCreate">Create Todo</button>
    </div>
    
    <input
        class="form-control"
        type="text" 
        v-model="searchText"
        placeholder="search"
        @keyup.enter="searchClear"
    >
    <hr>
    <div v-if="!todos.length">
      There is nothing
    </div>
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo"/>
    <hr>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" v-if="currentPage!=1" @click="getTodos(currentPage-1)">Previous</a></li>
        <li class="page-item" v-for="page in numberOfPages" :key="page" :class="currentPage===page ? 'active' : ''"><a class="page-link" href="#" @click="getTodos(page)">{{page}}</a></li>
        <li class="page-item"><a class="page-link" v-if="currentPage!=numberOfPages" @click="getTodos(currentPage+1)">Next</a></li>
      </ul>
    </nav>
    <transition name="hook">
      <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType"/>
    </transition>
  </div>
</template>

<script>
import { ref, computed, watch} from 'vue';
import TodoList from '@/components/TodoList.vue';
import axios from 'axios';
import Toast from '@/components/Toast.vue';
import {useToast} from '@/hooks/toast';
import {useRouter} from 'vue-router';

export default {
  components: {
    TodoList,
    Toast
  },
  setup() {
    const router = useRouter();
    const todos = ref([]);
    const error = ref('');
    const numberOfTodos = ref(0);
    const currentPage = ref(1);
    const limit = 5;
    const searchText = ref('');

    const{
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value/limit);
    })

    const addTodo = async (todo) => {
      try{
        await axios.post('http://localhost:3000/todos',{
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
      }catch(err){
        error.value = err;
        triggerToast('error','danger');
      } 
      // .then(res => {
      //   todos.value.push(res.data);
      // }).catch(err => {
      //   
      // });
    };
    
    const getTodos = async(page = currentPage.value) => {
      currentPage.value = page;
      try{
        const res = await axios.get(`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`)
        numberOfTodos.value = res.headers['x-total-count'];
        todos.value = res.data;
      }catch(err){
        error.value = err;
        triggerToast('error','danger');
      }      
    }
    getTodos();

    const toggleTodo = async (index,checked) => {
      error.value = '';
      const id = todos.value[index].id;
      try{
        await axios.patch('http://localhost:3000/todos/'+id,{
          completed: checked
        });
        todos.value[index].completed = checked;
      }catch(err){
        error.value = err;
        triggerToast('error','danger');
      }
    };

    const deleteTodo = async (id) => {
      error.value = '';
      try{
        await axios.delete('http://localhost:3000/todos/'+id);
        getTodos(1);
      }catch(err){
        error.value = err;
        triggerToast('error','danger');
      }      
    };

    //watch를 사용하여 검색
    let timeout = null;
    const searchClear = () => {
      getTodos(1);
    };
    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      },1000)
    })

    const moveToCreate = () => {
      router.push({
        name: 'TodoCreate'
      })
    }

    return {
      todos,
      addTodo,
      deleteTodo,
      toggleTodo,
      searchText,
      // filteredTodos,
      error,
      getTodos,
      numberOfPages,
      currentPage,
      searchClear,
      showToast,
      toastMessage,
      toastAlertType,
      triggerToast,
      moveToCreate
    };
  }
}
</script>

<style scoped>
  
  .hook-enter-active, .hook-leave-active
  {
    transition: opacity 0.5s ease;
  }
  .hook-enter-from, .hook-leave-to
  {
    opacity: 0;
    transform: translateY(-30px);
  }

  .hook-enter-to, .hook-leave-from{
    opacity: 1;
    transform: translateY(0px);
  }
  
</style>