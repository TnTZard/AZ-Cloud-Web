<template>
  <el-dialog
    :title="$t('common.view')"
    :width="width"
    :visible.sync="isVisible"
    class="monitor-view"
  >
    <!-- <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="img-wrapper">
          <img :src="avatar">
        </div>
      </el-col>
    </el-row> -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
            <span>{{ $t('waste.monitorSystem.monitorName') +'：' }}</span> {{ monitor.monitorName }}
        </div>
      </el-col>
    </el-row>
    <el-row> 
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div id="chart" style="width: 100%;height: 370px" />
        </div>
      </el-col>
    </el-row>
    
  </el-dialog>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'WasteView',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      screenWidth: 0,
      width: this.initWidth(),
      monitor: {},
      chart: null
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    },
    // avatar() {
    //   if (this.user.avatar) {
    //     return require(`@/assets/avatar/${this.user.avatar}`)
    //   } else {
    //     return require('@/assets/avatar/default.jpg')
    //   }
    // }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    transSex(sex) {
      switch (sex) {
        case '0':
          return this.$t('common.sex.male')
        case '1':
          return this.$t('common.sex.female')
        default:
          return this.$t('common.sex.secret')
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 550) {
        return '95%'
      } else if (this.screenWidth < 990) {
        return '580px'
      } else if (this.screenWidth < 1400) {
        return '600px'
      } else {
        return '650px'
      }
    },
    initChart() {
        this.chart = echarts.init(document.getElementById('chart'))
        
    },
    setMonitor(val) {
      this.monitor = { ...val }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-view {
    .img-wrapper {
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 10px;
      img {
        width: 4rem;
        border-radius: 50%;
      }
    }
    .view-item {
      margin: 7px;
      i {
        font-size: .97rem;
      }
      span {
        margin-left: 5px;
      }
    }
  }
</style>
