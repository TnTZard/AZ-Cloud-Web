<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.enterprise" :placeholder="$t('waste.waste.enterprise')" class="filter-item search-item" />
      <el-input v-model="queryParams.depotId" :placeholder="$t('waste.waste.depotId')" class="filter-item search-item" />
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
          <el-dropdown-item @click.native="add">{{ $t('waste.waste.import') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['log:delete']" @click.native="batchDelete">{{ $t('table.delete') }}</el-dropdown-item>
          <el-dropdown-item v-has-permission="['log:export']" @click.native="exportExcel">{{ $t('table.export') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="filter-container flex">
      <el-cascader class="cascader"
          style="width:25%"
          v-model="importEnterprise"
          size="medium"
          :options="enterpriseList"
          :props="{ value: 'name', label: 'name', children: 'depot', expandTrigger: 'hover' }"
          @change="handleChange"
          filterable>
      </el-cascader>
      <el-upload
           class="upload inline-block margin-left-10"
          :headers="headers"
          :action="uploadAction"
          :data="importDepot"
          list-type="picture"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-progress="uploadProgress"
        >
        <el-button class="flex-left" icon="el-icon-upload2" type="success" plain>
          {{ $t('table.import') }}
        </el-button>
      </el-upload>
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
      <el-table-column :label="$t('waste.waste.enterprise')" prop="enterprise" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprise }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.depotId')" prop="depotId" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.depotId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.name')" prop="enterprise" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.wasteCode')" prop="gmtMonitor" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.wasteCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.categoryCode')" prop="factors" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.mainDanPart')" prop="deviceStatus" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
         <span>{{ scope.row.mainDanPart }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.feature')" prop="feature" :show-overflow-tooltip="true" align="center" min-width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.feature }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.productionProcess')" prop="productionProcess" :show-overflow-tooltip="true" align="center" min-width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.productionProcess }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.packing')" prop="packing" :show-overflow-tooltip="true" align="center" min-width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.packing }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('waste.waste.receiveUnit')" prop="receiveUnit" :show-overflow-tooltip="true" align="center" min-width="150px" >
        <template slot-scope="scope">
          <span>{{ scope.row.receiveUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" min-width="110px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i class="el-icon-view table-operation" style="color: #87d068;" @click="view(row)" />
          <i class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['log:delete']" class="no-perm">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <waste-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <waste-view
      ref="view"
      :dialog-visible="monitorViewVisible"
      @close="viewClose"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import WasteEdit from './Edit'
import WasteView from './View'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'
import { getFileType } from '@/utils'
import 'nprogress/nprogress.css'

export default {
  name: 'Waste',
  components: { Pagination, WasteEdit, WasteView },
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
      importDepot: {
          "depotId": ''
      },
      importEnterprise: '',
      enterpriseList: [],
      uploadAction: `${process.env.VUE_APP_BASE_API}waste/poi/importExcel`,
      tableKey: 0,
      monitorViewVisible: false,
      loading: false,
      list: null,
      headers: {
        Authorization: `bearer ${getToken()}`
      },
      total: 0,
      queryParams: {},
      sort: {},
      selection: [],
      pagination: {
        size: 50,
        num: 1
      }
    }
  },
  mounted() {
    this.fetch()
    this.initEnterprises()
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
      this.loading = true
      this.$post('/waste/enterprise/hazardous-waste/page/v2', {
        ...params
      }).then((r) => {
        const data = r.data.data
        this.total = data.total
        this.list = data.records
        this.loading = false
      })
    },
    initEnterprises() {
      this.$get('/waste/enterprise/nameList').then((r) => {
        this.enterpriseList = r.data.data
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    add() {
      this.dialog.title = this.$t('waste.waste.immport')
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
        const wasteIds = []
        this.selection.forEach((l) => {
          wasteIds.push(l.id)
        })
        this.delete(wasteIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    delete(wasteIds) {
      this.loading = true
      this.$delete(`waste/enterprise/hazardous-waste/${wasteIds}`).then(() => {
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
    },
    beforeUpload(file) {
      const type = getFileType(file.name)
      if (type !== 'xlsx') {
        this.$message({
          message: this.$t('tips.onlySupportXlsx'),
          type: 'error'
        })
        return false
      } else {
        // let formdata = new FormData()
        // formdata.append('file', file)
        
        // formdata.append('depotId', this.importDepot)
        // this.$upload('waste/poi/importExcel')
        return true
      }
    },
    uploadError() {
      this.$message({
        message: this.$t('tips.uploadFailed'),
        type: 'error'
      })
      NProgress.done()
    },
    uploadSuccess(response) {
    //   const data = response.data
    //   this.data = data.data
    //   this.error = data.error
    //   this.time = data.time
      this.$message({
        message: response.message,
        type: 'success'
      })
      NProgress.done()
    //   this.fetch()
    //   this.dialogVisible = true
    },
    uploadProgress() {
      NProgress.start()
    },
    handleChange(value) {
        this.importDepot = {
            "depotId": value[1]
        }
        console.log("选中仓库" + this.importDepot.depotId)
    },
    edit(row) {
      console.log(row.id)
      this.$refs.edit.setWaste(row)
      this.dialog.title = this.$t('common.edit')
      this.dialog.isVisible = true
    },
  }
}
</script>
<style lang="scss" scoped>
  .upload {
    display: inline-block;
  }
  .flex{
      display: flex;
      align-items: center;
  }
  .margin-left-10 {
    margin:0px 0px 0px 0px;
  }
  .cascader {
    margin:0px 0px 0px 0px;
  }
  .flex-left{
      margin-right: 0 !important;
      margin-left: 10px !important;
  }
</style>