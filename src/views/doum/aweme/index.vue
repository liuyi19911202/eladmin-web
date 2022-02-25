<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.nickname" clearable size="small" placeholder="支持全局搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <date-range-picker v-model="query.create_time" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="nickname" label="作者" />
      <el-table-column :show-overflow-tooltip="true" prop="desc" label="标题" />
      <el-table-column :show-overflow-tooltip="true" prop="digg_count" width="100px" label="点赞" />
      <el-table-column :show-overflow-tooltip="true" prop="collect_count" width="100px" label="收藏" />
      <el-table-column :show-overflow-tooltip="true" prop="comment_count" width="100px" label="评论" />
      <el-table-column :show-overflow-tooltip="true" prop="share_count" width="100px" label="分享" />
      <el-table-column :show-overflow-tooltip="true" prop="share_url" label="视频地址" />
      <el-table-column :show-overflow-tooltip="true" prop="create_time" label="发布时间" />
      <el-table-column :show-overflow-tooltip="true" prop="update_time" label="创建时间" />
    </el-table>
    <!--分页 组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/doum/aweme'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  name: 'Aweme',
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '作品列表', url: 'api/aweme', crudMethod: { ...crudJob }})
  },
  mixins: [presenter(), header(), crud()],

  data() {
    return {
      delLoading: false,
      permission: {
        add: ['admin', 'aweme:add'],
        edit: ['admin', 'aweme:edit'],
        del: ['admin', 'aweme:del']
      }
    }
  },
  methods: {
    // 执行
    execute(id) {
      crudJob.execution(id).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    updateParams(id) {
      console.log(id)
    },
    // 显示日志
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>
