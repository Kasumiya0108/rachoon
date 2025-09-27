<script setup lang="ts">
definePageMeta({
  layout: "core",
});

const clientId = useRoute().params.id as string;
</script>

<template>
  <div>
    <InvoiceOrOfferList :clientId="clientId" />
  </div>
</template>
