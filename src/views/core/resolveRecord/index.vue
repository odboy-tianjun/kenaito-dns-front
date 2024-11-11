<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="formModel" ref="ruleForm">
        <el-form-item label="主机记录" prop="name">
          <el-input v-model="formModel.name" placeholder="主机记录"></el-input>
        </el-form-item>
        <el-form-item label="记录类型" prop="type">
          <el-select v-model="formModel.type" placeholder="记录类型">
            <el-option label="A记录" value="A"></el-option>
            <el-option label="AAAA记录" value="AAAA"></el-option>
            <el-option label="CNAME记录" value="CNAME"></el-option>
            <el-option label="MX记录" value="MX"></el-option>
            <el-option label="TXT记录" value="TXT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录值" prop="value">
          <el-input v-model="formModel.value" placeholder="记录值"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchFormSubmit">查询</el-button>
          <el-button @click="resetSearchForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="handleCreateClick" style="margin-left: 15px">添加记录</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      :data="tableData"
      height="520"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="主机记录">
      </el-table-column>
      <el-table-column
        prop="recordType"
        label="记录类型"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="ttl"
        label="TTL"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="value"
        label="记录值">
      </el-table-column>
      <el-table-column
        prop="enabled"
        label="是否启用"
        width="100"
      >
        <template slot-scope="scope">
          <el-switch :value="scope.row.enabled === 1" @change="(val)=>onTableRowEnabledChange(val, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="160"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="handleTestClick(scope.row)" type="text" size="small">生效测试</el-button>
          <el-button @click="handleModifyClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleRemoveClick(scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog title="新增解析记录" :visible.sync="createFormVisible" width="600px">
      <el-form :model="createFormModel" ref="saveForm" :rules="formRules">
        <el-form-item label="记录类型" label-width="120px" prop="type">
          <el-select v-model="createFormModel.type" placeholder="请选择记录类型" style="width: 75%" @change="onFormModelTypeChange">
            <el-option label="A - 将域名解析指向一个IPv4地址" value="A"></el-option>
            <el-option label="AAAA - 将域名解析指向一个IPv6地址" value="AAAA"></el-option>
            <el-option label="CNAME - 将域名解析指向另一个域名" value="CNAME"></el-option>
            <el-option label="MX - 将域名指向邮件服务器地址" value="MX"></el-option>
            <el-option label="TXT - 文本长度限制512, 通常做SPF记录(反垃圾邮件)" value="TXT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机记录" label-width="120px" prop="name">
          <el-input v-model="createFormModel.name" autocomplete="off" style="width: 75%" placeholder="请填写主机记录, 如：demo.odboy.com"></el-input>
        </el-form-item>
        <el-form-item label="TTL" label-width="120px" prop="ttl">
          <el-input-number v-model="createFormModel.ttl" :min="10" :max="1440" :step="1" step-strictly style="width: 75%"></el-input-number>
        </el-form-item>
        <el-form-item label="记录值" label-width="120px" prop="value">
          <el-input v-model="createFormModel.value" autocomplete="off" style="width: 75%" :placeholder="formPlaceholderMap[formPlaceholderType]"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改解析记录" :visible.sync="modifyFormVisible" width="600px">
      <el-form :model="modifyFormModel" ref="saveForm" :rules="formRules">
        <el-form-item label="记录类型" label-width="120px" prop="type">
          <el-select v-model="modifyFormModel.type" placeholder="请选择记录类型" style="width: 75%" @change="onFormModelTypeChange">
            <el-option label="A - 将域名解析指向一个IPv4地址" value="A"></el-option>
            <el-option label="AAAA - 将域名解析指向一个IPv6地址" value="AAAA"></el-option>
            <el-option label="CNAME - 将域名解析指向另一个域名" value="CNAME"></el-option>
            <el-option label="MX - 将域名指向邮件服务器地址" value="MX"></el-option>
            <el-option label="TXT - 文本长度限制512, 通常做SPF记录(反垃圾邮件)" value="TXT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机记录" label-width="120px" prop="name">
          <el-input v-model="modifyFormModel.name" autocomplete="off" style="width: 75%" placeholder="请填写主机记录, 如：demo.odboy.com"></el-input>
        </el-form-item>
        <el-form-item label="TTL" label-width="120px" prop="ttl">
          <el-input-number v-model="modifyFormModel.ttl" :min="10" :max="1440" :step="1" step-strictly style="width: 75%"></el-input-number>
        </el-form-item>
        <el-form-item label="记录值" label-width="120px" prop="value">
          <el-input v-model="modifyFormModel.value" autocomplete="off" style="width: 75%" :placeholder="formPlaceholderMap[formPlaceholderType]"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doModify">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api'
import { Message } from 'element-ui'

export default {
  name: 'ResolveRecord',
  data () {
    return {
      // 查询条件
      formModel: {
        name: '',
        type: '',
        value: ''
      },
      // 数据表格
      tableData: [],
      // 分页组件
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 对话框
      formRules: {
        name: [
          {
            required: true,
            message: '请输入主机记录',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择记录类型',
            trigger: 'change'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入记录值',
            trigger: 'blur'
          }
        ]
      },
      formPlaceholderType: '',
      formPlaceholderMap: {
        A: '请填写IPv4地址, 如：192.168.235.100',
        AAAA: '请填写IPv6地址, 如：ff03:0:0:0:0:0:0:c1',
        CNAME: '请填写CNAME指向的域名, 如：odboy.cn',
        MX: '请填写邮件系统服务器地址, 如：mx1.odboy.cn',
        TXT: '请填写记录值, 支持字母、数字和英文符号, 512个字符以内'
      },
      // 新增对话框
      createFormVisible: false,
      createFormDefaultModel: {
        name: '',
        type: '',
        ttl: 10,
        value: ''
      },
      createFormModel: {
        name: '',
        type: '',
        ttl: 10,
        value: ''
      },
      // 修改对话框
      modifyFormVisible: false,
      modifyFormModel: {}
    }
  },
  mounted () {
    this.onSearchFormSubmit()
  },
  methods: {
    async queryPage (page, pageSize) {
      const formModel = this.formModel
      const queryArgs = {
        page: page,
        pageSize: pageSize,
        ...formModel
      }
      // 参看 src/api/modules/sys.core.api.js
      const res = await api.CORE_QUERY_PAGE(queryArgs)
      this.tableData = res.data || []
      this.total = res.count || 0
    },
    onSearchFormSubmit () {
      this.queryPage(1, this.pageSize)
    },
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.onSearchFormSubmit()
    },
    handleCurrentChange (current) {
      this.currentPage = current
      this.queryPage(current, this.pageSize)
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.queryPage(1, this.pageSize)
    },
    async onTableRowEnabledChange (val, row) {
      const res = await api.CORE_SWITCH({ id: row.id, enabled: val === false ? 2 : 1 })
      if (res.code === 0) {
        Message.success(res.message)
        this.onSearchFormSubmit()
      }
    },
    onFormModelTypeChange (val) {
      this.formPlaceholderType = val
    },
    handleCreateClick () {
      this.createFormModel = { ...this.createFormDefaultModel }
      this.createFormVisible = true
    },
    async doCreate () {
      const res = await api.CORE_CREATE(this.createFormModel)
      if (res.code === 0) {
        Message.success(res.message)
        this.onSearchFormSubmit()
        this.createFormVisible = false
      }
    },
    async handleTestClick (row) {
      const res = await api.CORE_TEST_HOSTNAME(row)
      if (res.code === 0) {
        Message.success(res.message)
      }
    },
    handleModifyClick (row) {
      this.modifyFormModel = { ...row, type: row.recordType }
      this.modifyFormVisible = true
    },
    async doModify () {
      const res = await api.CORE_MODIFY(this.modifyFormModel)
      if (res.code === 0) {
        Message.success(res.message)
        this.onSearchFormSubmit()
        this.modifyFormVisible = false
      }
    },
    handleRemoveClick (row) {
      const _this = this
      _this.$confirm('确认删除选中的解析记录, 是否继续?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.doDelete(row)
      }).catch(() => {
      })
    },
    async doDelete (row) {
      const res = await api.CORE_DELETE({ ...row, type: row.recordType })
      if (res.code === 0) {
        Message.success(res.message)
        this.onSearchFormSubmit()
        this.modifyFormVisible = false
      }
    }
  }
}
</script>
