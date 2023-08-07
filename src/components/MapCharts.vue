<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import * as echart from 'echarts'
import worldJson from '@/assets/world.json'
import { getCountryWeekly, getWorldAtTime } from '@/util/data'
import {
  makeTitle,
  makeStateOption,
  makeLineSeries,
  makeGridSettings,
  makeLoadingOptions,
  useEchartAutoResize
} from '@/util/echart_util'

echart.registerMap('world', JSON.stringify(worldJson))

const option: echart.EChartsOption = {
  backgroundColor: '#000000',
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
      color: ['grey', 'red', '#490505']
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
      itemStyle: {
        areaColor: '#000000'
      }
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
  const optionHolder: echart.EChartsOption = {
    legend: { orient: 'horizontal', padding: [50, 5] },
    grid: makeGridSettings('10%'),
    tooltip: { trigger: 'axis' },
    dataZoom: [
      {
        id: 'DataZoomX',
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'empty'
      },
      {
        id: 'DataZoomY',
        type: 'inside',
        yAxisIndex: [0],
        filterMode: 'empty'
      }
    ],
    xAxis: { type: 'time' },
    yAxis: {},
    color: ['#ff5b57', '#5f79ff', '#880000', '#ba9d7c', '#7ca694'],
    backgroundColor: '#000000'
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
    const newOption: echart.EChartsOption = {
      title: makeTitle('Covid-19 Statistics of ' + selectedCountry),
      dataset: { dimensions: ['time', 'confirmed', 'cured', 'death'], source: dataList },
      series: [
        makeLineSeries('Confirmed', 'time', 'confirmed'),
        makeLineSeries('Cured', 'time', 'cured'),
        makeLineSeries('Death', 'time', 'death')
      ]
    }
    countryChartInstance.setOption(newOption)
  })
}

getWorldAtTime(new Date(2022, 11, 14)).then((data) => {
  //console.log(data)
  let seriesData = []
  for (const item of data) {
    seriesData.push({
      name: item.countryName,
      value: item.totalConfirmed
    })
  }
  worldMapInstance.hideLoading()
  worldMapInstance.setOption({ series: [{ data: seriesData }] })
  worldMapInstance.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: 0 })
})

useEchartAutoResize(
  () => chartContainer.value.parentElement!,
  [() => worldMapInstance, () => countryChartInstance],
  props.widthHeightRatio,
  props.marginRatio
)
onMounted(() => {
  worldMapInstance = echart.init(worldMap.value, 'dark')
  countryChartInstance = echart.init(countryChart.value, 'darklow')
  worldMapInstance.setOption(option)
  showCountryDetails('China')
  worldMapInstance.showLoading(makeLoadingOptions())

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
  display: flex;
  justify-content: space-around;
}
</style>