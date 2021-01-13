<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="file" :rules="rules" label-position="right" label-width="120px">
      <el-form-item :label="$t('waste.file.type')" prop="type">
        <el-select v-model="file.type" placeholder="请选择">
            <el-option
            v-for="item in typeList"
            :key="item.key"
            :label="item.value"
            :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('waste.file.relatedEnterprise')" prop="relatedEnterprise">
        <el-select v-model="file.enterprise" placeholder="请选择">
            <el-option
            v-for="item in enterpriseList"
            :key="item.id"
            :label="item.name"
            :value="String(item.name)"
            />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('waste.file.dir')" prop="relatedEnterprise">
        <el-select v-model="file.dir" @change="onSelectDirChange" placeholder="请选择">
            <el-option
            v-for="item in dirList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('waste.file.select')" prop="select">
          <el-upload
           class="upload inline-block margin-left-10"
           action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="file.files"  
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
      <el-form-item :label="$t('waste.file.image')" prop="select">
          <el-upload
           class="upload inline-block margin-left-10"
           action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="file.images"  
            multiple
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-progress="uploadProgress"
            :on-change="onImageUploadChange"
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
  name: 'FileEdit',
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
      uploadAction: `${process.env.VUE_APP_BASE_API}waste/oss`,
      importDepot: {
          "depotId": ''
      },
      file: this.initFile(),
      headers: {
        Authorization: `bearer ${getToken()}`
      },
      autoUpload: false,
      buttonLoading: false,
      screenWidth: 0,
      width: this.initWidth(),
      enterpriseList: [],
      dirList: [
          {key: 'document', value: '文档'},
          {key: 'app', value: 'APP'},
          {key: 'image', value: '图片'},
          {key: 'event', value: '事件'},
      ],
      typeList: [
          {key: '信息公开', value: '信息公开'},
          {key: '环保宣教', value: '环保宣教'},
          {key: '危废管理计划', value: '危废管理计划'},
          {key: '其他', value: '其他'},
      ],
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
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initFile() {
      return {
        enterprise: '',
        type: '',
        dir: '文档',
        files: [],
        images: [],
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
    /* 上传文件 */
    getUploadFile(value) {
        this.file.files.push(value)
        console.log(this.file.files)
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
      this.file.enterprise = value[0]
      this.file.depotId    = value[1]
      console.log(this.file.enterprise)
      console.log(this.file.depotId)
    },
    handleCheckChange(item, value) {
        console.log(item)
    },
    onSelectDirChange(item) {
        console.log("目录选择" + item)
        console.log("目录选择" + this.file.dir)
    },
    setFile(val) {
      this.formData = new FormData
      this.file = { ...val }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
        //   let formData = new FormData();
          this.formData.append("type", this.file.type);  // 文件对象
          this.formData.append("enterprise", this.file.enterprise);  // 文件对象
          this.formData.append("dir", this.file.dir);  // 文件对象
          this.buttonLoading = true
          if (!this.file.id) {
            // create
            this.$upload('waste/oss', this.formData).then(() => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.$emit('success')
              this.setFile( {
                    enterprise: '',
                    type: '',
                    dir: '',
                    files: []
                })
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
      this.user = this.initFile()
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload {
    display: inline-block;
  }
</style>
