<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="depot" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('waste.depot.depotId')" prop="depotId">
        <el-input v-model="depot.depotId"/>
      </el-form-item>
      <el-form-item :label="$t('waste.depot.enterpriseName')" prop="area">
        <el-select v-model="depot.enterpriseName" @change="onSelectEnterpriseChange" value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in enterpriseList"
            :key="item.id"
            :label="item.name"
            :value="String(item.name)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('waste.depot.area')" prop="area">
        <el-input v-model="depot.area" readonly />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.depotPerson')" prop="depotPerson">
        <el-input v-model="depot.depotPerson" />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.phone')" prop="phone">
        <el-input v-model="depot.phone" />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.longitude')" prop="longitude">
        <el-input v-model="depot.longitude" />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.latitude')" prop="latitude">
        <el-input v-model="depot.latitude"  />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.address')" prop="address">
        <el-input v-model="depot.address"  />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.existAmount')" prop="existAmount">
        <el-input v-model="depot.existAmount"  />
      </el-form-item>
      <el-form-item :label="$t('waste.depot.image')" prop="image">
        <el-input v-model="depot.image" readonly />
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
  name: 'depotEdit',
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
      depot: this.initDepot(),
      enterpriseList: this.initEnterprises(),
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      areaList: ["南山区", "宝安区", "福田区", "盐田区", "罗湖区", "龙岗区", "龙华区", "坪山区", "光明区",],
      depotList: [],
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
    // this.initdepots()
    // this.initDepots()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initDepot() {
      return {
        id: null,
        depotId: '',
        enterpriseName: '',
        depotPerson: '',
        phone: '',
        longitude: '',
        latitude: '',
        address: '',
        existAmount: 0,
        area: '',
        image: '',
        gmtCreate: null,
        gmtModified: null,
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

    initEnterprises() {
      this.$get('/waste/enterprise/nameListIgnoreInActive').then((r) => {
        this.enterpriseList = r.data.data
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    },
    handleChange(value) {
    //   this.monitorSystem.depot = value[0]
    //   this.monitorSystem.depotId    = value[1]
      // console.log(this.monitorSystem.depot)
      // console.log(this.monitorSystem.depotId)
    },
    onSelectEnterpriseChange(value) {
        console.log(value)
        this.enterpriseList.forEach(item => {
            if (item.name == value) {
                this.depot.area = item.area
                this.depot.enterpriseName = item.name
            }
        })
    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    setDepot(val) {
      this.depot = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          if (!this.depot.id) {
            // create
            this.$post('waste/enterprise/depot', { ...this.depot }).then(() => {
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
            this.depot.gmtCreate = this.depot.gmtModified = null
            this.$put('waste/enterprise/depot', { ...this.depot }).then(() => {
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
      this.depot = this.initDepot()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
