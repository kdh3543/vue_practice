<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{name: 'Home'}">Home</router-link>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link class="nav-link active" :to="{name:'Todos'}">Todos</router-link>
      </li>
    </ul>
  </nav>
  <div class="container">
    <router-view/>    
  </div>
</div>
   
</template>

<script>


export default {

}
</script>

<style>
  .navbar{
    margin-left: 20px;
  }
</style>