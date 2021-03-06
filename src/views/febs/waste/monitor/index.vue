<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.enterpriseName" :placeholder="$t('waste.monitorSystem.enterprise')" class="filter-item search-item" />
      <el-input v-model="queryParams.depotId" :placeholder="$t('waste.monitorSystem.depotId')" class="filter-item search-item" />
      <el-input v-model="queryParams.monitorName" :placeholder="$t('waste.monitorSystem.monitorName')" class="filter-item search-item" />
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
          <el-dropdown-item @click.native="add">{{ $t('waste.monitorSystem.add') }}</el-dropdown-item>
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
      <el-table-column :label="$t('waste.monitorSystem.monitorName')" prop="monitorName" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.monitorSystem.depotId')" prop="depotId" sortable :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.depotId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.monitorSystem.enterprise')" prop="enterprise" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprise }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.monitorSystem.gmtMonitor')" prop="gmtMonitor" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtMonitor }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.monitorSystem.factors')" prop="factors" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
           <span v-for="(item, index) in scope.row.factorList" :key="index" >{{ item.description + "  "}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.monitorSystem.deviceStatus')" prop="deviceStatus" :show-overflow-tooltip="true" align="center" min-width="120px" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === '达标' " style="color: green">{{ scope.row.status }}</span>
          <span v-else style="color: grey">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.monitorSystem.enStatus')" prop="enStatus" :show-overflow-tooltip="true" align="center" min-width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="110px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i class="el-icon-view table-operation" style="color: #87d068;" @click="view(row)" />
          <i class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['log:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <monitor-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <monitor-view
      ref="view"
      :dialog-visible="monitorViewVisible"
      @close="viewClose"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import MonitorEdit from './Edit'
import MonitorView from './View'


export default {
  name: 'MonitorSystem',
  components: { Pagination, MonitorEdit, MonitorView },
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
      timer: '',
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
    
  },
  methods: {
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
      this.loading = true
      this.$post('waste/enterprise/monitor-system/page', {
        ...params
      }).then((r) => {
        const data = r.data.data
        this.total = data.total
        this.list = data.records
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
