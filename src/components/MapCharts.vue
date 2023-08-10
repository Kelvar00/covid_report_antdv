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
  useDisableContextMenuIn,
  type ECOption,
  makeLineSeries
} from '@/util/echart_util'
import trendJson from '@/assets/multiTimeline.json'
import moment from 'moment'
import { $eventBus } from '@/util/mitt_util'

const startDate = new Date(2019, 11, 1)
const endDate = new Date(2022, 11, 14)


/// REGION COMPONENT INTERACTION
interface Props{
  heightParameter:number|string
  marginRatio:number
  selectedCountry:string
  dates:Date[]
  selectedTimelineIndex:number
  timeLineAutoplayed:boolean
}
const props = withDefaults( defineProps<Props>(),{
  heightParameter:0.72,
  marginRatio:0.9,
  selectedCountry:'',
  selectedTimelineIndex:0,
  timeLineAutoplayed:false
})

const emit = defineEmits(['update:selectedTimelineIndex'])
watch(
  () => props.selectedCountry,
  (newVal) => {
    showCountryDetails(newVal)
  }
)
watch(
  () => props.selectedTimelineIndex,
  (newVal) => {
    if (!props.timeLineAutoplayed) {
      setDatazoomAround(props.dates[newVal])
    }
  }
)

$eventBus.on('clickUpdate:selectedIndex', (index) => {
  setDatazoomAround(props.dates[index])
})

/// REGION SETUP
const chartElement: Ref<HTMLSpanElement> = ref(null) as any
let chartInstance: echart.ECharts = null as any
let dateToEventMap = new Map<Date,number>()

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
  let title: string = ''
  let dataList = []
  let data: TotalStatistics[]
  if (selectedCountry) {
    title = 'Covid-19 Statistics of ' + selectedCountry
    data = await getCountryWeekly(selectedCountry, startDate, endDate)
  } else {
    title = 'Covid-19 Statistics of the World'
    data = await getTotalWeekly(startDate, endDate)
  }
  for (let i=0;i<data.length;i++) {
    const item = data[i]
    let itemDate = new Date(item.timestamp * 1000)
    dataList.push({
      time: itemDate,
      confirmed: item.totalConfirmed,
      cured: item.totalCured,
      death: item.totalDeath
    })
  }
  const newOption: ECOption = {
    title: makeTitle(title),
    legend: [
      {
        orient: 'horizontal',
        padding: [50, 5],
        textStyle: { color: '#f2f2f2' },
        data: ['Confirmed', 'Cured', 'Death']
      },
      {
        orient: 'horizontal',
        padding: [50, 5],
        textStyle: { color: '#f2f2f2' },
        data: ['新型冠狀病毒肺炎', 'CoronaVirus', 'COVID'],
        top: '45%'
      }
    ],
    dataset: [
      getTrendDataset(startDate.valueOf(), endDate.valueOf()),
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
function setDatazoomAround(date: Date) {
  let length = endDate.valueOf() - startDate.valueOf()
  let startValue = moment(date).add(-12, 'week').add(-date.getDay(), 'd').valueOf()
  let start = (startValue - startDate.valueOf()) / length
  let endValue = moment(date)
    .add(12, 'week')
    .add(7 - date.getDay(), 'd')
    .valueOf()
  let end = (endValue - startDate.valueOf()) / length
  chartInstance.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 0,
    start: start * 100,
    end: end * 100
  })
}
function resumeDatazoom() {
  chartInstance.dispatchAction({ type: 'dataZoom', dataZoomIndex: 0, start: 0, end: 100 })
}

useEchartAutoResize(
  () => chartElement.value.parentElement!,
  [() => chartInstance],
  props.heightParameter,
  props.marginRatio
)
useDisableContextMenuIn(chartElement)
onMounted(() => {
  chartInstance = echart.init(chartElement.value, 'darklow')
  const optionHolder: ECOption = {
    grid: [
      makeGridSettings('10%', '55%', '10%', '5%', false),
      makeGridSettings('55%', '10%', '10%', '5%', false)
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
        filterMode: 'none'
      }
    ],
    xAxis: [
      { type: 'time', gridIndex: 0 },
      { type: 'time', gridIndex: 1 }
    ],
    yAxis: [
      {
        gridIndex: 0,
        axisLabel: {
          formatter(value: number) {
            return value.toExponential()
          }
        }
      },
      { gridIndex: 1 }
    ],
    color: ['#B31312', '#EA906C', '#EEE2DE', '#E8D5B7', '#D9534F','#FFAD60']
  }
  chartInstance.setOption(optionHolder)
  chartInstance.showLoading(makeLoadingOptions())
  showCountryDetails(props.selectedCountry)

  chartInstance.getZr().on('click', (params) => {
    let point = [(params as any).offsetX, (params as any).offsetY]
    let date: Date
    if (chartInstance.containPixel({ gridIndex: 0 }, point)) {
      //bar
      let ts = chartInstance.convertFromPixel({ gridIndex: 0 }, point)[0]
      date = new Date(ts)
    } else if (chartInstance.containPixel({ gridIndex: 1 }, point)) {
      //line
      let ts = chartInstance.convertFromPixel({ gridIndex: 1 }, point)[0]
      date = new Date(ts)
    } else {
      return
    }
    let valueList = props.dates.map((item) => Math.abs(item.valueOf() - date.valueOf()))
    let closest = valueList.indexOf(Math.min(...valueList))

    emit('update:selectedTimelineIndex', closest)
    $eventBus.emit('clickUpdate:selectedIndex', closest)
  })
  chartInstance.getZr().on('contextmenu', () => {
    resumeDatazoom()
  })
})
</script>
<template>
  <span ref="chartElement" style="display: flex; justify-content: center"></span>
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
