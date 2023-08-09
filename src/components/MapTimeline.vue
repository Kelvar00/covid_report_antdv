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
  selectedCountry:{
    type: String,
    default: ''
  },
  selectedTimelineIndex: {
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
const emit = defineEmits(['update:selectedTimelineIndex', 'update:autoPlay','update:selectedCountry'])
watch(
  () => props.dates,
  (newVal) => {
    setDatesList(newVal)
  },
  { deep: true }
)
watch(
  () => props.selectedTimelineIndex,
  (newVal) => {
    setTimelineSelection(newVal,true)
  }
)
watch(
  () => props.autoPlay,
  (newVal) => {
    setAutoPlay(newVal,true)
  }
)
watch(
  ()=>props.selectedCountry,
  (newVal,oldVal)=>{
    //value changed from parent so we keep silent
    setCountrySelection(newVal,oldVal,true)
  }
)

function setDatesList(dates: Date[]) {
  loadTimeData(dates).then((value) => applyTimeData(value))
}
function setTimelineSelection(arg: number,silent:boolean = false) {
  if (arg === undefined) return
  applyTimelineSelectionByIndex(arg,silent)
}
function setCountrySelection(name:string,oldName:string='',silent:boolean = false){
  if(!name)
  {
    if(oldName)
    {
      //Unselect all
      applyUnselect(oldName,silent)
    }
  }
  else
    applyCountrySelection(name,silent)
}
function setAutoPlay(arg: boolean,silent:boolean = false) {
  applyAutoplay(arg,silent)
}

/// REGION VIEW
import * as echart from 'echarts/core'
import {
  makeTitle,
  makeStateOption,
  makeLoadingOptions,
  useEchartAutoResize,
  type ECOption,
  loadWorldJson,
  makeTimelineStyle
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
      realtime: true,
      ...makeTimelineStyle()
    },
    title: makeTitle('Covid-19 Confirmed Map Timeline'),
    tooltip: {
      trigger: 'item',
      valueFormatter(value) {
        if (Number.isNaN(value)) {
          return 'None or Unknown'
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
        selectedMode: 'single'
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
  chartInstance.showLoading(makeLoadingOptions())
  chartInstance.on('timelinechanged', (params) => {
    emit('update:selectedTimelineIndex', (params as any).currentIndex)
  })
  chartInstance.on('timelineplaychanged', (params) => {
    const state = (params as any).playState
    emit('update:autoPlay', state)
  })
  chartInstance.on('selectchanged',(params:any)=>{
    if(params.selected.length == 1&&params.selected[0].dataIndex.length==1){
      const data = (chartInstance.getOption() as any).series[0].data
      const item = data[params.selected[0].dataIndex[0]]
      emit('update:selectedCountry',item.name)
    }
    else{
      emit('update:selectedCountry','')
    }
  })

  //Setup
  Promise.all([loadTimeData(props.dates), loadWorldJson()]).then((value) => {
    chartInstance.setOption({
      baseOption: makeBaseOption(props.dates)
    })
    applyTimeData(value[0])
    setCountrySelection(props.selectedCountry)
    setTimelineSelection(0)
  })
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
function applyTimelineSelectionByIndex(index: number,silent:boolean = false) {
  chartInstance.dispatchAction({type:'timelineChange',currentIndex:index},{silent:silent})
}
function applyAutoplay(play: boolean,silent:boolean =false) {
  chartInstance.dispatchAction({ type: 'timelinePlayChange', playState: play },{silent:silent})
}
function applyCountrySelection(name:string,silent:boolean=false)
{
  chartInstance.dispatchAction({ type: 'select', seriesIndex: 0, name: name },{silent:silent})
}
function applyUnselect(name:string,silent:boolean=false)
{
  chartInstance.dispatchAction({ type: 'unselect', seriesIndex: 0, name: name },{silent:silent})
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
        value: data.totalConfirmed == 0? NaN:data.totalConfirmed
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
