<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import * as echart from 'echarts/core'
import { getCountryWeekly, getWorldAtTime } from '@/util/data'
import {
  makeTitle,
  makeStateOption,
  makeBarSeries,
  makeGridSettings,
  makeLoadingOptions,
  useEchartAutoResize,
  loadWorldJson,
  type ECOption
} from '@/util/echart_util'

const option: ECOption = {
  title: makeTitle('Covid-19 Confirmed Map(2022/12/14)'),
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
      color: ['#333300', 'red', '#490505']
    }
  },
  series: [
    {
      name: 'Covid - 19 Confirms',
      type: 'map',
      map: 'world',
      roam: 'move',
      emphasis: makeStateOption(false, 'white'),
      select: makeStateOption(false, 'white'),
      ...makeStateOption(false),
      data: [],
      selectedMode: 'single'
    }
  ]
}

/// REGION COMPONENT INTERACTION
const props = defineProps({
  widthHeightRatio: {
    type: Number,
    default: 0.72
  },
  marginRatio: {
    type: Number,
    default: 0.9
  }
})

/// REGION SETUP
const worldMap: Ref<HTMLSpanElement> = ref(null) as any
const countryChart: Ref<HTMLSpanElement> = ref(null) as any
const chartContainer: Ref<HTMLDivElement> = ref(null) as any
let worldMapInstance: echart.ECharts = null as any
let countryChartInstance: echart.ECharts = null as any

/// REGION CORE LOGIC
function showCountryDetails(selectedCountry: string) {
  const optionHolder: ECOption = {
    legend: { orient: 'horizontal', padding: [50, 5], textStyle: { color: '#f2f2f2' } },
    grid: [
      makeGridSettings('80', '560',"10%",false),
      makeGridSettings('320', '320',"10%",false),
      makeGridSettings('560', '80',"10%",false)
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    axisPointer:{
      link:[{
        xAxisIndex:'all'
      },{
        yAxisIndex:'all'
      }]
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: [0, 1, 2],
        filterMode: 'none',
        minSpan:5
      },
      {
        type: 'inside',
        yAxisIndex: [0, 1, 2],
        filterMode: 'none'
      }
    ],
    xAxis: [
      { type: 'time', gridIndex: 0 },
      { type: 'time', gridIndex: 1 },
      { type: 'time', gridIndex: 2 }
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }, { gridIndex: 2 }],
    color: ['#ff5b57', '#5f79ff', '#880000', '#ba9d7c', '#7ca694']
  }
  countryChartInstance.setOption(optionHolder)
  getCountryWeekly(selectedCountry, new Date(2020, 1, 20), new Date(2022, 12, 14)).then((data) => {
    let dataList = []
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
      dataset: { dimensions: ['time', 'confirmed', 'cured', 'death'], source: dataList },
      series: [
        {
          ...makeBarSeries('Confirmed', 'time', 'confirmed'),
          xAxisIndex:0,
          yAxisIndex:0
        },
        {
          ...makeBarSeries('Cured', 'time', 'cured'),
          xAxisIndex:1,
          yAxisIndex:1
        },
        {
          ...makeBarSeries('Death', 'time', 'death'),
          xAxisIndex:2,
          yAxisIndex:2
        }
      ]
    }
    countryChartInstance.setOption(newOption)
  })
}
function loadMapData() {
  return Promise.all([getWorldAtTime(new Date(2022, 11, 14)), loadWorldJson()])
}

useEchartAutoResize(
  () => chartContainer.value.parentElement!,
  [() => worldMapInstance],
  props.widthHeightRatio,
  props.marginRatio
)
useEchartAutoResize(
  () => chartContainer.value.parentElement!,
  [() => countryChartInstance],
  800,
  props.marginRatio,
  true
)
onMounted(() => {
  worldMapInstance = echart.init(worldMap.value, 'darklow')
  countryChartInstance = echart.init(countryChart.value, 'darklow')
  //showCountryDetails('China')
  worldMapInstance.showLoading(makeLoadingOptions())
  loadMapData().then((value) => {
    let data = value[0]
    let seriesData = []
    for (const item of data) {
      seriesData.push({
        name: item.countryName,
        value: item.totalConfirmed
      })
    }
    worldMapInstance.hideLoading()
    worldMapInstance.setOption(option)
    worldMapInstance.setOption({ series: [{ data: seriesData }] })

    let dataIndex = seriesData.findIndex((it) => it.name == 'China')
    worldMapInstance.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: dataIndex })
  })

  worldMapInstance.on('selectchanged', selectionHandler)
})

function selectionHandler(params: any) {
  if (params.selected.length <= 0) {
    //dont change if no items are selected
    return
  }
  let selected = params.selected[0]
  let data = (worldMapInstance.getOption() as any).series[selected.seriesIndex].data
  let dataIndex = selected.dataIndex[0]
  let selectedCountry = data[dataIndex].name

  showCountryDetails(selectedCountry)
}
</script>
<template>
  <div ref="chartContainer" class="container">
    <span ref="worldMap"></span>
    <span ref="countryChart"></span>
  </div>
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
