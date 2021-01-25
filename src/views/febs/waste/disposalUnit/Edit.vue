<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="disposalUnit" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('waste.disposalUnit.city')" prop="city">
        <el-input v-model="disposalUnit.city"/>
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.legalPerson')" prop="legalPerson">
        <el-select v-model="disposalUnit.legalPerson" value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in areaList"
            :key="item"
            :label="item"
            :value="String(item)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.facilityAddress')" prop="facilityAddress">
        <el-input v-model="disposalUnit.facilityAddress" />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.approvedBusinessScale')" prop="approvedBusinessScale">
        <el-input v-model="disposalUnit.approvedBusinessScale" />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.approvedBusinessScope')" prop="approvedBusinessScope">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 9}" v-model="disposalUnit.approvedBusinessScope"  />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.approvedBusinessType')" prop="approvedBusinessType">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 9}" v-model="disposalUnit.approvedBusinessType"  />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.permitNumber')" prop="permitNumber">
        <el-input v-model="disposalUnit.permitNumber" />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.licenseValidityPeriod')" prop="licenseValidityPeriod">
        <el-input v-model="disposalUnit.licenseValidityPeriod" />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.longitude')" prop="longitude">
        <el-input v-model="disposalUnit.longitude"  />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.latitude')" prop="latitude">
        <el-input v-model="disposalUnit.latitude"  />
      </el-form-item>
      <el-form-item :label="$t('waste.disposalUnit.phone')" prop="phone">
        <el-input v-model="disposalUnit.phone"  />
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
  name: 'DisposalUnitEdit',
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
      readOnly: true,
      initFlag: false,
      disposalUnit: this.initDisposalUnit(),
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      areaList: ["南山区", "宝安区", "福田区", "盐田区", "罗湖区", "龙岗区", "龙华区", "坪山区", "光明区",],
      disposalUnitList: [],
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
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initDisposalUnit() {
      return {
        id: null,
        city: '',
        legalPerson: '',
        facilityAddress: '',
        approvedBusinessScale: '',
        approvedBusinessScope: '',
        approvedBusinessType: '',
        permitNumber: '',
        licenseValidityPeriod: '',
        longitude: '',
        latitude: '',
        phone: '',
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
    initDepots() {

    },

    handleChange(value) {

    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    setDisposalUnit(val) {
      this.disposalUnit = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
    
          if (!this.disposalUnit.id) {
            // create
            this.$post('waste/disposalUnit', { ...this.disposalUnit }).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          } else {
            // update
            this.disposalUnit.gmtCreate = this.disposalUnit.gmtModified = null
            this.$put('waste/disposalUnit', { ...this.disposalUnit }).then(() => {
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
      this.disposalUnit = this.initDisposalUnit()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
