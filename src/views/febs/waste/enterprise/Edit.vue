<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="enterprise" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('waste.enterprise.name')" prop="name">
        <el-input v-model="enterprise.name"/>
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.area')" prop="area">
        <el-select v-model="enterprise.area" value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in areaList"
            :key="item"
            :label="item"
            :value="String(item)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.registeredAddress')" prop="registeredAddress">
        <el-input v-model="enterprise.registeredAddress" />
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.legalRepresentative')" prop="legalRepresentative">
        <el-input v-model="enterprise.legalRepresentative" />
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.legalPhone')" prop="legalPhone">
        <el-input v-model="enterprise.legalPhone" />
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.environmentPerson')" prop="environmentPerson">
        <el-input v-model="enterprise.environmentPerson" />
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.wasteProduction')" prop="wasteProduction">
        <el-input v-model="enterprise.wasteProduction" />
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.score')" prop="moscorebile">
        <el-input v-model="enterprise.score" readonly />
      </el-form-item>
      <el-form-item :label="$t('waste.enterprise.isActive')" prop="isActive">
        <el-switch
            v-model="enterprise.isActive"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          {{ "初次创建时不建议启用" }}
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
  name: 'EnterpriseEdit',
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
      enterprise: this.initEnterprise(),
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      areaList: ["南山区", "宝安区", "福田区", "盐田区", "罗湖区", "龙岗区", "龙华区", "坪山区", "光明区",],
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
    // this.initEnterprises()
    // this.initDepots()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initEnterprise() {
      return {
        id: null,
        enterpriseName: '',
        area: '',
        registeredAddress: '',
        legalRepresentative: '',
        legalPhone: '',
        environmentPerson: '',
        environmentPhone: '',
        wasteProduction: 0,
      
        gmtModified: null,
        score: 100,
        isActive: '0',
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

    handleChange(value) {
    //   this.monitorSystem.enterprise = value[0]
    //   this.monitorSystem.depotId    = value[1]
      // console.log(this.monitorSystem.enterprise)
      // console.log(this.monitorSystem.depotId)
    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    setEnterprise(val) {
      this.enterprise = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
    
          if (!this.enterprise.id) {
            // create
            this.$post('waste/enterprise', { ...this.enterprise }).then(() => {
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
            this.enterprise.gmtCreate = this.enterprise.gmtModified = null
            this.$put('waste/enterprise', { ...this.enterprise }).then(() => {
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
      this.enterprise = this.initEnterprise()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
