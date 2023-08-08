<script setup lang="ts">
import keyMoments from '@/assets/keyMoments.json'
import { h, ref, onMounted, type CSSProperties } from 'vue'
//@ts-ignore(2306)
import fullpage from 'fullpage.js'
import Image1 from '@/assets/img/1126952445_16099187127001n.jpeg'
import Image2 from '@/assets/img/1126952445_16099187127151n.jpeg'
import Image3 from '@/assets/img/aj4qi-9wdbl.png'
import Image4 from '@/assets/img/us_covid19_mortality.jpg'
import { type MenuProps } from 'ant-design-vue'
const dates = ref(keyMoments.map((item) => moment(item.Time, 'yyyy-MM-DD').toDate()))

const selectedIndex = ref(0)
const autoPlay = ref(true)

const carouseData = [{ url: Image1 }, { url: Image2 }, { url: Image3 }, { url: Image4 }]
onMounted(() => {
  let fullPageInstance = new fullpage('#fullpage', {
    licenseKey: 'GPLv3',
    navigation: true,
    responsiveWidth: 800,
    sectionsColor: [
      '#000000aa',
      '#181a1c',
      '#181a1c',
      '#181a1c',
      '#2b0909',
      '#0d0000',
      '#001a2c',
      '#002137',
      '#002945',
      '#003356',
      '#003a61'
    ],
    anchors: ['page1', 'page2', 'page3']
  })
})

const scrollHandler = (event: WheelEvent) => {
  event.stopPropagation()
}

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
const staticStyle: CSSProperties = {
  textAlign: 'center',
  fontSize: '40px',
  color: '#FDB2A3'
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
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#3271A0',
      sizeStep: 8,
    }
  }">
    <a-carousel indicator-position="none" style="width: 100%; height: 100%; position: absolute" :autoplay="true">
      <div v-for="(item, index) in carouseData" :key="index">
        <img :src="item.url" alt="" style="object-fit: initial; height: 100%; width: 100%" />
      </div>
    </a-carousel>
    <div>
      <ul id="menu">
        <li><a href="#page1" class="hreftitle">First slide</a></li>
        <li><a href="#page2" class="hreftitle">Second slide</a></li>
        <li><a href="#page3" class="hreftitle">Third slide</a></li>
      </ul>
    </div>
    <div id="fullpage">
      <div class="section" style="padding-top: 60px">
        <a-layout :style="transparentStyle">
          <a-layout-header :style="headerStyle">
            <div style="
              text-align: center;
              font-size: 50px;
              color: rgb(0, 123, 255);
              font-family: 'Courier New', Courier, monospace;
              z-index: 2;
            ">
              R . I . P .
            </div>
          </a-layout-header>
          <a-layout-content :style="contentStyle">
            <div style="margin-bottom: 100px"><a-col :span="24"></a-col></div>
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

      <div class="section" style="padding-top: 60px">
        <a-row>
          <a-col style="display: flex; flex-direction: column; justify-content: space-between;max-height: 80vh;" :span="9"
            :offset="3">
            <div style="margin-bottom: 10px;">
              <MapTimeline :width-height-ratio="0.6" :dates="dates" :play-interval="10000"
                v-model:selected-index="selectedIndex" v-model:auto-play="autoPlay" />
            </div>
            <div>
              <TrendTimeline :width-height-ratio="0.5" :dates="dates" v-model:selected-index="selectedIndex"
                v-model:auto-play="autoPlay" />
            </div>
          </a-col>
          <a-col :span="7" style="align-items: center;max-height: 900px;" :offset="2">
            <div class="scroll_event">
              <a-config-provider :theme="{
                token: {
                  fontSize:16,
                  colorPrimary: '#EA1B30',
                  colorText:'#E84848',
                  colorTextTertiary:'#FF696966',
                  colorTextDisabled:'#FF696966',
                  colorSplit:'#FF696966',
                  sizeStep: 8,
                }
              }">
                <a-steps progress-dot @wheel="scrollHandler" direction="vertical" v-model:current="selectedIndex" :items="keyMoments.map((item) => {
                  return { title: item.event, description: item.Time + ' ' + item.comment }
                })">
                </a-steps>
              </a-config-provider>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="section" style="padding-top: 60px">
        <div class="chart-map">
          <MapCharts :width-height-ratio="0.72" :margin-ratio="0.9" />
        </div>
      </div>
      <div class="section">Some section</div>
    </div>
  </a-config-provider>
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
  min-height: 330px;
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
  scrollbar-width: thin;
  padding-left: 5px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  aspect-ratio: 2/3;
}

#menu {
  background-color: rgb(0, 0, 0);
  z-index: 100;
  display: flex;
  position: absolute;
  width: 100vw;
  list-style: none;
  right: 0px;
  display: flex;
  position: absolute;
  justify-content: right;
  align-content: center;
  height: 60px;
}

#menu>li,
a {
  display: inline-block;
  height: 95%;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 20px;
  vertical-align: middle;
  align-items: center;
  justify-items: center;
}

.hreftitle {
  color: #ffffff;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
}

.titlebox {
  color: #000000;
}
</style>
