<script setup lang="ts">
import { watch, ref, type Ref, onMounted } from 'vue'
/// REGION VIEWMODEL
interface Props{
  dates: Date[]
  heightParameter: number|string
  marginRatio: number
  selectedCountry:string
  selectedTimelineIndex: number
  autoPlay: boolean
  playInterval: number
}
const props = withDefaults(defineProps<Props>(),{
  heightParameter:0.75,
  marginRatio:1,
  selectedCountry:'',
  selectedTimelineIndex:0,
  autoPlay:false,
  playInterval:5000
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
  makeStateOption,
  makeLoadingOptions,
  useEchartAutoResize,
  useDisableContextMenuIn,
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
      ...makeTimelineStyle(),
      top: 0
    },
    //title: makeTitle('Covid-19 Confirmed Map Timeline',60),
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
      textStyle: { color: '#ff0000' },
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#F59F9F',  '#DE1E1D', '#B31312'] // YOU CAN MODIFY THIS
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
        animation: true,
        universalTransition: true,
        selectedMode: 'single'
      }
    ]
  }
}

let timelineChanged:boolean = false

useEchartAutoResize(
  () => chartElement.value.parentElement!,
  [() => chartInstance],
  props.heightParameter,
  props.marginRatio,
  onResized
)
useDisableContextMenuIn(chartElement)
onMounted(() => {
  chartInstance = echart.init(chartElement.value, 'darklow')
  chartInstance.showLoading(makeLoadingOptions())
  chartInstance.on('timelinechanged', (params) => {
    timelineChanged = true
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
      if(timelineChanged)
      {
        timelineChanged = false
        let curr = (chartInstance.getOption() as any).timeline[0].currentIndex
        if(params.selected[0].dataIndex[0] == curr)
        {
          // THIS MUST BE WRONG,IGNORE IT
          setCountrySelection(props.selectedCountry,item.name,true)
          return
        }
      }
      if(props.selectedCountry!=item.name)
        emit('update:selectedCountry',item.name)
    }
    else{
      emit('update:selectedCountry','')
    }
  })
  chartInstance.getZr().on('contextmenu',()=>{
    applyUnselect(props.selectedCountry)
  })

  //Setup
  Promise.all([loadTimeData(props.dates), loadWorldJson()]).then((value) => {
    chartInstance.setOption({
      baseOption: makeBaseOption(props.dates)
    })
    applyTimeData(value[0])
    setCountrySelection(props.selectedCountry,'',true)
    setTimelineSelection(props.selectedTimelineIndex,true)
  })
})
function onResized(){
  const visualMapHeight = chartInstance.getHeight()*0.32
  chartInstance.setOption({visualMap:{itemHeight:visualMapHeight}}as ECOption)
}

function applyTimeData(dataset: DateData[]) {
  let option: ECOption = {
    baseOption: {
      ...makeBaseOption(dataset.map((item) => item.date))
    },
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function applyUnselectForce(silent:boolean=false)
{
  const data = (chartInstance.getOption() as any).series[0].data
  for(let i=0;i<data.length;i++)
    chartInstance.dispatchAction({ type: 'unselect', seriesIndex: 0, dataIndex: i },{silent:silent})
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
    for (let i=0;i< raw.length;i++) {
      const data = raw[i]
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
  <span ref="chartElement" style="display: flex;justify-content: center;"></span>
</template>
