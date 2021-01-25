<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.area" :placeholder="$t('waste.enterprise.area')" class="filter-item search-item" />
      <el-input v-model="queryParams.enterprise" :placeholder="$t('waste.monitorSystem.depotId')" class="filter-item search-item" />
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
          <el-dropdown-item @click.native="add">{{ $t('waste.enterprise.add') }}</el-dropdown-item>
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
      @cell-click="handleEnterpriseClick"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column :label="$t('waste.disposalUnit.city')"  prop="city" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.legalPerson')" prop="legalPerson" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.legalPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.facilityAddress')" prop="facilityAddress" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.facilityAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.approvedBusinessScale')" prop="approvedBusinessScale" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.approvedBusinessScale }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.approvedBusinessScope')" prop="approvedBusinessScope" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.approvedBusinessScope }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.approvedBusinessType')" prop="approvedBusinessType" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.approvedBusinessType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.permitNumber')" prop="permitNumber" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.permitNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.licenseValidityPeriod')" prop="licenseValidityPeriod" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.licenseValidityPeriod }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.longitude')" prop="longitude" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.latitude')" prop="latitude" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.disposalUnit.phone')" prop="phone" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="110px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['log:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <disposalUnit-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import DisposalUnitEdit from './Edit'
export default {
  name: 'DisposalUnit',
  components: { Pagination, DisposalUnitEdit},
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
      disabled: true,
      tableKey: 0,
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
      this.$post('waste/disposalUnit/page', {
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
    editClose() {
      this.dialog.isVisible = false
    },
    editSuccess() {
      this.fetch()
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
    //   this.loading = true
    //   this.$delete(`waste/enterprise/${logIds}`).then(() => {
    //     this.$message({
    //       message: this.$t('tips.deleteSuccess'),
    //       type: 'success'
    //     })
    //     this.search()
    //   })
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
    },
    edit(row) {
      this.$refs.edit.setDisposalUnit(row)
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
    },
    handleEnterpriseClick(value) {
    
    },
    handleStatusChange(value) {
      console.log(value)
    }
  }
}
</script>
