<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.enterpriseName" :placeholder="$t('iot.device.enterprise')" class="filter-item search-item" />
      <el-input v-model="queryParams.depotId" :placeholder="$t('iot.device.depotId')" class="filter-item search-item" />
      <el-input v-model="queryParams.monitorName" :placeholder="$t('iot.device.monitorName')" class="filter-item search-item" />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="$t('table.systemLog.createTime')"
        value-format="yyyy-MM-dd"
        class="filter-item search-item date-range-item"
        type="daterange"
      />
      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t('table.reset') }}
      </el-button>
      <el-dropdown v-has-any-permission="['log:delete','log:export']" trigger="click" class="filter-item">
        <el-button>
          {{ $t('table.more') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add">{{ $t('waste.iot.add') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['log:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['log:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column :label="$t('iot.device.channel')" prop="monitorName" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('iot.device.ip')" prop="monitorName" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('iot.device.connectTime')" prop="connectTime" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.connectTime }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('iot.device.lastInfo')" prop="lastInfo" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.lastInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('iot.device.lastInfoTime')" prop="monitorName" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.lastInfoTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="110px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i class="el-icon-message table-operation" style="color: #87d068;" @click="view(row)" />
          <i class="el-icon-edit table-operation" style="color: #f50;" @click="write(row)" />
          <i class="el-icon-view table-operation" style="color: #87d068;" @click="view(row)" />
          <i class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['log:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <device-write
      ref="write"
      :dialog-visible="writeDialog.isVisible"
      :title="writeDialog.title"
      @success="writeSuccess"
      @close="writeClose"
    />
    <!-- <monitor-view
      ref="view"
      :dialog-visible="monitorViewVisible"
      @close="viewClose"
    /> -->
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import DeviceWrite from './Write'
// import MonitorView from './View'


export default {
  name: 'iot',
  components: { Pagination, DeviceWrite },
  filters: {
    timeFilter(time) {
      if (time < 500) {
        return 'success'
      } else if (time < 1000) {
        return ''
      } else if (time < 1500) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: ''
      },
      timer: null,
      writeDialog: {
        isVisible: false,
        title: ''
      },
      tableKey: 0,
      monitorViewVisible: false,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      sort: {},
      selection: [],
      pagination: {
        size: 20,
        num: 1
      }
    }
  },
  mounted() {
    this.fetch()
    this.Refresh()
  },
  methods: {
    Refresh() {
      const time = setInterval(() => {//定时器
        this.fetch();//定时任务函数
      }, 2000);
      this.$once("hook:beforeDestroy", () => clearInterval(time));
    },
    onSelectChange(selection) {
      this.selection = selection
    },
    view(row) {
      this.$refs.view.setMonitor(row)
      this.monitorViewVisible = true
    },
    viewClose() {
      this.monitorViewVisible = false
    },
    editClose() {
      this.dialog.isVisible = false
    },
    editSuccess() {
      this.fetch()
    },
    write(row) {
      this.$refs.write.setDevice(row)
      this.writeDialog.title = '发送消息'
      this.writeDialog.isVisible = true
    },
    writeSuccess() {
      this.writeDialog.isVisible = false
    },
    writeClose() {
      this.writeDialog.isVisible = false
      this.fetch()
    },
    exportExcel() {
      this.$download('system/log/excel', {
        pageSize: this.pagination.size,
        pageNum: this.pagination.num,
        ...this.queryParams
      }, `log_${new Date().getTime()}.xlsx`)
    },
    fetch(params = {}) {
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      // if (this.queryParams.timeRange) {
      //   params.createTimeFrom = this.queryParams.timeRange[0]
      //   params.createTimeTo = this.queryParams.timeRange[1]
      // }
      console.log("hi")
      this.loading = true
      this.$post('test/devices', {
        ...params
      }).then((r) => {
        const data = r.data
       
        this.list = data
        this.loading = false
      })
    },
    add() {
      this.dialog.title = this.$t('common.add')
      this.dialog.isVisible = true
    },
   
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const logIds = []
        this.selection.forEach((l) => {
          logIds.push(l.id)
        })
        this.delete(logIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    delete(logIds) {
      this.loading = true
      this.$delete(`waste/enterprise/monitor-system/${logIds}`).then(() => {
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.search()
      })
    },
    search() {
      this.fetch({
        ...this.queryParams,
        ...this.sort
      })
    },
    reset() {
      this.queryParams = {}
      this.sort = {}
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    transTime(time) {
      return `${time} ms`
    },
    sortChange(val, a) {
      this.sort.field = val.prop
      this.sort.order = val.order
      this.search()
    }
  }
}
</script>
