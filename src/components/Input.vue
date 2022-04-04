<template>
    <div class="form-group">
        <label>{{label}}</label>
        <input :value="subject" type="text" class="form-control" @input="onInput">
        <div v-if="subjectError" class="text-red">{{subjectError}}</div>
    </div>
</template>

<script>
export default {
    props:{
        label: {
            type: String,
            required: true
        },
        error: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },

    },
    setup(){
        const onInput = (e) => {
            console.log(e.target.value)
        }
        return{
            onInput
        }
    }
}
</script>

<style scoped>
    .text-red{
        color: red;
    }
</style>