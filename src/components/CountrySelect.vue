<script setup lang="ts">
import SupportedCountries from '@/assets/countries.json'
import { computed } from 'vue';
import { ref } from 'vue';
import { debounce } from 'lodash'

const itemsList = SupportedCountries.map(name=>{
    return {
    key:name,
    label:name,
    title:name
}
})
const doSearch = debounce(function(key:string){
    filteredItems.value = itemsList.filter(item=>{
        return item.key.toLowerCase().indexOf(key)>-1
    })
},300)
function onSearch(e:any)
{
    doSearch(filterKey.value)
}
const filteredItems = ref(itemsList)
const selectedCountries = ref(new Array<string>())
const filterKey = ref('')
</script>

<template>
    <div style="display: flex;flex-direction: column;height: 100%;width: 100%;">
        <a-input-search
            v-model:value="filterKey"
            placeholder="input search text"
            @change="onSearch"
        />
        <a-menu
            v-model:selected-keys="selectedCountries"
            mode="inline"
            :items="filteredItems"
            style="overflow-y: auto;flex: 1;"
            @wheel.stop="()=>{ }"
        >

        </a-menu>
    </div>
</template>