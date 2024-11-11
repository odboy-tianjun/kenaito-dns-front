<template>
  <d2-container>
    <template slot="header">
      <div style="text-align: right">
        <el-button type="primary" @click="queryPage(1, pageSize)">刷新</el-button>
      </div>
    </template>
    <el-table
      :data="tableData"
      height="520"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="version"
        label="版本记录">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="isRelease"
        label="当前启用版本"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isRelease === 1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="handleRollbackClick(scope.row)" type="text" size="small" :disabled="scope.row.isRelease === 1">回滚</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
  </d2-container>
</template>

<script>
import api from '@/api'
import { Message } from 'element-ui'

export default {
  name: 'ResolveRecord',
  data () {
    return {
      // 数据表格
      tableData: [],
      // 分页组件
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted () {
    this.queryPage(1, this.pageSize)
  },
  methods: {
    async queryPage (page, pageSize) {
      const queryArgs = {
        page: page,
        pageSize: pageSize
      }
      // 参看 src/api/modules/sys.core.api.js
      const res = await api.CORE_QUERY_VERSION_PAGE(queryArgs)
      this.tableData = res.data || []
      this.total = res.count || 0
    },
    handleCurrentChange (current) {
      this.currentPage = current
      this.queryPage(current, this.pageSize)
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.queryPage(1, this.pageSize)
    },
    handleRollbackClick (row) {
      const _this = this
      _this.$confirm('确认回滚选中的版本记录, 是否继续?', '确认回滚', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.doRollback(row)
        setTimeout(function () {
          _this.queryPage(1, _this.pageSize)
        }, 1000)
      }).catch(() => {
      })
    },
    async doRollback (row) {
      const res = await api.CORE_ROLLBACK({ ...row })
      if (res.code === 0) {
        Message.success(res.message)
        this.onSearchFormSubmit()
      }
    }
  }
}
</script>
