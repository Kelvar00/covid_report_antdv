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
  TransformComponent,
  AxisPointerComponent
} from 'echarts/components'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  TimelineComponentOption,
  GridComponentOption,
  LegendComponentOption,
  DataZoomComponentOption,
  DatasetComponentOption,
  VisualMapComponentOption,
  AxisPointerComponentOption
} from 'echarts/components'
import {
  type LineSeriesOption,
  type MapSeriesOption,
  type BarSeriesOption,
  MapChart,
  LineChart,
  BarChart
} from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { toValue, type App, type WatchSource, onMounted, onBeforeUnmount } from 'vue'
import darklow from '@/assets/theme/darklow.json'

export function makeTitle(
  text: string,
  paddingTop: string | number = 'auto'
): TitleComponentOption {
  return {
    text: text,
    padding: 20,
    top: paddingTop,
    left: 'center',
    textStyle: { color: darklow.theme.titleColor, fontWeight: 'bolder' }
  }
}
export function makeStateOption(showLabel: boolean, areaColor?: echart.Color) {
  return { label: { show: showLabel }, itemStyle: { areaColor: areaColor } }
}
export function makeGridSettings(
  paddingTop: string,
  paddingBottom?: string,
  paddingLeft: string = '5%',
  paddingRight?: string,
  containLabel: boolean = true
): GridComponentOption {
  return {
    containLabel: containLabel,
    left: paddingLeft,
    right: paddingRight ? paddingRight : paddingLeft,
    top: paddingTop,
    bottom: paddingBottom ? paddingBottom : paddingTop
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
export function makeBarSeries(
  displayName: string,
  xDim: string,
  yDim: string,
  color?: echart.Color,
  tooltipDim?: string,
  datasetIndex: number = 0
): BarSeriesOption {
  if (tooltipDim === undefined) tooltipDim = yDim
  return {
    name: displayName,
    type: 'bar',
    datasetIndex: datasetIndex,
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
      color: lineColor ? lineColor : darklow.theme.timelineLineColor
    },
    itemStyle: {
      color: itemColor ? itemColor : darklow.theme.timelineItemColor
    },
    checkpointStyle: {
      color: checkpointColor ? checkpointColor : darklow.theme.timelineCheckColor,
      borderColor: darklow.theme.timelineCheckBorderColor
    },
    controlStyle: {
      color: controlColor ? controlColor : darklow.theme.timelineCheckColor,
      borderColor: darklow.theme.timelineControlBorderColor
    },
    progress: {
      lineStyle: {
        color: lineColor ? lineColor : darklow.theme.timelineLineColor
      },
      itemStyle: {
        color: itemColor ? itemColor : darklow.theme.timelineItemColor
      }
    },
    emphasis: {
      itemStyle: {
        color: itemColor ? itemColor : darklow.theme.timelineItemColor
      },
      checkpointStyle: {
        color: checkpointColor ? checkpointColor : darklow.theme.timelineCheckColor,
        borderColor: darklow.theme.timelineCheckBorderColor
      },
      controlStyle: {
        color: controlColor ? controlColor : darklow.theme.timelineCheckColor,
        borderColor: darklow.theme.timelineControlBorderColor
      }
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
  heightParameter: number | string,
  marginRatio: number = 0.9,
  resizedCallback?: (instance: echart.ECharts) => void
) {
  const widthObserver = new ResizeObserver((entries) => {
    if (entries[0].contentBoxSize) {
      const preMarginWidth = entries[0].contentBoxSize[0].inlineSize / echartInstances.length
      const preMarginHeight = entries[0].contentBoxSize[0].blockSize
      const width = preMarginWidth * marginRatio
      let height: number
      if (typeof heightParameter == 'number') {
        height = width * heightParameter
      } else {
        if (heightParameter.endsWith('px')) {
          height = Number.parseFloat(heightParameter.slice(0, -2))
        } else if (heightParameter.endsWith('vh')) {
          height =
            (Number.parseFloat(heightParameter.slice(0, -2)) * document.body.clientHeight) / 100
        } else if (heightParameter.endsWith('%')) {
          height = (Number.parseFloat(heightParameter.slice(0, -1)) / 100) * preMarginHeight
        } else {
          height = 0
        }
      }
      for (const item of echartInstances) {
        const chartInstance = toValue(item)
        chartInstance.resize({ width: width, height: height })
        if (resizedCallback) resizedCallback(chartInstance)
      }
    }
  })
  onMounted(() => widthObserver.observe(toValue(parentContainerSource)))
  onBeforeUnmount(() => widthObserver.disconnect())
}
export function useDisableContextMenuIn(containerSource: WatchSource<Element>) {
  const handler = function (ev: MouseEvent) {
    const container = toValue(containerSource)
    if (container.contains(ev.target as Node)) ev.preventDefault()
  }
  onMounted(() => document.addEventListener('contextmenu', handler))
  onBeforeUnmount(() => document.removeEventListener('contextmenu', handler))
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
  | AxisPointerComponentOption
  | LineSeriesOption
  | MapSeriesOption
  | BarSeriesOption
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
      AxisPointerComponent,
      MapChart,
      LineChart,
      BarChart,
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
