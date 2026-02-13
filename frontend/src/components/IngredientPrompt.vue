<template>
  <textarea
    class="input"
    rows="4"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    placeholder="เช่น: มีไข่ 2 ฟอง ข้าวสวย 200g อกไก่ 150g..."
  />
</template>

<script setup>
defineProps({ modelValue: String });
defineEmits(["update:modelValue"]);
</script>
