<script setup>
import * as dateFns from "date-fns";
definePageMeta({
  layout: "core",
});
useProfile().init();
useDashboard().get();
</script>

<template>
  <div>
    <Loading v-if="useDashboard().loading" />

    <div v-else>
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-primary text-3xl">
            <FaIcon icon="fa-solid fa-file-invoice" />
          </div>
          <div class="stat-title text-primary">Offers accepted</div>
          <div class="stat-value">
            {{ useFormat.toCurrency(useDashboard().dashboard.offers.total) }}
          </div>
          <div class="stat-desc">
            net
            {{ useFormat.toCurrency(useDashboard().dashboard.offers.net) }}
          </div>
        </div>
        <div class="stat">
          <div class="stat-figure text-success text-3xl">
            <FaIcon icon="fa-solid fa-file-invoice-dollar" />
          </div>
          <div class="stat-title text-success">Invoices paid</div>
          <div class="stat-value">
            {{ useFormat.toCurrency(useDashboard().dashboard.invoices.total) }}
          </div>
          <div class="stat-desc">
            net
            {{ useFormat.toCurrency(useDashboard().dashboard.invoices.net) }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-10"
      v-if="useDashboard().dashboard.invoices.pending.length > 0"
    >
      <div class="divider"></div>
      <div class="prose mb-5">
        <h2 class="text-warning">Pending invoices</h2>
      </div>
      <DocumentList
        :list="useDashboard().dashboard.invoices.pending"
        type="invoices"
      />
    </div>
    <div
      class="mt-10"
      v-if="useDashboard().dashboard.offers.pending.length > 0"
    >
      <div class="divider"></div>
      <div class="prose mb-5">
        <h2 class="text-warning">Pending Offers</h2>
      </div>
      <DocumentList
        :list="useDashboard().dashboard.offers.pending"
        type="offers"
      />
    </div>
    <div
      class="mt-10 prose text-center"
      v-if="
        useDashboard().dashboard.invoices.pending.length === 0 &&
        useDashboard().dashboard.offers.pending.length === 0
      "
    >
      <div class="divider"></div>
      <FaIcon icon="fa-thumbs-up" class="text-5xl text-accent" />
      <h1 class="!text-accent mt-5">All good!</h1>
      <p>
        You have
        <strong class="text-accent">no invoices or offers</strong> pending right
        now.
      </p>
    </div>
  </div>
</template>
