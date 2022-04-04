<template>
    <div>
        <div v-for="(item) in items" :key="item.id" class="card mt-2">
            <slot :item="item"></slot>
        </div>  
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>

<style>

</style>