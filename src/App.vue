<script setup lang="ts">
import keyMoments from '@/assets/keyMoments.json'
import { h,ref, onMounted, type CSSProperties } from 'vue'
import fullpage from 'fullpage.js'
import Image1 from '@/assets/img/T22.png'
import Image2 from '@/assets/img/T23.png'
import Image3 from '@/assets/img/T24.png'
import Image4 from '@/assets/img/T25.png'
import { type MenuProps } from 'ant-design-vue'
const dates = ref(keyMoments.map(item => moment(item.Time, 'yyyy-MM-DD').toDate()))

const selectedIndex = ref(0)
const autoPlay = ref(true)

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
const pages = ref<string[]>(['page1']);
const page_items = ref<MenuProps['items']>([
  {
    key: 'page1',
    label: h('a',{href:'#page1'},'page1'),
    title:'page1'
  }, 
  {
    key: 'page2',
    label: h('a',{href:'#page2'},'page2'),
    title:'page1'
  },
  {
    key: 'page3',
    label: h('a',{href:'#page3'},'page3'),
    title:'page3'
},

])
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
    ],
    anchors: ['page1', 'page2', 'page3'],
  })
})

import MapCharts from './components/MapCharts.vue'
import MapTimeline from './components/MapTimeline.vue'
import TrendTimeline from './components/TrendTimeline.vue'
import moment from 'moment'
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
    <div v-for="(item, index) in carouseData" :key="index">
      <img :src="item.url" alt="" style="object-fit: initial; height: 100%; width: 100%" />
    </div>
  </a-carousel>
  <div
    style="font-size: 30px;background-color: antiquewhite;z-index: 100;display: flex;position: absolute;right: 0%;"
  >
  <a-menu v-model:selectedKeys="pages" mode="horizontal" :items="page_items"/>
      </div>
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
      <a-row style="margin-bottom: 50px">
        <a-col :span="8" :offset="2">
          <MapTimeline :width-height-ratio="0.6" :dates="dates" :play-interval="10000"
            v-model:selected-index="selectedIndex" v-model:auto-play="autoPlay" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4" style="align-items: center" :offset="2">
          <div class="scroll_event">
            <a-steps direction="vertical" v-model:current="selectedIndex" :items="keyMoments.map((item) => { return { title: item.event, description: item.Time + ' ' + item.comment } })
              ">
              <template #progressDot="{ index, status, prefixCls }">
                <a-popover style="margin-top: 40px">
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
            <TrendTimeline :width-height-ratio="0.5" :dates="dates" v-model:selected-index="selectedIndex"
              v-model:auto-play="autoPlay" />
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

.scroll_event {
  height: 100%;
  overflow-y: scroll;
  max-height: 40vh;
}
</style>
