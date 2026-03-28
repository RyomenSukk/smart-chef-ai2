<template>
  <div class="container">
    <h1>🍳 Smart Chef AI</h1>

    <div class="grid">
      <section class="card">
        <h2>1) เลือกวัตถุดิบ + ใส่กรัม</h2>
        <IngredientPicker
          :ingredients="ingredients"
          v-model:selected="selectedIngredients"
        />

        <h2 style="margin-top:16px;">2) หรือพิมพ์ว่ามีอะไรบ้าง</h2>
        <IngredientPrompt v-model="userPrompt" />

        <h2 style="margin-top:16px;">3) ตั้งค่าความยาก/ทักษะ</h2>
        <DifficultySelector
          v-model:difficulty="difficulty"
          v-model:skillLevel="skillLevel"
          v-model:servings="servings"
        />

        <button class="btn" :disabled="loading" @click="onRecommend">
          {{ loading ? "กำลังคิดเมนู..." : "แนะนำเมนู" }}
        </button>

        <p class="muted" v-if="error">{{ error }}</p>
      </section>

      <section class="card">
        <h2>ผลลัพธ์</h2>
        <div class="scrollable-area">
          <RecipeResults :data="result" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api/client";

import IngredientPicker from "../components/IngredientPicker.vue";
import IngredientPrompt from "../components/IngredientPrompt.vue";
import DifficultySelector from "../components/DifficultySelector.vue";
import RecipeResults from "../components/RecipeResults.vue";

const ingredients = ref([]);
const selectedIngredients = ref([]); // [{ingredientId, name, grams}]
const userPrompt = ref("");
const difficulty = ref("easy");
const skillLevel = ref("beginner");
const servings = ref(1);

const loading = ref(false);
const loadingImage = ref(false);
const error = ref("");
const result = ref(null);

onMounted(async () => {
  const { data } = await api.get("/api/ingredients");
  ingredients.value = data.items;
});

async function onRecommend() {
  error.value = "";
  loading.value = true;
  result.value = null;

  try {
    const payload = {
      selectedIngredients: selectedIngredients.value.map(x => ({
        ingredientId: x.ingredientId,
        name: x.name,
        grams: x.grams
      })),
      userPrompt: userPrompt.value,
      difficulty: difficulty.value,
      skillLevel: skillLevel.value,
      servings: servings.value,
      language: "th"
    };

    const { data } = await api.post("/api/recommend", payload);
    result.value = data.data;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || "เกิดข้อผิดพลาด";
  } finally {
    loading.value = false;
  }
}

async function onGenerateImage(recipeIndex) {
  if (!result.value?.recipes?.[recipeIndex]?.image_prompt) return;

  loadingImage.value = true;
  try {
    const imagePrompt = result.value.recipes[recipeIndex].image_prompt;
    const { data } = await api.post("/api/images/generate", { imagePrompt });
    result.value.recipes[recipeIndex].image_base64 = data.base64;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || "สร้างรูปไม่สำเร็จ";
  } finally {
    loadingImage.value = false;
  }
}
</script>
