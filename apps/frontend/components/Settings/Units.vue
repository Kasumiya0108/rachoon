<script setup>
const units = useSettings().settings.units;
const defaultUnit = ref(units.findIndex((u) => u.default));
</script>
<template>
  <FormSection title="Units" description="Set the units. Default is applied to all new positions.">
    <table class="table table-compact w-full m-0">
      <thead>
        <tr>
          <th width="200" class="text-left">Unit</th>
          <th width="100">Default</th>
          <th></th>
          <th width="50"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, i) in units" :key="i">
          <td>
            <input type="text" placeholder="title" v-model="u.title" class="input input-bordered input-sm" />
          </td>
          <td class="text-center">
            <input
              type="radio"
              class="radio radio-xs"
              :value="i"
              v-model="defaultUnit"
              @change="useSettings().settings.setDefaultUnit(i)"
            />
          </td>
          <td></td>
          <td class="text-right">
            <label class="btn btn-ghost btn-circle btn-xs mr-2" @click="useSettings().settings.removeUnit(i)">
              <FaIcon icon="fa-xmark" />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-5">
      <button class="btn btn-xs btn-outline gap-1" @click="useSettings().settings.addUnit()">
        <FaIcon icon="fa-add mr-5" />
        Add unit
      </button>
    </div>
  </FormSection>
</template>
