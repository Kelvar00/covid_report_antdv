<script setup lang="ts">
import keyMoments from '@/assets/keyMoments.json'
import { ref, onMounted, type Ref,type CSSProperties } from 'vue'
//@ts-ignore(2306)
import fullpage from 'fullpage.js'
import Image1 from '@/assets/img/1126952445_16099187127001n.jpeg'
import Image2 from '@/assets/img/1126952445_16099187127151n.jpeg'
import Image3 from '@/assets/img/aj4qi-9wdbl.png'
import Image4 from '@/assets/img/us_covid19_mortality.jpg'

const dates = ref(keyMoments.map((item) => moment(item.Time, 'yyyy-MM-DD').toDate()))
const selectedIndex = ref(0)
const autoPlay = ref(false)
const selectedCountry = ref('')
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
    anchors: ['page0', 'page1', 'page2', 'page3']
  })
})
const listContainerRef:Ref<HTMLDivElement>=ref(null) as any
watch(selectedIndex,(newVal)=>{
  const listContainer = listContainerRef.value
  const stepList = listContainer.children[0] as HTMLElement
  const stepItem = stepList.children[newVal] as HTMLElement
  const offset = stepItem.getBoundingClientRect().top-listContainer.getBoundingClientRect().top
  listContainer.scrollBy({top:offset,behavior:'smooth'})
})
const scrollHandler = (event: WheelEvent) => {
  event.stopPropagation()
}

import MapCharts from './components/MapCharts.vue'
import MapTimeline from './components/MapTimeline.vue'
import TrendTimeline from './components/TrendTimeline.vue'
import CountrySelect from './components/CountrySelect.vue'
import moment from 'moment'
import { watch } from 'vue'
//import { requiredNumber } from 'element-plus/es/components/table-v2/src/common.js';
const transparentStyle: CSSProperties = {
  color: 'transparent',
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
const staticStyleConfirmed: CSSProperties = {
  textAlign: 'center',
  color: '#FF9897'
}
const staticStyleDead: CSSProperties = {
  textAlign: 'center',
  color: '#aaaaaa'
}
const staticStyleVaccine: CSSProperties = {
  textAlign: 'center',
  color: '#78afdf'
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
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#3271A0',
        sizeStep: 8
      }
    }"
  >
    <a-carousel
      style="width: 100%; height: 100%; position: absolute"
      :autoplay="true"
      :dots="false"
    >
      <div v-for="(item, index) in carouseData" :key="index">
        <img :src="item.url" alt="" style="object-fit: initial; height: 100%; width: 100%" />
      </div>
    </a-carousel>
    <div>
      <ul id="menu">
        <li>
          <h2 class="icontitle">Covid-19 Statistics</h2>
        </li>
        <li><a href="#page0" class="hreftitle">Index</a></li>
        <li><a href="#page1" class="hreftitle">Number</a></li>
        <li><a href="#page2" class="hreftitle">Trend</a></li>
      </ul>
    </div>
    <div id="fullpage">
      <div class="section" style="align-items: center; justify-items: center">
        <a-row>
          <a-col
            style="align-items: center; justify-items: center; flex-direction: column"
            :span="16"
            :offset="4"
          >
            <div>
              <h1
                style="
                  font-weight: bold;
                  margin-bottom: 10px;
                  aspect-ratio: 6/1;
                  font-size: 100px;
                  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
                    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                  color: #ffffffaa;
                "
                align="center"
              >
                The Pandemic
              </h1>
            </div>
            <div>
              <p
                style="
                  font-size: 24px;
                  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                  color: #ffffffaa;
                "
              >
                The novel coronavirus, cases of which were first reported in
                <span style="color: #dc143c">December 2019</span>, has escalated into a pandemic
                affecting <span style="color: #dc143c">at least 200 countries and regions</span> so
                far. The rapid outbreak has stoked fear and prejudice while inspiring love and
                empathy. Its socio-economic, political and psychological impact is reshaping the
                global landscape.
              </p>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="section" style="padding-top: 60px">
        <a-layout :style="transparentStyle">
          <a-layout-content :style="contentStyle">
            <div class="scroll_content">
              <a-row style="max-width: 100vw" :gutter="12">
                <a-col :span="10" :offset="3">
                  <p
                    style="
                      color: #ffffffaa;
                      font-size: 20px;
                      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                    "
                    align="left"
                  >
                    At the turn of the year, few imagined a virus would rise up that modern medicine
                    couldn't quickly cure. But the coronavirus has now infected over
                    <span style="color: #dc143cbb">2.4 million</span>
                    people, shut down nations and threatened to derail the global economy. As the
                    situation in China tapers off and life slowly returns to normal, the focus is on
                    preventing imported cases. Elsewhere, this
                    <span style="color: #dc143cbb">dangerous and relentless</span> virus continues
                    to plague at least 200 countries and regions. The pandemic has evolved from a
                    public health emergency to a socio-economic catastrophe. This is a time when
                    <span style="color: #dc143cbb">a proliferation of disinformation</span> about
                    the disease is confusing many, when a blame game is riding on a roller coaster
                    of politicization and xenophobia, when humankind is realizing its limitations
                    and ignorance in the face of a new virus. CGTN made this interactive to document
                    the developments of the pandemic as well as measures taken in China and other
                    countries to counter it.
                  </p>
                </a-col>
                <a-col :span="6" :offset="2">
                  <div class="statistic-card" style="background-color: rgba(205, 9, 9, 0.69)">
                    <a-statistic :value="168983095" :valueStyle="staticStyleConfirmed">
                      <template #title>
                        <div style="display: flex; align-items: center; color: #ff9897">
                          confirmed cases
                        </div>
                      </template>
                    </a-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span style="color: #ff9897"
                          >Lat update:2 August 2023 at 07:56 pm GMT+8</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="statistic-card" style="background-color: rgba(24, 23, 23, 0.69)">
                    <a-statistic :value="6953743" :valueStyle="staticStyleDead">
                      <template #title>
                        <div style="display: flex; align-items: center; color: #aaaaaa">
                          Confirmed deaths
                        </div>
                      </template>
                    </a-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span style="color: #aaaaaa"
                          >Lat update:2 August 2023 at 07:56 pm GMT+8</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="statistic-card" style="background-color: rgba(0, 105, 162, 0.768)">
                    <a-statistic :value="13492099754" :valueStyle="staticStyleVaccine">
                      <template #title>
                        <div style="display: flex; align-items: center; color: #78afdf">
                          Vaccine doses administrated
                        </div>
                      </template>
                    </a-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span style="color: #78afdf">Last update: 30 July 2023</span>
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
          <a-col :span="4" :offset="1" style="align-items: center; max-height: 85vh">
            <div class="scroll_event" ref="listContainerRef">
              <a-config-provider
                :theme="{
                  token: {
                    fontSize: 14,
                    colorPrimary: '#B8B3AA',
                    colorText: '#EAEBEC',
                    colorTextTertiary: '#B8B3AA99',
                    colorTextDisabled: '#B8B3AA99',
                    colorSplit: '#B8B3AA99',
                    sizeStep: 6
                  }
                }"
              >
                <a-steps
                  progress-dot
                  @wheel="scrollHandler"
                  direction="vertical"
                  v-model:current="selectedIndex"
                >
                  <a-step
                    v-for="(item, index) in keyMoments"
                    :key="index"
                    :description="item.Time + ' ' + item.comment"
                  >
                    <template #title>
                      <span class="steptitle">{{ item.event }}</span>
                    </template>
                  </a-step>
                </a-steps>
              </a-config-provider>
            </div>
          </a-col>
          <a-col
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 75vh;
            "
            :span="11"
          >
            <div class="chart-map">
              <MapCharts
                :dates="dates"
                :selected-country="selectedCountry"
                v-model:selected-timeline-index="selectedIndex"
                height-parameter="75vh"
              />
            </div>
          </a-col>
          <a-col
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              max-height: 85vh;
            "
            :span="7"
          >
            <div style="height: 45vh;display: flex;flex-direction: column;justify-content: center;">
              <MapTimeline
                height-parameter="43vh"
                :dates="dates"
                :play-interval="10000"
                v-model:selected-timeline-index="selectedIndex"
                v-model:auto-play="autoPlay"
                v-model:selected-country="selectedCountry"
              />
            </div>
            <a-layout id="layoutOutside" style="background-color: transparent">
              <a-layout-content
                style="
                  background-color: transparent;
                  align-items: start;
                  justify-content: start;
                  display: flex;
                  height: 30vh;
                "
              >
                <a-config-provider
                  :theme="{
                    token: {
                      colorBgContainer: 'rgba(24, 23, 23, 0.69)',
                      colorText: 'azure',
                      colorTextTertiary: 'azure',
                      colorTextPlaceholder: 'rgba(200,200,200,0.5)',
                      sizeStep: 8
                    }
                  }"
                >
                  <CountrySelect
                    v-model:selected-country="selectedCountry"
                    style="aspect-ratio: 5/3"
                  /> </a-config-provider
                >
              </a-layout-content>
            </a-layout>
          </a-col>
        </a-row>
      </div>
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
  height: 150px;
  padding: 15px;
  border-radius: 4px;
  color: #ffffff;
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
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  aspect-ratio: 2/3;
}
.scroll_event::-webkit-scrollbar {
  display: none;
}

#menu {
  background-color: rgb(0, 0, 0);
  z-index: 100;
  display: flex;
  position: absolute;
  width: 100vw;
  list-style: none;
  right: 0px;
  padding-right: 20px;
  display: flex;
  position: absolute;
  justify-content: right;
  align-content: center;
  height: 60px;
}

#menu > li,
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

.steptitle {
  font-size: 16px;
  font-weight: 400;
}

.icontitle {
  display: inline-block;
  position: absolute;
  left: 20px;
  justify-content: center;
  align-content: center;
  align-items: center;
  justify-items: center;
  margin-top: 5px;
}
.selectpopup {
  position: relative;
}
.chart-map {
  padding-right: -20px;
  align-items: center;
}
</style>
