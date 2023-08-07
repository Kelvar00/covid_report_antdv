<script setup lang="ts">
declare var require: any
import { ref, onMounted, type CSSProperties } from 'vue'
import fullpage from 'fullpage.js'
import Image1 from '@/assets/img/T22.png'
import Image2 from '@/assets/img/T23.png'
import Image3 from '@/assets/img/T24.png'
import Image4 from '@/assets/img/T25.png'

const dates = ref([new Date(2020, 1, 2), new Date(2020, 3, 26), new Date(2020, 5, 14)])
const selectedDate = ref(dates.value[0])
const selectedIndex = ref(0)

const carouseData = [{ url: Image1 }, { url: Image2 }, { url: Image3 }, { url: Image4 }]
const options = {
  licenseKey: 'GPL v3',
  scrollOverflow: true,
  scrollBar: false,
  //menu: '#menu',
  navigation: true,
  anchors: ['page1', 'page2', 'page3'],

  sectionsColor: [
    '#41b883',
    '#ff5f45',
    '#0798ec',
    '#fec401',
    '#1bcee6',
    '#ee1a59',
    '#2c3e4f',
    '#ba5be9',
    '#b4b8ab'
  ]
}
const activities = [
  {
    content: 'Event start',
    timestamp: '2018-04-15'
  },
  {
    content: 'Approved',
    timestamp: '2018-04-13'
  },
  {
    content: 'Success',
    timestamp: '2018-04-11'
  }
]
onMounted(() => {
  let fullPageInstance = new fullpage('#fullpage', {
    licenseKey: 'GPLv3',
    navigation: true,
    responsiveWidth: 800,
    sectionsColor: [
      'transparent',
      '#666666ff',
      '#000000aa',
      '#000000',
      '#2b0909',
      '#0d0000',
      '#001a2c',
      '#002137',
      '#002945',
      '#003356',
      '#003a61'
    ]
  })
})

import MapCharts from './components/MapCharts.vue'
import MapTimeline from './components/MapTimeline.vue'
import TrendTimeline from './components/TrendTimeline.vue'
//import { requiredNumber } from 'element-plus/es/components/table-v2/src/common.js';
const transparentStyle: CSSProperties = {
  color: 'transoarent',
  backgroundColor: 'transparent'
}
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: 'transparent',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: 'transparent'
}

const contentStyle: CSSProperties = {
  textAlign: 'center',
  color: '#00000000',
  backgroundColor: 'transparent'
}

const siderStyle: CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9'
}

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea'
}
</script>

<template>
  <a-carousel indicator-position="none" style="width: 100%; height: 100%; position: absolute" :autoplay="true">
    <div v-for="item in carouseData" :key="item">
      <img :src="item.url" alt="" style="object-fit: initial; height: 100%; width: 100%" />
    </div>
  </a-carousel>
  <div id="fullpage">
    <div class="section">
      <a-layout :style="transparentStyle">
        <a-layout-header :style="headerStyle">
          <div style="
              text-align: center;
              font-size: 50px;
              color: aqua;
              font-family: 'Courier New', Courier, monospace;
              z-index: 2;
            ">
            R . I . P
          </div>
        </a-layout-header>
        <a-layout-content :style="contentStyle">
          <div style="margin-bottom: 200px"><a-col :span="24"></a-col></div>
        </a-layout-content>
        <a-layout-content :style="contentStyle">
          <div class="scroll_content">
            <div class="content-padding-1">
              <a-col :span="24"> </a-col>
            </div>
            <a-row style="max-width: 100vw" :gutter="12">
              <a-col :span="8">
                <div class="statistic-card">
                  <a-statistic :value="168983095">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">confirmed cases</div>
                    </template>
                  </a-statistic>
                  <div class="statistic-footer">
                    <div class="footer-item">
                      <span>Lat update:2 August 2023 at 07:56 pm GMT+8</span>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="statistic-card">
                  <a-statistic :value="6953743">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">Confirmed deaths</div>
                    </template>
                  </a-statistic>
                  <div class="statistic-footer">
                    <div class="footer-item">
                      <span>Lat update:2 August 2023 at 07:56 pm GMT+8</span>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="statistic-card">
                  <a-statistic :value="13492099754" title="New transactions today">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        Vaccine doses administrated
                      </div>
                    </template>
                  </a-statistic>
                  <div class="statistic-footer">
                    <div class="footer-item">
                      <span>Last update: 30 July 2023</span>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-layout-content>
      </a-layout>
    </div>

    <div class="section">
      <a-row style="margin-bottom: 50px;">
        <a-col :span="8" :offset="2">
          <MapTimeline :width-height-ratio="0.6" :dates="dates" :auto-play="true" :play-interval="10000"
            v-model:selected-date="selectedDate" v-model:selected-index="selectedIndex" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4" style="align-items: center;" :offset="2">
          <div>
            <a-steps direction="vertical" v-model:current="selectedIndex" :items="[
              {
                title: 'Finished',
                description: '',
              },
              {
                title: 'In Progress',
                description: '',
              },
              {
                title: 'Waiting',
                description: '',
              },
              {
                title: 'Waiting',
                description: '',
              },
            ]">
              <template #progressDot="{ index, status, prefixCls }" style="margin-top: 40px;">
                <a-popover>
                  <template #content>
                    <span>step {{ index }} status: {{ status }}</span>
                  </template>
                  <span :class="`${prefixCls}-icon-dot`" />
                </a-popover>
              </template>
            </a-steps>
          </div>
        </a-col>
        <a-col :span="10" :offset="6">
          <div>
            <TrendTimeline :width-height-ratio="0.5" :dates="dates" v-model:selected-date="selectedDate"
              v-model:selected-index="selectedIndex" />
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="section">
      <div class="chart-map">
        <MapCharts :width-height-ratio="0.72" :margin-ratio="0.9" />
      </div>
    </div>
    <div class="section">Some section</div>
  </div>
</template>

<style lang="scss">
.transparent_content {
  color: 'transparent';
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.content-padding-1 {
  margin-bottom: 200px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: #ffffff;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: black;
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.box-card {
  width: auto;
  padding: 0;
}

.side-card-box {
  width: 480px;
  border-radius: 0px;
}

.scroll_content {
  overflow-x: hidden;
}
</style>
