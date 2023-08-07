import * as echart from 'echarts'
import { toValue, type App, type WatchSource, onMounted, onBeforeUnmount } from 'vue'
import worldJson from '@/assets/world.json'

export function makeTitle(text: string): echart.TitleComponentOption {
  return {
    text: text,
    padding: 20,
    left: 'center',
    textStyle: { color: '#f1f1f1', fontWeight: 'bolder' }
  }
}
export function makeStateOption(
  showLabel: boolean,
  areaColor: echart.Color | undefined = undefined
) {
  return { label: { show: showLabel }, itemStyle: { areaColor: areaColor } }
}
export function makeGridSettings(
  paddingVertical: string,
  paddingHorizonal: string = '5%'
): echart.GridComponentOption {
  return {
    containLabel: true,
    left: paddingHorizonal,
    right: paddingHorizonal,
    top: paddingVertical,
    bottom: paddingVertical
  }
}
export function makeLineSeries(
  displayName: string,
  xDim: string,
  yDim: string,
  color: echart.Color | undefined = undefined,
  tooltipDim: string | undefined = undefined,
  datasetIndex: number = 0
): echart.SeriesOption {
  if (tooltipDim === undefined) tooltipDim = yDim
  return {
    name: displayName,
    type: 'line',
    datasetIndex: datasetIndex,
    showSymbol: false,
    encode: {
      x: xDim,
      y: yDim,
      tooltip: tooltipDim
    },
    itemStyle: {
      color: color
    }
  }
}
export function makeLoadingOptions(
  text: string = 'Loading',
  progressColor: string = '#c23531',
  textColor: string = '#000'
) {
  return {
    text: text,
    color: progressColor,
    textColor: textColor,
    maskColor: 'rgba(255, 255, 255, 0.8)', //YOU CAN MODIFY THIS
    zlevel: 0,

    // 字体大小。从 `v4.8.0` 开始支持。
    fontSize: 12,
    // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
    showSpinner: true,
    // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
    spinnerRadius: 10,
    // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
    lineWidth: 5,
    // 字体粗细。从 `v5.0.1` 开始支持。
    fontWeight: 'normal'
  }
}
export function useEchartAutoResize(
  parentContainerSource: WatchSource<Element>,
  echartInstances: WatchSource<echart.ECharts>[],
  widthHeightRatio: number,
  marginRatio: number = 0.9
) {
  const widthObserver = new ResizeObserver((entries) => {
    if (entries[0].contentBoxSize) {
      const preMarginWidth = entries[0].contentBoxSize[0].inlineSize / echartInstances.length
      const width = preMarginWidth * marginRatio
      const height = width * widthHeightRatio
      for (const item of echartInstances) {
        const chartInstance = toValue(item)
        chartInstance.resize({ width: width, height: height })
      }
    }
  })
  onMounted(() => widthObserver.observe(toValue(parentContainerSource)))
  onBeforeUnmount(() => widthObserver.disconnect())
}
export function loadWorldJson() {
  if (!echart.getMap('world')) {
    echart.registerMap('world', worldJson as any)
  }
}

export default {
  install: function (app: App<any>): App<any> {
    return app
  }
}