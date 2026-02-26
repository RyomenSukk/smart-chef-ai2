<template>
  <div>
    <div class="row">
      <div class="search-container">
        <input
          type="text"
          class="input"
          v-model="searchQuery"
          @focus="isOpen = true"
          @blur="closeDropdown"
          placeholder="🔍 พิมพ์ค้นหาวัตถุดิบ..."
        />
        
        <ul v-if="isOpen" class="dropdown">
          <li 
            v-for="i in filteredIngredients" 
            :key="i._id" 
            @mousedown.prevent="selectItem(i)"
            class="dropdown-item"
          >
            {{ i.name }} <span class="muted-text">({{ i.category }})</span>
          </li>
          <li v-if="filteredIngredients.length === 0" class="dropdown-item muted-text">
            ไม่พบวัตถุดิบที่ค้นหา
          </li>
        </ul>
      </div>

      <input 
        class="input" 
        style="width: 120px;" 
        v-model.number="grams" 
        type="number" 
        min="1" 
        placeholder="กรัม (g)" 
      />

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

const searchQuery = ref("");
const pickedId = ref("");
const grams = ref(100);
const isOpen = ref(false);

// กรองรายการวัตถุดิบตามคำค้นหา (หาจากชื่อ หรือ หมวดหมู่)
const filteredIngredients = computed(() => {
  if (!searchQuery.value) return props.ingredients;
  const q = searchQuery.value.toLowerCase();
  return props.ingredients.filter(i => 
    i.name.toLowerCase().includes(q) || 
    i.category.toLowerCase().includes(q)
  );
});

// เมื่อคลิกเลือกจาก Dropdown
function selectItem(item) {
  searchQuery.value = item.name;
  pickedId.value = item._id;
  isOpen.value = false;
}

// ปิด Dropdown เมื่อไม่ได้ Focus กล่องข้อความ
function closeDropdown() {
  isOpen.value = false;
}

const selected = computed({
  get: () => props.selected,
  set: (v) => emit("update:selected", v)
});

function add() {
  // ค้นหา item จาก ID ที่เลือก หรือ จากชื่อที่พิมพ์ตรงเป๊ะ
  let item = props.ingredients.find(i => i._id === pickedId.value);
  if (!item) {
    item = props.ingredients.find(i => i.name === searchQuery.value);
  }
  
  if (!item) return;

  const g = Number(grams.value || 0);
  if (g <= 0) return;

  // เพิ่มรายการที่เลือกลงไป
  selected.value = [
    ...selected.value,
    { ingredientId: item._id, name: item.name, grams: g }
  ];

  // เคลียร์ค่าหลังจากกดเพิ่ม
  searchQuery.value = "";
  pickedId.value = "";
  grams.value = 100;
}

function remove(idx) {
  selected.value = selected.value.filter((_, i) => i !== idx);
}
</script>

<style scoped>
.search-container {
  position: relative;
  flex: 1; /* ขยายให้เต็มพื้นที่ที่เหลือ */
  min-width: 200px;
}

/* ตกแต่ง Dropdown ให้ออกมาเป็นกล่องลอยๆ สวยงาม */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #eae5df;
  border-radius: 12px;
  margin-top: 6px;
  padding: 0;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f9f9f9;
  transition: background 0.2s;
  color: #4a4a4a;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #fff3e0; /* สีส้มอ่อนเวลานำเมาส์ไปชี้ */
  color: #e65100;
}

.muted-text {
  color: #888;
  font-size: 0.85em;
}
</style>