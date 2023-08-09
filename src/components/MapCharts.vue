<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import * as echart from 'echarts/core'
import { TotalStatistics, WorldStatistics, getCountryWeekly, getTotalWeekly } from '@/util/data'
import {
  makeTitle,
  makeStateOption,
  makeBarSeries,
  makeGridSettings,
  makeLoadingOptions,
  useEchartAutoResize,
  type ECOption,
  makeLineSeries
} from '@/util/echart_util'
import trendJson from '@/assets/multiTimeline.json'
import moment from 'moment'

/// REGION COMPONENT INTERACTION
const props = defineProps({
  widthHeightRatio: {
    type: Number,
    default: 0.72
  },
  marginRatio: {
    type: Number,
    default: 0.9
  },
  selectedCountry: {
    type: String,
    default: ''
  }
})
watch(
  () => props.selectedCountry,
  (newVal) => {
    showCountryDetails(newVal)
  }
)

/// REGION SETUP
const chartElement: Ref<HTMLSpanElement> = ref(null) as any
let chartInstance: echart.ECharts = null as any

/// REGION CORE LOGIC
function getTrendDataset(tsStart:number,tsStop:number) {
  return {
    dimensions: ['Time', '新型冠狀病毒肺炎', 'CoronaVirus', 'COVID'],
    source: trendJson.filter(item=>{
      const value = moment(item.Time,'yyyy-MM-DD').valueOf()
      return value>=tsStart&&value<=tsStop
    })
  }
}
async function showCountryDetails(selectedCountry: string) {
  let dataList = []
  let data: TotalStatistics[]
  if (selectedCountry)
    data = await getCountryWeekly(selectedCountry, new Date(2019, 11, 1), new Date(2022, 11, 14))
  else data = await getTotalWeekly(new Date(2019, 11, 1), new Date(2022, 11, 14))
  for (const item of data) {
    dataList.push({
      time: new Date(item.timestamp * 1000),
      confirmed: item.totalConfirmed,
      cured: item.totalCured,
      death: item.totalDeath
    })
  }
  const newOption: ECOption = {
    title: makeTitle('Covid-19 Statistics of ' + selectedCountry),
    dataset: [
      getTrendDataset(new Date(2019, 11, 1).valueOf(), new Date(2022, 11, 14).valueOf()),
      { dimensions: ['time', 'confirmed', 'cured', 'death'], source: dataList }
    ],
    series: [
      {
        ...makeBarSeries('Confirmed', 'time', 'confirmed'),
        xAxisIndex: 0,
        yAxisIndex: 0,
        datasetIndex: 1
      },
      {
        ...makeBarSeries('Cured', 'time', 'cured'),
        xAxisIndex: 0,
        yAxisIndex: 0,
        datasetIndex: 1
      },
      {
        ...makeBarSeries('Death', 'time', 'death'),
        xAxisIndex: 0,
        yAxisIndex: 0,
        datasetIndex: 1
      },
      {
        ...makeLineSeries('新型冠狀病毒肺炎', 'time', '新型冠狀病毒肺炎', undefined, undefined, 0),
        xAxisIndex: 1,
        yAxisIndex: 1
      },
      {
        ...makeLineSeries('CoronaVirus', 'time', 'CoronaVirus', undefined, undefined, 0),
        xAxisIndex: 1,
        yAxisIndex: 1
      },
      {
        ...makeLineSeries('COVID', 'time', 'COVID', undefined, undefined, 0),
        xAxisIndex: 1,
        yAxisIndex: 1
      }
    ]
  }
  chartInstance.hideLoading()
  chartInstance.setOption(newOption)
}

useEchartAutoResize(
  () => chartElement.value.parentElement!,
  [() => chartInstance],
  props.widthHeightRatio,
  props.marginRatio
)
onMounted(() => {
  chartInstance = echart.init(chartElement.value, 'darklow')
  const optionHolder: ECOption = {
    legend: { orient: 'horizontal', padding: [50, 5], textStyle: { color: '#f2f2f2' } },
    grid: [
      makeGridSettings('10%', '50%', '10%', false),
      makeGridSettings('50%', '10%', '10%', false)
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        },
        {
          yAxisIndex: 'all'
        }
      ]
    },
    dataset: [
      {
        dimensions: ['Time', '新型冠狀病毒肺炎', 'CoronaVirus', 'COVID']
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: [0, 1],
        filterMode: 'none',
        minSpan: 5
      },
      {
        type: 'inside',
        yAxisIndex: [0, 1],
        filterMode: 'none'
      }
    ],
    xAxis: [
      { type: 'time', gridIndex: 0 },
      { type: 'time', gridIndex: 1 }
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
    color: ['#ff5b57', '#5f79ff', '#880000', '#ba9d7c', '#7ca694']
  }
  chartInstance.setOption(optionHolder)
  chartInstance.showLoading(makeLoadingOptions())
  showCountryDetails(props.selectedCountry)
})
</script>
<template>
  <span ref="chartElement"></span>
</template>
<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
