<script setup>
const props = defineProps({
  example: String,
});
const loading = ref(false);
let images = ref([]);
onMounted(async () => {
  load();
});
async function load() {
  loading.value = true;
  images.value = props.example ? await useExample().preview(props.example) : await useDocument().preview();
  loading.value = false;
}
</script>

<template>
  <Loading v-if="loading" />
  <div v-else class="text-center">
    <div v-for="(image, i) in images">
      <span v-if="!example" class="badge badge-sm mb-2">Page {{ i + 1 }}</span>
      <img :src="image" class="inline rounded-xl shadow-xl" />
    </div>
    <button class="btn btn-xs mt-5" @click="load" v-if="props.example">Refresh</button>
  </div>
</template>

<style scoped>
img {
  width: 300px;
  height: auto;
}
</style>
