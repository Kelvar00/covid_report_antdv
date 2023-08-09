<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import * as echart from 'echarts/core'
import { TotalStatistics, getCountryWeekly, getTotalWeekly } from '@/util/data'
import {
  makeTitle,
  makeBarSeries,
  makeGridSettings,
  makeLoadingOptions,
  useEchartAutoResize,
  type ECOption,
  makeLineSeries
} from '@/util/echart_util'
import trendJson from '@/assets/multiTimeline.json'
import moment from 'moment'
import {$eventBus} from '@/util/mitt_util'

const startDate = new Date(2019, 11, 1)
const endDate = new Date(2022, 11, 14)

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
  },
  dates: {
    type: Array<Date>,
    required: true
  },
  selectedTimelineIndex: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:selectedTimelineIndex'])
watch(
  () => props.selectedCountry,
  (newVal) => {
    showCountryDetails(newVal)
  }
)

$eventBus.on('clickUpdate:selectedIndex',(index)=>{
  setDatazoomAround(props.dates[index])
})

/// REGION SETUP
const chartElement: Ref<HTMLSpanElement> = ref(null) as any
let chartInstance: echart.ECharts = null as any
let isZoomed:boolean = false

/// REGION CORE LOGIC
function getTrendDataset(tsStart: number, tsStop: number) {
  return {
    dimensions: ['Time', '新型冠狀病毒肺炎', 'CoronaVirus', 'COVID'],
    source: trendJson.filter((item) => {
      const value = moment(item.Time, 'yyyy-MM-DD').valueOf()
      return value >= tsStart && value <= tsStop
    })
  }
}
async function showCountryDetails(selectedCountry: string) {
  let dataList = []
  let data: TotalStatistics[]
  if (selectedCountry) data = await getCountryWeekly(selectedCountry, startDate, endDate)
  else data = await getTotalWeekly(startDate, endDate)
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
      getTrendDataset(startDate.valueOf(), endDate.valueOf()),
      { dimensions: ['time', 'confirmed', 'cured', 'death'], source: dataList }
    ],
    series: [
      makeLineSeries('新型冠狀病毒肺炎', 'time', '新型冠狀病毒肺炎', undefined, undefined, 0),
      makeLineSeries('CoronaVirus', 'time', 'CoronaVirus', undefined, undefined, 0),
      makeLineSeries('COVID', 'time', 'COVID', undefined, undefined, 0),
      {
        ...makeBarSeries('Confirmed', 'time', 'confirmed'),
        stack: 'total',
        xAxisIndex: 1,
        yAxisIndex: 1,
        datasetIndex: 1
      },
      {
        ...makeBarSeries('Cured', 'time', 'cured'),
        stack: 'total',
        xAxisIndex: 1,
        yAxisIndex: 1,
        datasetIndex: 1
      },
      {
        ...makeBarSeries('Death', 'time', 'death'),
        stack: 'total',
        xAxisIndex: 1,
        yAxisIndex: 1,
        datasetIndex: 1
      }
    ]
  }
  chartInstance.hideLoading()
  chartInstance.setOption(newOption)
}
function setDatazoomAround(date: Date) {
  isZoomed = true
  let length = endDate.valueOf() - startDate.valueOf()
  let startValue = moment(date).add(-12, 'week').add(-date.getDay(), 'd').valueOf()
  let start = (startValue - startDate.valueOf()) / length
  let endValue = moment(date).add(12, 'week').add(7 - date.getDay(), 'd').valueOf()
  let end = (endValue - startDate.valueOf()) / length
  chartInstance.dispatchAction({ type: 'dataZoom', dataZoomIndex:0, start: start * 100, end: end * 100 })
}
function resumeDatazoom() {
  isZoomed = false
  chartInstance.dispatchAction({ type: 'dataZoom', dataZoomIndex:0, start: 0, end: 100 })
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
        filterMode: 'filter',
        minSpan: 5
      },
      {
        type: 'inside',
        yAxisIndex: [0, 1],
        filterMode: 'empty'
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

  chartInstance.on('click', (params) => {
    let seriesType = (params as any).seriesType
    let data = (params as any).data
    let date: Date
    if (seriesType == 'line') {
      // trend chart
      date = moment((data as any).Time, 'yyyy-MM-DD').toDate()
    } else {
      date = (data as any).time
    }
    let valueList = props.dates.map((item) => Math.abs(item.valueOf() - date.valueOf()))
    let closest = valueList.indexOf(Math.min(...valueList))

    emit('update:selectedTimelineIndex', closest)
    $eventBus.emit('clickUpdate:selectedIndex',closest)
  })
  chartInstance.getZr().on('dblclick', (event) => {
    if (!event.target) {
      resumeDatazoom()
    }
  })
  chartInstance.on('datazoom', (params) => {
    console.log(params)
    const { startValue, endValue } = (chartInstance.getOption() as any).dataZoom[0]
  })
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
