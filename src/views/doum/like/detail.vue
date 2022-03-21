<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group @handleSetLineChartData="handleSetLineChartData" />

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData" />
      </el-row>
    </div>
  </div>
</template>

<script>
import PanelGroup from './../../dashboard/PanelGroup'
import LineChart from './../../dashboard/LineChart_1'
import { initData } from '@/api/data'

const lineChartData = {
  newVisitis: {
    expectedData: [],
    actualData: [],
    xAxisData: []
  },
  messages: {
    expectedData: [],
    actualData: []
  },
  purchases: {
    expectedData: [],
    actualData: []
  },
  shoppings: {
    expectedData: [],
    actualData: []
  }
}

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      url: 'api/aweme/like/queryAwemeDetail',
      lineChartData: lineChartData.newVisitis,
      enabledTypeOptions: [
        { key: 'TWO_HOUR', display_name: '最近2小时' },
        { key: 'FOUR_HOUR', display_name: '最近4小时' },
        { key: 'SIX_HOUR', display_name: '最近6小时' },
        { key: 'TWELVE_HOUR', display_name: '最近12小时' },
        { key: 'ONE_DAY', display_name: '最近24小时' }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const params = {
        str_aweme_id: this.$route.params.str_aweme_id
      }
      initData(this.url, params).then(data => {
        this.data = data
        this.show = true
        lineChartData.newVisitis.xAxisData = data.xAxisData
        lineChartData.newVisitis.expectedData = data.digg_count
        lineChartData.newVisitis.actualData = data.sales
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
