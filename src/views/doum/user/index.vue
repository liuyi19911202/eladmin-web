<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.nickname" clearable size="small" placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-input v-model="query.remark" clearable size="small" placeholder="输入备注搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <date-range-picker v-model="query.create_time" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation />
      <el-dialog :visible.sync="dialog" append-to-body title="修改备注" width="50%" :before-close="handleClose">
        <el-form ref="form" :inline="true" :model="formSize" :rules="rules" size="small" label-width="100px">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formSize.remark" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="uid" prop="uid" style="display: none">
            <el-input v-model="formSize.uid" style="width: 220px;display: none" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取 消</el-button>
          <!--<el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>-->
          <el-button type="primary" @click="updateRemark(formSize.remark,formSize.uid)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--Form表单-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" append-to-body width="730px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="主页链接" prop="home_url">
          <el-input v-model="form.home_url" style="width: 556px;" rows="8" type="textarea" />
          <!-- 爬虫用户信息 -->
          <!--<el-button style="margin-left: -2px" type="text" size="mini" @click="execute(form.home_url)">执行</el-button>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column prop="avatar_medium[0]" width="55">
        <template slot-scope="{row}">
          <el-image
            :src="row.avatar_medium[0]"
            :preview-src-list="[row.avatar_medium[0]]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="nickname" label="名称" />
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
      <el-table-column :show-overflow-tooltip="true" prop="unique_id" label="抖音号" />
      <el-table-column :show-overflow-tooltip="true" prop="aweme_count" label="作品数" />
      <el-table-column :show-overflow-tooltip="true" prop="follower_count" label="粉丝数" />
      <el-table-column :show-overflow-tooltip="true" prop="create_time" width="136px" label="创建日期" />
      <el-table-column label="操作" width="170px" align="center" fixed="right">
        <template slot-scope="scope">
          <!--<el-popover-->
          <!--:ref="scope.row.id"-->
          <!--placement="top"-->
          <!--width="200"-->
          <!--&gt;-->
          <!--<p>确定删除吗？</p>-->
          <!--<div style="text-align: right; margin: 0">-->
          <!--<el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>-->
          <!--<el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>-->
          <!--</div>-->
          <!--<el-button slot="reference" type="text" size="mini">删除</el-button>-->
          <!--</el-popover>-->
          <el-button size="mini" style="margin-right: 3px;" type="text" @click="doLog(scope.row.uid)">修改备注</el-button>
          <el-button size="mini" style="margin-right: 2px" type="text">
            <router-link :to="'/doum/user/detail/' + scope.row.unique_id">
              作品详情
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/doum/user'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import request from '@/utils/request'

const defaultForm = { home_url: null, sec_user_id: null, nickname: null, accountId: null, avatar: null }
export default {
  name: 'UserMinotor',
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '用户监控', url: 'api/doum/users', crudMethod: { ...crudJob }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delLoading: false,
      dialogVisible: false,
      dialog: false,
      formSize: {
        remark: ''
      },
      rules: {
        home_url: [
          { required: true, message: '请输入用户主页链接', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 用户信息爬虫
    execute(home_url) {
      const params = { home_url: home_url }
      crudJob.execution(params).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    delMethod(id) {
      this.delLoading = true
      crudJob.del([id]).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    // 修改备注
    doLog(id) {
      this.dialog = true
      this.getRemark(id).then(res => {
        this.formSize.remark = res.remark
        this.formSize.uid = res.uid
      }).catch(() => {
      })
    },
    getRemark(id) {
      return request({
        url: 'api/doum/users/updateRemark?uid=' + id,
        method: 'get'
      })
    },
    updateRemark(remark, uid) {
      const params = { remark: remark, uid: uid }
      return request({
        url: 'api/doum/users/updateRemark',
        method: 'post',
        params
      }).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.dialog = false
        setTimeout(() => {
          this.crud.toQuery()
        }, 800)
      }).catch(() => {
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    },
    handleClose(done) {
      done()
    }
  }
}
</script>
