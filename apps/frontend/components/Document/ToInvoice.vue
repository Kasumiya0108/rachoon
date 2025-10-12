<script setup lang="ts">
import { Format } from "@repo/common";

const controller = () => useDocument();
const offer = controller().offer;

const amount = computed(() =>
  controller().offerToInvoiceValueType === "percent"
    ? useFormat.toCurrency((offer.data.net / 100) * controller().offerToInvoiceValue)
    : useFormat.toCurrency(controller().offerToInvoiceValue),
);

const emit = defineEmits(["close"]);

const finalAmount = computed(() => {
  let paid = 0;
  offer.invoices.forEach((i) => {
    paid += i.data.net;
  });
  return offer.data.net - paid;
});
</script>

<template>
  <div class="prose mb-5">
    <div v-if="offer.invoices.length > 0">
      <h3>Previous invoices</h3>
      <table class="table table-compact">
        <tbody>
          <tr v-for="i in offer.invoices">
            <td>{{ i.number }}</td>
            <td>{{ useFormat.toCurrency(i.data.net) }}</td>
            <td>{{ useFormat.toCurrency(i.data.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="mt-0">Convert Offer to Invoice</h3>
    <p>How much of the offer should be calculated as an invoice?</p>
  </div>
  <label class="flex flex-row gap-2 mb-2" v-if="offer.invoices.length === 0">
    <input
      type="radio"
      name="option"
      class="radio radio-xs"
      @change="controller().offerToInvoiceOption = 'full'"
      :checked="controller().offerToInvoiceOption === 'full'"
    />
    <span class="label-text">
      Use entire amount of
      {{ useFormat.toCurrency(controller().offer.data.net) }}
    </span>
  </label>
  <label class="flex flex-row gap-2 mb-2" v-if="offer.invoices.length > 0">
    <input
      type="radio"
      name="option"
      class="radio radio-xs"
      @change="controller().offerToInvoiceOption = 'final'"
      :checked="controller().offerToInvoiceOption === 'final'"
    />
    <span class="label-text">
      Use the remaining amount of
      {{ useFormat.toCurrency(finalAmount) }}
    </span>
  </label>
  <label class="flex flex-row gap-2 mb-2">
    <input
      type="radio"
      name="option"
      class="radio radio-xs"
      @change="controller().offerToInvoiceOption = 'partial'"
      :checked="controller().offerToInvoiceOption === 'partial'"
    />
    <span class="label-text">Use only a partial amount</span>
  </label>

  <div class="form-control prose mt-10" v-if="controller().offerToInvoiceOption === 'partial'">
    <h3>Partial amount</h3>
    <p>What amount should be converted to the invoice?</p>
    <div class="input-group">
      <input type="text" placeholder="0" class="input input-bordered input-sm w-40" v-model="controller().offerToInvoiceValue" />
      <select class="select select-bordered select-sm bg-base-300" v-model="controller().offerToInvoiceValueType">
        <option value="percent">%</option>
        <option value="fixed">
          {{ useCountries.mySymbol() }}
        </option>
      </select>
      <span class="text-warning text-sm input-bordered w-40 text-right">{{ amount }}</span>
    </div>
  </div>
  <div class="divider"></div>
  <form method="dialog" class="text-right">
    <button class="btn btn-sm btn-neutral" @click="emit('close')">Apply</button>
  </form>
</template>
