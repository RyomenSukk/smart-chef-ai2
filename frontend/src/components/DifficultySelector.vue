<template>
  <div class="row">
    <label class="label">
      Difficulty
      <select class="input" :value="difficulty" @change="$emit('update:difficulty', $event.target.value)">
        <option value="easy">ง่าย</option>
        <option value="medium">กลาง</option>
        <option value="hard">ยาก</option>
      </select>
    </label>

    <label class="label">
      Skill Level
      <select class="input" :value="skillLevel" @change="$emit('update:skillLevel', $event.target.value)">
        <option value="beginner">มือใหม่</option>
        <option value="intermediate">พอทำได้</option>
        <option value="advanced">ชำนาญ</option>
      </select>
    </label>

    <label class="label">
      Servings
      <input class="input" type="number" min="1" :value="servings" @input="$emit('update:servings', Number($event.target.value))" />
    </label>
  </div>
</template>

<script setup>
defineProps({
  difficulty: String,
  skillLevel: String,
  servings: Number
});
defineEmits(["update:difficulty", "update:skillLevel", "update:servings"]);
</script>
