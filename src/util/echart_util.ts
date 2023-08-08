import * as echart from 'echarts/core'
import type { ComposeOption } from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  TimelineComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  DatasetComponent,
  VisualMapComponent,
  TransformComponent
} from 'echarts/components'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  TimelineComponentOption,
  GridComponentOption,
  LegendComponentOption,
  DataZoomComponentOption,
  DatasetComponentOption,
  VisualMapComponentOption
} from 'echarts/components'
import { type LineSeriesOption, type MapSeriesOption, MapChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { toValue, type App, type WatchSource, onMounted, onBeforeUnmount } from 'vue'
import darklow from '@/assets/theme/darklow.json'

export function makeTitle(text: string): TitleComponentOption {
  return {
    text: text,
    padding: 20,
    left: 'center',
    textStyle: { color: '#f1f1f1', fontWeight: 'bolder' }
  }
}
export function makeStateOption(showLabel: boolean, areaColor?: echart.Color) {
  return { label: { show: showLabel }, itemStyle: { areaColor: areaColor } }
}
export function makeGridSettings(
  paddingVertical: string,
  paddingHorizonal: string = '5%'
): GridComponentOption {
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
  color?: echart.Color,
  tooltipDim?: string,
  datasetIndex: number = 0
): LineSeriesOption {
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
export function makeTimelineStyle(
  lineColor?: echart.Color,
  itemColor?: echart.Color,
  checkpointColor?: echart.Color,
  controlColor?: echart.Color
): TimelineComponentOption {
  return {
    lineStyle: {
      color: lineColor
    },
    itemStyle: {
      color: itemColor
    },
    checkpointStyle: {
      color: checkpointColor
    },
    controlStyle: {
      color: controlColor
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
export type ECOption = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | TimelineComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
  | DatasetComponentOption
  | VisualMapComponentOption
  | LineSeriesOption
  | MapSeriesOption
>

let worldJsonTask: Promise<void>
export function loadWorldJson() {
  return worldJsonTask
}

const EChartUtils = {
  install: function (app: App<any>): App<any> {
    echart.use([
      TitleComponent,
      TooltipComponent,
      TimelineComponent,
      GridComponent,
      LegendComponent,
      DataZoomComponent,
      DatasetComponent,
      VisualMapComponent,
      TransformComponent,
      MapChart,
      LineChart,
      CanvasRenderer
    ])
    echart.registerTheme('darklow', darklow.theme)
    worldJsonTask = import('@/assets/world.json').then((worldJson) => {
      echart.registerMap('world', worldJson as any)
    })
    return app
  }
}
export default EChartUtils
