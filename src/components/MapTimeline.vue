<script setup lang="ts">
import { watch, ref, type Ref, onMounted } from 'vue'
/// REGION VIEWMODEL
const props = defineProps({
  dates: {
    required: true,
    type: Array<Date>,
    default: () => []
  },
  widthHeightRatio: {
    type: Number,
    default: 0.75
  },
  marginRatio: {
    type: Number,
    default: 1
  },
  selectedIndex: {
    type: Number,
    default: 0
  },
  autoPlay: {
    type: Boolean,
    default: false
  },
  playInterval: {
    type: Number,
    default: 5000
  }
})
const emit = defineEmits(['update:selectedIndex', 'update:autoPlay'])
watch(
  () => props.dates,
  (newVal) => {
    setDatesList(newVal)
  },
  { deep: true }
)
watch(
  () => props.selectedIndex,
  (newVal) => {
    setSelection(newVal)
  }
)
watch(
  () => props.autoPlay,
  (newVal) => {
    setAutoPlay(newVal)
  }
)

function setDatesList(dates: Date[]) {
  loadTimeData(dates).then((value) => applyTimeData(value))
}
function setSelection(arg: number | undefined) {
  if (arg === undefined) return
  applySelectionByIndex(arg)
}
function setAutoPlay(arg: boolean) {
  applyAutoplay(arg)
}

/// REGION VIEW
import * as echart from 'echarts/core'
import {
  makeTitle,
  makeStateOption,
  makeLoadingOptions,
  useEchartAutoResize,
  type ECOption
} from '@/util/echart_util'
import moment from 'moment'

const chartElement: Ref<HTMLDivElement> = ref(null) as any
let chartInstance: echart.ECharts = null as any

function makeBaseOption(timelineDots: Date[]): ECOption {
  return {
    timeline: {
      axisType: 'category',
      autoPlay: props.autoPlay,
      playInterval: props.playInterval,
      data: timelineDots.map((item) => moment(item).format('yyyy-MM-DD')),
      realtime: true
    },
    title: makeTitle('Covid-19 Confirmed Map Timeline'),
    tooltip: {
      trigger: 'item',
      valueFormatter(value) {
        if (Number.isNaN(value)) {
          return 'Unknown'
        } else return value.toString()
      }
    },
    visualMap: {
      min: 0,
      max: 10000000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#ff6666', '#ff0000', '#990000'] // YOU CAN MODIFY THIS
      }
    },
    series: [
      {
        name: 'Covid - 19 Confirms',
        type: 'map',
        map: 'world',
        roam: true,
        emphasis: makeStateOption(false, 'white'),
        select: makeStateOption(false, 'white'),
        ...makeStateOption(false),
        data: [],
        animation: true,
        universalTransition: true,
        selectedMode: false
      }
    ]
  }
}

useEchartAutoResize(
  () => chartElement.value.parentElement!,
  [() => chartInstance],
  props.widthHeightRatio,
  props.marginRatio
)
onMounted(() => {
  chartInstance = echart.init(chartElement.value, 'darklow')
  chartInstance.setOption({
    baseOption: makeBaseOption(props.dates)
  })
  chartInstance.showLoading(makeLoadingOptions())
  chartInstance.on('timelinechanged', (params) => {
    emit('update:selectedIndex', (params as any).currentIndex)
  })
  chartInstance.on('timelineplaychanged', (params) => {
    const state = (params as any).playState
    if (props.autoPlay != state) emit('update:autoPlay', state)
  })

  /// Action
  setDatesList(props.dates)
  setSelection(0)
})
function applyTimeData(dataset: DateData[]) {
  let option: ECOption = {
    baseOption: makeBaseOption(dataset.map((item) => item.date)),
    options: dataset.map((item) => {
      return {
        series: [
          {
            data: item.data,
            universalTransition: true,
            animation: true,
            animationDurationUpdate: 1000
          }
        ]
      }
    })
  }
  chartInstance.hideLoading()
  chartInstance.setOption(option)
}
function applySelectionByIndex(index: number) {
  let option = chartInstance.getOption() as any
  let currIndex = option.timeline[0].currentIndex!
  let data = option.timeline[0].data as any[]
  if (currIndex != index) {
    if (index > data.length) throw new RangeError('Date out of available list!')
    chartInstance.setOption({
      baseOption: {
        timeline: {
          currentIndex: index
        }
      }
    } as ECOption)
  }
}
function applyAutoplay(play: boolean) {
  chartInstance.dispatchAction({ type: 'timelinePlayChange', playState: play })
}

/// REGION MODEL
class DateData {
  date: Date = new Date()
  data: Array<{ name: string; value: number }> = []
}

import { getWorldAtTime } from '@/util/data'
async function loadTimeData(dates: Date[]): Promise<DateData[]> {
  let promisesList = []
  async function queryData(date: Date) {
    let raw = await getWorldAtTime(date)
    let seriesData = []
    for (const data of raw) {
      seriesData.push({
        name: data.countryName,
        value: data.totalConfirmed
      })
    }
    return {
      date: date,
      data: seriesData
    }
  }
  for (const date of dates) {
    promisesList.push(queryData(date))
  }
  let results = await Promise.all(promisesList)
  return results.sort((a, b) => a.date.valueOf() - b.date.valueOf())
}
</script>

<template>
  <span ref="chartElement"></span>
</template>
