<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="150px">
      <el-form-item :label="$t('waste.user.username')" prop="username">
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item :label="$t('waste.user.password')" prop="password">
        <el-tooltip class="item" effect="dark" :content="$t('tips.defaultPassword')" placement="top-start">
          <el-input v-model="user.password" type="password"/>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('waste.user.repeatPassword')" prop="password">
        <el-tooltip class="item" effect="dark" :content="$t('tips.defaultPassword')" placement="top-start">
          <el-input v-model="user.repeatPassword" type="password"/>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('waste.user.realName')" prop="email">
        <el-input v-model="user.realName" />
      </el-form-item>
      <el-form-item :label="$t('waste.user.phone')" prop="mobile">
        <el-input v-model="user.phone" />
      </el-form-item>
      <el-form-item :label="$t('waste.monitorSystem.enterprise') + '/' + $t('waste.monitorSystem.depotId')" prop="enteprise" >
          <el-cascader style="width:100%"
            v-model="enterpriseName"
            size="medium"
            :options="enterpriseList"
            :props="{ value: 'name', label: 'name', children: 'depot', expandTrigger: 'hover' }"
            @change="handleChange"
            filterable>
          </el-cascader>
      </el-form-item>
      <el-form-item :label="$t('waste.user.role')" prop="roleId">
        <el-select v-model="user.roleId" value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in roles"
            :key="item"
            :label="item"
            :value="String(item)"
          />
        </el-select>
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
  name: 'UserEdit',
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
      user: this.initUser(),
      buttonLoading: false,
      enterpriseName: '',
      screenWidth: 0,
      enterpriseList: [],
      width: this.initWidth(),
      depts: [],
      roles: ["企业普通用户"],
      deptTree: [],
      rules: {
        // username: [
        //   { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        //   { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
        //   { validator: (rule, value, callback) => {
        //     if (!this.user.userId) {
        //       this.$get(`system/user/check/${value}`).then((r) => {
        //         if (!r.data) {
        //           callback(this.$t('rules.usernameExist'))
        //         } else {
        //           callback()
        //         }
        //       })
        //     } else {
        //       callback()
        //     }
        //   }, trigger: 'blur' }
        // ],
        // email: { type: 'email', message: this.$t('rules.email'), trigger: 'blur' },
        // mobile: { validator: (rule, value, callback) => {
        //   if (value !== '' && !validMobile(value)) {
        //     callback(this.$t('rules.mobile'))
        //   } else {
        //     callback()
        //   }
        // }, trigger: 'blur' },
        // roleId: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        // sex: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        // status: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
    // this.initDept()
    // this.initRoles()
    this.initEnterprises()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUser() {
      return {
        id: '',
        realName: '',
        username: '',
        password: '',
        repeatPassword: '',
        depotName: '',
        enterpriseName: '',
        phone: '',
        type: null,
        roleName: '',
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
    initDept() {
      // this.$get('system/dept').then((r) => {
      //   this.depts = r.data.data.rows
      //   this.deptTree = this.depts
      // }).catch((error) => {
      //   console.error(error)
      //   this.$message({
      //     message: this.$t('tips.getDataFail'),
      //     type: 'error'
      //   })
      // })
    },
    resetDeptTree() {
      //this.$refs.deptTree.setCheckedKeys([])
    },
    initRoles() {
      // this.$get('system/role/options').then((r) => {
      //   this.roles = r.data.data
      // }).catch((error) => {
      //   console.error(error)
      //   this.$message({
      //     message: this.$t('tips.getDataFail'),
      //     type: 'error'
      //   })
      // })
    },
    setUser(val) {
      this.user = { ...val }
      //this.user.deptIds && (this.user.deptIdsArr = this.user.deptIds.split(','))
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      if (!this.user.id) {
            // create
            this.$post('waste/user/register/enterpriseUser/v2', { ...this.user }).then(() => {
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
            this.user.createTime = this.user.modifyTime = this.user.lastLoginTime = null
            this.$put('system/user', { ...this.user }).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          }
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.user = this.initUser()
      this.resetDeptTree()
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
    handleChange(value) {
      console.log(value)
      //this.enterpriseName = value
      this.user.enterpriseName = value[0]
      this.user.depotName = value[1]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
