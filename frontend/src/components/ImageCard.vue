<template>
  <div v-if="base64" class="imgwrap">
    <img :src="`data:image/png;base64,${base64}`" alt="food" />
  </div>
</template>

<script setup>
defineProps({ base64: String });
</script>
