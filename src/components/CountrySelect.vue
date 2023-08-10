<script setup lang="ts">
import SupportedCountries from '@/assets/countries.json'
import { computed, type CSSProperties } from 'vue'
import { ref } from 'vue'
import { debounce } from 'lodash'
import { watch } from 'vue'

const itemsList = SupportedCountries.map((name) => {
  return {
    key: name,
    label: name,
    title: name
  }
})
const filteredItems = ref(itemsList)
const selectedCountries = ref(new Array<string>())
const filterKey = ref('')
const hintText = computed(()=>{
  if(props.selectedCountry) return props.selectedCountry
  else return 'input search text'
})

const props = defineProps({
  selectedCountry: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:selectedCountry'])
watch(
  () => props.selectedCountry,
  (newVal) => {
    if (selectedCountries.value[0] != newVal) selectedCountries.value = [newVal]
  }
)
function onClick(params:any)
{
  if(selectedCountries.value[0]==params.key)
  {
    selectedCountries.value=['']
    emits('update:selectedCountry', '')
  }
}
function emitSelect() {
  emits('update:selectedCountry', selectedCountries.value[0])
}
const doSearch = debounce(function (key: string) {
  filteredItems.value = itemsList.filter((item) => {
    return item.key.toLowerCase().indexOf(key) > -1
  })
}, 300)
function onSearch() {
  doSearch(filterKey.value.toLowerCase())
}
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%; width: 100%">
    <a-input-search v-model:value="filterKey" :placeholder="hintText" @change="onSearch" />
    <a-menu
      v-model:selected-keys="selectedCountries"
      mode="inline"
      :multiple="false"
      :items="filteredItems"
      style="overflow-y: auto; flex: 1;border-radius: 4px;"
      @wheel.stop="() => {}"
      @click="onClick"
      @select="emitSelect"
    >
    </a-menu>
  </div>
</template>
