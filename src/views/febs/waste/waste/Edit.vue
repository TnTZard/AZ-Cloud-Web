<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="waste" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('waste.waste.enterprise')" prop="area">
        <el-input v-model="waste.enterprise" readonly />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.depotId')" prop="depotPerson">
        <el-input v-model="waste.depotId" readonly />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.name')" prop="phone">
        <el-input v-model="waste.name" />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.wasteCode')" prop="longitude">
        <el-input v-model="waste.wasteCode" />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.categoryCode')" prop="latitude">
        <el-input v-model="waste.categoryCode"  />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.mainDanPart')" prop="address">
        <el-input v-model="waste.mainDanPart"  />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.physicalState')" prop="existAmount">
        <el-input v-model="waste.physicalState"  />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.feature')" prop="image">
        <el-input v-model="waste.feature" />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.productionProcess')" prop="image">
        <el-input v-model="waste.productionProcess" readonly />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.receiveUnit')" prop="image">
        <el-input v-model="waste.receiveUnit" />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.packing')" prop="image">
        <el-input v-model="waste.packing" />
      </el-form-item>
      <el-form-item :label="$t('waste.waste.transferAmount')" prop="image">
        <el-input v-model="waste.transferAmount" readonly/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validMobile } from '@/utils/my-validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'WasteImport',
  components: { Treeselect },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initFlag: false,
      waste: this.initWaste(),
      uploadAction: `${process.env.VUE_APP_BASE_API}waste/poi/importExcel`,
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      checkList: ['温度', '湿度', 'TVOC', '可燃气体'],
      enterpriseList: [],
      depotList: [],
      rules: {
        
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    }
  },
  mounted() {
    this.initEnterprises()
    this.initDepots()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initWaste() {
      return {
        enterprise: '',
        depotId: '',
        name: '',
        wasteCode: '',
        categoryCode: '',
        physicalState: '1',
        feature: '',
        mainDanPart: '',
        productionProcess: '',
        receiveUnit: '',
        packing: '',
        transferAmount: '',
        gmtCreate: null,
        gmtModified: null,
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
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
    initDepots() {
    //   this.$get('/waste/enterprise/names').then((r) => {
    //     for (var item in r.data.data) {
    //       if(item.enterpriseName === this.enterprise) {
    //           this.depotList.push(item.depotNames.depotId)
    //       }
    //   }
    //   }).catch((error) => {
    //     console.error(error)
    //     this.$message({
    //       message: this.$t('tips.getDataFail'),
    //       type: 'error'
    //     })
    //   })
    
    //   this.$get('system/role/options').then((r) => {
    //     this.depotList = r.data.data
    //   }).catch((error) => {
    //     console.error(error)
    //     this.$message({
    //       message: this.$t('tips.getDataFail'),
    //       type: 'error'
    //     })
    //   })
    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    setWaste(val) {
      this.waste = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          if (!this.waste.id) {

          } else {
            // update
            this.waste.gmtCreate = null;
            this.waste.gmtModified = null;
            this.$put('/waste/enterprise/hazardous-waste', { ...this.waste }).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          }
        } else {
          return false
        }
      })
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.waste = this.initWaste()
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
        type: 'error'
      })
      NProgress.done()
    //   this.fetch()
    //   this.dialogVisible = true
    },
    uploadProgress() {
      NProgress.start()
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
