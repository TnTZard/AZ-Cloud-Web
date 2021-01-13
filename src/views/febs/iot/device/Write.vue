<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="device" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('iot.device.ip')" prop="    e">
        <el-input v-model="device.ip" readonly/>
      </el-form-item>
      <el-form-item :label="$t('iot.device.enterprise') + '/' + $t('iot.device.depotId')" prop="enteprise" >
          <el-cascader style="width:100%"
            v-model="device.enterprise"
            size="medium"
            :options="enterpriseList"
            :props="{ value: 'name', label: 'name', children: 'depot', expandTrigger: 'hover' }"
            @change="handleChange"
            filterable>
          </el-cascader>
      </el-form-item>
      <el-form-item :label="$t('iot.device.textarea')" prop="factors">
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="textarea">
            </el-input>
      </el-form-item>
      <el-form-item :label="$t('waste.file.select')" prop="select">
          <el-upload
           class="upload inline-block margin-left-10"
           action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="files"  
            multiple
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-progress="uploadProgress"
            :on-change="onUploadChange"
            :auto-upload="autoUpload"
            >
            <el-button class="flex-left" icon="el-icon-upload2" type="success" plain>
            {{ $t('waste.file.upload') }}
            </el-button>
        </el-upload>
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
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'
import { getFileType } from '@/utils'
import 'nprogress/nprogress.css'

export default {
  name: 'deviceWrite',
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
      formData: new FormData(),
      textarea: '',
      device: this.initDevice(),
      headers: {
        Authorization: `bearer ${getToken()}`
      },
      files: [],
      buttonLoading: false,
      autoUpload: false,
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
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initDevice() {
      return {
        ip: '',
        monitorName: '',
        enterprise: '',
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
    onUploadChange(f, list) {
        this.formData.append('files', f.raw)
    //    console.log(f,list,'f');
    //     this.file.files.push(f)
    },
    onImageUploadChange(f, list) {
        this.formData.append('images', f.raw)
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
      console.log('上传成功！！！')
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
    beforeUpload(file) {
      const type = getFileType(file.name)
      console.log('上传之前')
      console.log('文件： ' + this.file.files)
    },

    handleChange(value) {
      this.device.enterprise = value[0]
      this.device.depotId    = value[1]
      console.log(this.device.enterprise)
      console.log(this.device.depotId)
    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    setDevice(val) {
      this.device = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
            console.log(this.textarea)
            this.formData.append("name", this.device.ip)
            this.buttonLoading = true
            this.$upload(`test/iotUpdate`, this.formData).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('iot.tips.sendSuccess'),
                type: 'success'
              })
              this.files = []
              this.formData = new FormData()
              this.$emit('success')
            })
        //  this.buttonLoading = true
        //   if (!this.device.id) {
        //     // create
        //     this.$post('iot/enterprise/monitor-system', { ...this.device }).then(() => {
        //       this.buttonLoading = false
        //       this.isVisible = false
        //       this.$message({
        //         message: this.$t('tips.createSuccess'),
        //         type: 'success'
        //       })
        //       this.$emit('success')
        //     })
        //   } else {
        //     // update
        //     // this.user.createTime = this.user.modifyTime = this.user.lastLoginTime = null
        //     // this.$put('system/user', { ...this.user }).then(() => {
        //     //   this.buttonLoading = false
        //     //   this.isVisible = false
        //     //   this.$message({
        //     //     message: this.$t('tips.updateSuccess'),
        //     //     type: 'success'
        //     //   })
        //     //   this.$emit('success')
        //     // })
        //   }
        } else {
          return false
        }
      })
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.device = this.initDevice()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
