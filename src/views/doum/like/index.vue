<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.nickname" clearable size="small" placeholder="作者名称查询" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-select
          v-model="query.dateBetweenEnum"
          clearable
          size="small"
          placeholder="时间筛选"
          class="filter-item"
          style="width: 130px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in enabledTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="query.with_goods"
          clearable
          size="small"
          placeholder="是否挂车"
          class="filter-item"
          style="width: 130px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in withGoodsOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="nickname" label="作者" />
      <el-table-column :show-overflow-tooltip="true" prop="unique_id" label="抖音号" />
      <el-table-column width="55" align="center" prop="with_goods">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.with_goods" icon-class="shopping" />
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="desc" label="标题" />
      <el-table-column :show-overflow-tooltip="true" width="100" prop="extra[0].sales" label="销量" />
      <el-table-column :show-overflow-tooltip="true" width="100" prop="sales_diff" label="销量增长">
        <template slot-scope="scope">
          {{ scope.row.sales_diff==0?'':scope.row.sales_diff }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="digg_count" width="100px" label="当前点赞" />
      <el-table-column :show-overflow-tooltip="true" prop="diff" width="100px" label="点赞增长" />
      <el-table-column prop="share_url" label="视频地址">
        <template slot-scope="scope">
          <a
            slot="reference"
            :href="scope.row.share_url"
            class="el-link--primary"
            style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
            target="_blank"
          >
            {{ scope.row.share_url }}
          </a>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="create_time" label="发布时间" />
      <el-table-column :show-overflow-tooltip="true" prop="update_time" label="创建时间" />
      <el-table-column label="操作" width="55" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-right: 2px" type="text">
            <router-link :to="'/doum/like/detail/' + scope.row.aweme_id">
              详情
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/doum/like'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'Like',
  components: { pagination, crudOperation, rrOperation },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  },
  cruds() {
    return CRUD({ title: '点赞趋势', url: 'api/aweme/like', crudMethod: { ...crudJob }})
  },
  mixins: [presenter(), header(), crud()],

  data() {
    return {
      delLoading: false,
      enabledTypeOptions: [
        { key: 'TWO_HOUR', display_name: '最近2小时' },
        { key: 'FOUR_HOUR', display_name: '最近4小时' },
        { key: 'SIX_HOUR', display_name: '最近6小时' },
        { key: 'ONE_DAY', display_name: '最近24小时' }
      ],
      withGoodsOptions: [
        { key: true, display_name: '挂车' },
        { key: false, display_name: '不挂车' }
      ]
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
