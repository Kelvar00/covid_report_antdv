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
    default: 0.72
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
  applyTimeData(dates)
}
function setSelection(arg: number | undefined) {
  if (arg === undefined) return
  applySelectionByIndex(arg)
}
function setAutoPlay(arg: boolean) {
  applyAutoplay(arg)
}

/// REGION VIEW
import * as echart from 'echarts'
import {
  makeTitle,
  makeLineSeries,
  makeGridSettings,
  makeLoadingOptions,
  useEchartAutoResize
} from '@/util/echart_util'
import trendJson from '@/assets/multiTimeline.json'

import moment from 'moment'

const chartElement: Ref<HTMLDivElement> = ref(null) as any
let chartInstance: echart.ECharts = null as any

function makeBaseOption(timelineDots: Date[]): echart.EChartsOption {
  let dataSets = []
  for (const date of timelineDots) {
    let dateString = moment(date).format('yyyy-MM-DD')
    let index = trendJson.findIndex((item) => item.Time == dateString)
    let dataSource = []
    for (let i = index - 50; i <= index + 50; i++) {
      if (i >= 0 && i < trendJson.length) dataSource.push(trendJson[i])
    }
    dataSets.push({
      dimensions: ['Time', '新型冠狀病毒肺炎', 'CoronaVirus', 'COVID'],
      source: dataSource
    })
  }
  return {
    timeline: {
      axisType: 'category',
      autoPlay: props.autoPlay,
      playInterval: props.playInterval,
      data: timelineDots.map((dat) => moment(dat).format('yyyy-MM-DD')),
      realtime: true
    },
    legend: { orient: 'horizontal', padding: [50, 5], textStyle: { color: '#f2f2f2' } },
    grid: makeGridSettings('10%'),
    title: {
      ...makeTitle('Covid-19 Trend Timeline')
    },
    tooltip: {
      trigger: 'axis'
    },
    dataset: dataSets,
    xAxis: { type: 'time' },
    yAxis: {},
    series: []
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
  chartInstance.showLoading(makeLoadingOptions())
  chartInstance.on('timelinechanged', (params) => {
    emit('update:selectedIndex', (params as any).currentIndex)
  })
  chartInstance.on('timelineplaychanged', (params) => {
    const state = (params as any).playState
    if(props.autoPlay!=state)
      emit('update:autoPlay', state)
  })

  /// Action
  setDatesList(props.dates)
  setSelection(0)
})
function applyTimeData(dates: Date[]) {
  let option: echart.EChartsOption = {
    baseOption: makeBaseOption(dates),
    options: dates.map((_, index) => {
      return {
        series: [
          makeLineSeries(
            '新型冠狀病毒肺炎',
            'time',
            '新型冠狀病毒肺炎',
            undefined,
            undefined,
            index
          ),
          makeLineSeries('CoronaVirus', 'time', 'CoronaVirus', undefined, undefined, index),
          makeLineSeries('COVID', 'time', 'COVID', undefined, undefined, index)
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
    } as echart.EChartsOption)
  }
}
function applyAutoplay(play: boolean) {
  chartInstance.dispatchAction({ type: 'timelinePlayChange', playState: play })
}
</script>

<template>
  <span ref="chartElement"></span>
</template>
