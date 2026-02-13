<template>
  <div v-if="!data" class="muted">ยังไม่มีผลลัพธ์</div>

  <div v-else>
    <div v-if="data.warnings?.length" class="warn">
      <b>คำเตือน:</b>
      <ul>
        <li v-for="(w,i) in data.warnings" :key="i">{{ w }}</li>
      </ul>
    </div>

    <div v-for="(r, idx) in data.recipes" :key="idx" class="recipe">
      <div class="recipe-head">
        <div>
          <h3>{{ r.name }}</h3>
          <div class="muted">
            Difficulty: {{ r.difficulty }} • เวลา {{ r.time_minutes }} นาที •
            แคลอรี่(ประมาณ): {{ r.calories_estimate }} kcal/เสิร์ฟ
            <span v-if="typeof r.calories_checked === 'number'">
              • (คำนวณจาก DB: {{ r.calories_checked }} kcal)
            </span>
          </div>
        </div>

        <button class="btn-secondary" :disabled="loading" @click="$emit('generate-image', idx)">
          {{ loading ? "กำลังสร้างรูป..." : "สร้างรูปอาหาร" }}
        </button>
      </div>

      <ImageCard :base64="r.image_base64" />

      <h4>วัตถุดิบที่ใช้</h4>
      <ul>
        <li v-for="(ing,i) in r.ingredients_used" :key="i">{{ ing.name }} — {{ ing.grams }}g</li>
      </ul>

      <div v-if="r.missing_ingredients?.length">
        <h4>ของที่อาจต้องเพิ่ม</h4>
        <ul>
          <li v-for="(m,i) in r.missing_ingredients" :key="i">{{ m }}</li>
        </ul>
      </div>

      <h4>ขั้นตอน</h4>
      <ol>
        <li v-for="(s,i) in r.steps" :key="i">{{ s }}</li>
      </ol>

      <h4>ทิปส์ (ตามระดับทักษะ)</h4>
      <ul>
        <li v-for="(t,i) in r.tips_for_skill_level" :key="i">{{ t }}</li>
      </ul>

      <details>
        <summary>Image Prompt</summary>
        <pre class="code">{{ r.image_prompt }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import ImageCard from "./ImageCard.vue";

defineProps({
  data: Object,
  loading: Boolean
});
defineEmits(["generate-image"]);
</script>
