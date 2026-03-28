<template>
  <div v-if="!data" class="muted">ยังไม่มีผลลัพธ์</div>

  <div v-else>
    <div v-if="data.warnings?.length" class="warn">
      <b>⚠️ คำเตือน:</b>
      <ul>
        <li v-for="(w,i) in data.warnings" :key="i">{{ w }}</li>
      </ul>
    </div>

    <div v-for="(r, idx) in data.recipes" :key="idx" class="recipe card" style="margin-bottom: 24px;">
      <div class="recipe-head">
        <div>
          <h3 style="color: #e65100; margin-bottom: 4px;">{{ r.name }}</h3>
          <div class="muted" style="font-size: 0.9rem;">
            📊 ความยาก: {{ r.difficulty }} • ⏳ เวลา {{ r.time_minutes }} นาที •
            🔥 แคลอรี่: {{ r.calories_estimate }} kcal/เสิร์ฟ
            <span v-if="typeof r.calories_checked === 'number'" style="color: #2e7d32;">
              • (คำนวณจากคลัง: {{ r.calories_checked }} kcal)
            </span>
          </div>
        </div>
      </div>

      <hr style="border: 0.5px solid #eee; margin: 16px 0;" />

      <div class="recipe-body">
        <h4>🛒 วัตถุดิบที่ใช้</h4>
        <ul class="ingredient-list">
          <li v-for="(ing,i) in r.ingredients_used" :key="i">
            <b>{{ ing.name }}</b> — {{ ing.grams }} กรัม
          </li>
        </ul>

        <div v-if="r.missing_ingredients?.length">
          <h4 style="color: #d32f2f;">📦 วัตถุดิบที่ต้องหาเพิ่ม</h4>
          <ul class="missing-list">
            <li v-for="(m,i) in r.missing_ingredients" :key="i">{{ m }}</li>
          </ul>
        </div>

        <h4>👨‍🍳 ขั้นตอนการปรุง</h4>
        <ol class="steps-list">
          <li v-for="(s,i) in r.steps" :key="i" style="margin-bottom: 8px;">{{ s }}</li>
        </ol>

        <div v-if="r.tips_for_skill_level?.length">
          <h4>💡 เคล็ดลับสำหรับคุณ</h4>
          <ul class="tips-list">
            <li v-for="(t,i) in r.tips_for_skill_level" :key="i">{{ t }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Object
});
</script>

<style scoped>
.recipe {
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #555;
  border-left: 4px solid #ffb74d;
  padding-left: 10px;
}
ul, ol {
  padding-left: 20px;
  line-height: 1.6;
}
.muted {
  color: #777;
}
.warn {
  background: #fff3e0;
  padding: 15px;
  border-radius: 8px;
  border-left: 5px solid #ff9800;
  margin-bottom: 20px;
}
</style>