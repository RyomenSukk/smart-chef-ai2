<template>
  <div class="container">
    <h2>🛡️ Admin Panel: จัดการวัตถุดิบ</h2>
    
    <div class="card" style="margin-bottom: 20px;">
      <h3>เพิ่มวัตถุดิบใหม่</h3>
      <div class="row">
        <input v-model="form.name" class="input" placeholder="ชื่อวัตถุดิบ" />
        <input v-model="form.category" class="input" placeholder="หมวดหมู่ (เช่น protein, carb)" />
        <button class="btn" @click="saveIngredient" :disabled="loading">บันทึก</button>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <h3 style="margin: 0;">รายการวัตถุดิบ</h3>
        
        <input 
          v-model="searchQuery" 
          class="input" 
          style="max-width: 300px;" 
          placeholder="🔍 ค้นหาชื่อ หรือ หมวดหมู่..." 
        />
      </div>

      <table style="width: 100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>หมวดหมู่</th>
            <th style="text-align: right;">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredIngredients" :key="item._id">
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td style="text-align: right;">
              <button class="btn-danger" @click="deleteItem(item._id)">ลบ</button>
            </td>
          </tr>
          
          <tr v-if="filteredIngredients.length === 0">
            <td colspan="3" style="text-align: center; padding: 24px; color: #888;">
              ไม่พบข้อมูลวัตถุดิบที่ค้นหา
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../api/client';

const ingredients = ref([]);
const loading = ref(false);
const form = ref({ name: '', category: '' });

const searchQuery = ref('');

const filteredIngredients = computed(() => {
  if (!searchQuery.value) return ingredients.value;
  
  const q = searchQuery.value.toLowerCase();
  return ingredients.value.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.category.toLowerCase().includes(q)
  );
});

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const fetchIngredients = async () => {
  try {
    const { data } = await api.get('/api/ingredients');
    ingredients.value = data.items;
  } catch (e) {
    console.error("ดึงข้อมูลไม่สำเร็จ", e);
  }
};

const saveIngredient = async () => {
  if (!form.value.name) return alert("กรุณาใส่ชื่อ");
  loading.value = true;
  try {
    await api.post('/api/ingredients', form.value, getHeaders());
    form.value.name = ''; 
    form.value.category = '';
    await fetchIngredients();
  } catch (e) {
    alert("เกิดข้อผิดพลาด: " + (e.response?.data?.message || e.message));
  } finally {
    loading.value = false;
  }
};

// ลบวัตถุดิบ
const deleteItem = async (id) => {
  if (!confirm("แน่ใจหรือไม่ว่าจะลบวัตถุดิบนี้?")) return;
  try {
    await api.delete(`/api/ingredients/${id}`, getHeaders());
    await fetchIngredients(); // โหลดข้อมูลใหม่หลังลบเสร็จ
  } catch (e) {
    alert("ลบไม่สำเร็จ: " + (e.response?.data?.message || e.message));
  }
};

onMounted(() => {
  fetchIngredients();
});
</script>

<style scoped>
th {
  padding: 12px;
  border-bottom: 2px solid #eae5df;
  color: #666;
}
td { 
  padding: 12px; 
  border-bottom: 1px solid #f0ece6; 
}
tr:hover td {
  background-color: #faf8f5;
}
</style>