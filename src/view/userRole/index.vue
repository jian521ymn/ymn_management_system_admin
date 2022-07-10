<template>
  <div>
    <div class="search tl">
      <el-form :inline="true" :model="formData">
        <el-form-item label="查询角色名称">
          <el-input
            v-model="formData.name"
            placeholder="输入角色名称"
            clearable
          ></el-input>
        </el-form-item>
        <div class="tr">
          <el-form-item>
            <el-button type="primary" @click="onAdd">新增</el-button>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" size="small">
        <el-table-column
          v-for="item in userConfigColumns"
          :key="item.uuid"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 0"
          :align="item.align || 'left'"
          :formatter="item.formatter"
        />
      </el-table>
      <el-pagination
        class="tr"
        @current-change="handleCurrentChange"
        :current-page="this.pageNum"
        :page-size="this.pageSize"
        layout="total, prev, pager, next"
        :total="this.total"
      >
      </el-pagination>
    </div>
    <myDialog
      :title="dialogTitle"
      :dialogFormVisible="dialogFormVisible"
      :cancel="cancelDialog"
      :confirm="confirmDialog"
    >
      <el-form :model="form" slot="body" style="padding: 20px" >
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色级别" :label-width="formLabelWidth" class="tl" style="margin: auto 0">
          <el-rate v-model="form.roleLevel" show-text> </el-rate>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拥有权限" :label-width="formLabelWidth">
          <el-input v-model="form.roles" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </myDialog>
  </div>
</template>

<script>
import http from "../../utils/http";
import myDialog from "@/components/myDialog";
const userConfigColumns = [
  { prop: "id", label: "id", width: "120", align: "center" },
  { prop: "roleName", label: "角色名称", width: "120", align: "center" },
  { prop: "roleLevel", label: "角色级别", width: "120", align: "center" },
  { prop: "operatingTime", label: "操作时间", width: "170", align: "center" },
  { prop: "operatingor", label: "操作人", align: "center", width: "120" },
  { prop: "remark", label: "备注", width: "220", align: "center" },
  { prop: "permissions", label: "拥有权限", align: "center" },
  { prop: "oper", label: "操作", align: "center" },
];
export default {
  name: "userConfig",
  components: {
    myDialog,
  },
  data() {
    return {
      formData: {},
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      userConfigColumns,
      dialogTitle: "新增",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {},
      rules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  watch: {
    pageNum() {
      this.getList();
    },
  },
  methods: {
    getList() {
      const params = {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.formData,
        },
      };
      http.get("user/role/list", params).then((res) => {
        const { list, total } = res?.data || {};
        this.tableData = list || [];
        this.total = total;
      });
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
    },
    onSubmit() {
      this.getList();
    },
    onAdd() {
      this.dialogFormVisible = true;
    },
    confirmDialog() {
      this.dialogFormVisible = false;
    },
    cancelDialog() {
      console.log(222);
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style scoped>
  .el-rate{
    margin-top: 10px;
  }
</style>