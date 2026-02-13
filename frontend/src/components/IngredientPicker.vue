<template>
  <div>
    <div class="row">
      <select v-model="pickedId" class="input">
        <option value="">-- เลือกวัตถุดิบ --</option>
        <option v-for="i in ingredients" :key="i._id" :value="i._id">
          {{ i.name }} ({{ i.category }})
        </option>
      </select>

      <input class="input" v-model.number="grams" type="number" min="1" placeholder="กรัม (g)" />

      <button class="btn-secondary" @click="add">เพิ่ม</button>
    </div>

    <ul class="list">
      <li v-for="(x, idx) in selected" :key="idx" class="list-item">
        <div>
          <b>{{ x.name }}</b> — {{ x.grams }}g
        </div>
        <button class="btn-danger" @click="remove(idx)">ลบ</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  ingredients: { type: Array, default: () => [] },
  selected: { type: Array, default: () => [] }
});
const emit = defineEmits(["update:selected"]);

const pickedId = ref("");
const grams = ref(100);

const selected = computed({
  get: () => props.selected,
  set: (v) => emit("update:selected", v)
});

function add() {
  const item = props.ingredients.find(i => i._id === pickedId.value);
  if (!item) return;

  const g = Number(grams.value || 0);
  if (g <= 0) return;

  selected.value = [
    ...selected.value,
    { ingredientId: item._id, name: item.name, grams: g }
  ];

  pickedId.value = "";
  grams.value = 100;
}

function remove(idx) {
  selected.value = selected.value.filter((_, i) => i !== idx);
}
</script>
