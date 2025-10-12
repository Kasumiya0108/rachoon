<script setup>
const rates = useSettings().settings.taxes.rates;
const options = useSettings().settings.taxes.options;
const defaultRate = ref(rates.findIndex((r) => r.default));
const defaultOption = ref(options.findIndex((o) => o.default));
</script>
<template>
  <FormSection title="Tax rates" description="Set the tax rates. Default is applied to all new positions">
    <table class="table table-compact w-full m-0">
      <thead>
        <tr>
          <th width="130" class="text-left">Rate</th>
          <th width="130">Default</th>
          <th></th>
          <th width="50"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rates" :key="i">
          <td>
            <label class="input-group">
              <input type="text" placeholder="0" v-model.number="r.rate" v-maska="'#*.##'" class="input input-bordered input-sm w-20" />
              <span class="text-sm text-info">%</span>
            </label>
          </td>
          <td class="text-center">
            <!-- <div class="form-control"> -->
            <input
              type="radio"
              class="radio radio-xs"
              :value="i"
              v-model="defaultRate"
              @change="useSettings().settings.setDefaultRate(i)"
            />
            <!-- </div> -->
          </td>
          <td></td>
          <td class="text-right">
            <label class="btn btn-ghost btn-circle btn-xs mr-2" @click="useSettings().settings.removeTaxRate(i)">
              <FaIcon icon="fa-xmark" />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-5">
      <button type="button" class="btn btn-xs btn-outline gap-1" @click="useSettings().settings.addTaxRate()">
        <FaIcon icon="fa-add mr-5" />
        Add rate
      </button>
    </div>
  </FormSection>

  <FormSection title="Tax options" description="Tax options allow you to apply taxes to the final calculation, if applicable.">
    <table class="table table-compact w-full m-0">
      <thead>
        <tr>
          <th width="200" class="text-left">Title</th>
          <th width="100">Default</th>
          <th width="100">Applicable</th>
          <th></th>
          <th width="50"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(o, i) in options" :key="i">
          <td>
            <label>
              <input type="text" placeholder="0" v-model="o.title" class="input input-bordered input-sm w-full" />
            </label>
          </td>
          <td class="text-center">
            <input
              type="radio"
              class="radio radio-xs"
              :value="i"
              v-model="defaultOption"
              @change="useSettings().settings.setDefaultOption(i)"
            />
          </td>

          <td class="text-center">
            <input type="checkbox" v-model="o.applicable" class="checkbox checkbox-xs" />
          </td>
          <td></td>
          <td class="text-right">
            <label class="btn btn-ghost btn-circle btn-xs mr-2" @click="useSettings().settings.removeTaxOption(i)">
              <FaIcon icon="fa-xmark" />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-5">
      <button type="button" class="btn btn-xs btn-outline gap-1" @click="useSettings().settings.addTaxOption()">
        <FaIcon icon="fa-add mr-5" />
        Add option
      </button>
    </div>
  </FormSection>
</template>
