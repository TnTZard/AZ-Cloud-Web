<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="monitorSystem" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('waste.monitorSystem.monitorName')" prop="monitorName">
        <el-input v-model="monitorSystem.monitorName"/>
      </el-form-item>
      <el-form-item :label="$t('waste.monitorSystem.enterprise') + '/' + $t('waste.monitorSystem.depotId')" prop="enteprise" >
          <el-cascader style="width:100%"
            v-model="monitorSystem.enterprise"
            size="medium"
            :options="enterpriseList"
            :props="{ value: 'name', label: 'name', children: 'depot', expandTrigger: 'hover' }"
            @change="handleChange"
            filterable>
          </el-cascader>
      </el-form-item>
      <!-- <el-form-item :label="$t('waste.monitorSystem.factors')" prop="factors">
          <template>
            <el-checkbox-group v-model="checkList" @change="handleCheckChange">
            <el-checkbox label="温度"></el-checkbox>
            <el-checkbox label="湿度"></el-checkbox>
            <el-checkbox label="TVOC"></el-checkbox>
            <el-checkbox label="可燃气体"></el-checkbox>
            </el-checkbox-group>
          </template>
      </el-form-item> -->
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
  name: 'MonitorEdit',
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
      monitorSystem: this.initMonitorSystem(),
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
    initMonitorSystem() {
      return {
        id: '',
        monitorName: '',
        enterprise: '',
        depotId: '',
        factors: '',
        status: '1',
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

    handleChange(value) {
      this.monitorSystem.enterprise = value[0]
      this.monitorSystem.depotId    = value[1]
      console.log(this.monitorSystem.enterprise)
      console.log(this.monitorSystem.depotId)
    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    setUser(val) {
      this.user = { ...val }
      this.user.deptIds && (this.user.deptIdsArr = this.user.deptIds.split(','))
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          if (!this.monitorSystem.id) {
            // create
            this.$post('waste/enterprise/monitor-system', { ...this.monitorSystem }).then(() => {
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
            // this.user.createTime = this.user.modifyTime = this.user.lastLoginTime = null
            // this.$put('system/user', { ...this.user }).then(() => {
            //   this.buttonLoading = false
            //   this.isVisible = false
            //   this.$message({
            //     message: this.$t('tips.updateSuccess'),
            //     type: 'success'
            //   })
            //   this.$emit('success')
            // })
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
      this.user = this.initMonitorSystem()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
