<script setup lang="ts">
declare var require: any
import { ref, onMounted, type Ref } from 'vue'
import fullpage from 'fullpage.js'
import { ArrowRight, CaretBottom, CaretTop, Warning } from '@element-plus/icons-vue'
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
</script>

<template>
  <el-carousel
    indicator-position="none"
    height="100%"
    style="width: 100%; height: 100%; position: absolute"
    :autoplay="true"
  >
    <el-carousel-item v-for="item in carouseData" :key="item">
      <img :src="item.url" alt="" style="object-fit: initial; height: 100%; width: 100%" />
    </el-carousel-item>
  </el-carousel>
  <div id="fullpage">
    <div class="section">
      <el-container>
        <el-header>
          <div
            style="
              text-align: center;
              font-size: 50px;
              color: aqua;
              font-family: 'Courier New', Courier, monospace;
              z-index: 2;
            "
          >
            R . I . P
          </div>
        </el-header>
        <el-main>
          <div style="margin-bottom: 200px"><el-col :span="24"></el-col></div>
        </el-main>
        <el-main>
          <el-scrollbar>
            <div class="content-padding-1">
              <el-col :span="24"> </el-col>
            </div>
            <el-row :gutter="12">
              <el-col :span="8">
                <div class="statistic-card">
                  <el-statistic :value="168983095">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        confirmed cases
                        <el-tooltip
                          effect="dark"
                          content="Number of people infected in the pandemic"
                          placement="top"
                        >
                          <el-icon style="margin-left: 4px" :size="12">
                            <Warning />
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-statistic>
                  <div class="statistic-footer">
                    <div class="footer-item">
                      <span>Lat update:2 August 2023 at 07:56 pm GMT+8</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="statistic-card">
                  <el-statistic :value="6953743">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        Confirmed deaths
                        <el-tooltip
                          effect="dark"
                          content="Number of people dead from ncov-19"
                          placement="top"
                        >
                          <el-icon style="margin-left: 4px" :size="12">
                            <Warning />
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-statistic>
                  <div class="statistic-footer">
                    <div class="footer-item">
                      <span>Lat update:2 August 2023 at 07:56 pm GMT+8</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="statistic-card">
                  <el-statistic :value="13492099754" title="New transactions today">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        Vaccine doses administrated
                      </div>
                    </template>
                  </el-statistic>
                  <div class="statistic-footer">
                    <div class="footer-item">
                      <span>Last update: 30 July 2023</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-scrollbar>
        </el-main>
      </el-container>
    </div>

    <div class="section">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="8">
          <MapTimeline
            :width-height-ratio="0.6"
            :dates="dates"
            :auto-play="true"
            :play-interval="10000"
            v-model:selected-date="selectedDate"
            v-model:selected-index="selectedIndex"
          />
        </el-col>
        <el-col :span="12" style="width: 800px">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in 6" :key="item">
              <h3 text="2xl" justify="center">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" style="width: 10vw">
          <div>
            <el-timeline style="color: azure">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
                <button>leran more</button>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <TrendTimeline
              :width-height-ratio="0.5"
              :dates="dates"
              v-model:selected-date="selectedDate"
              v-model:selected-index="selectedIndex"
            />
          </div>
        </el-col>
      </el-row>
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
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 0px;
  text-align: center;
  color: transparent;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.content-padding-1 {
  margin-bottom: 200px;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
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

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.side-card-box {
  width: 480px;
  border-radius: 0px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
