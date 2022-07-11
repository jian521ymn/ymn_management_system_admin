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
      <el-table :data="tableData" :border="true" style="width: 100%" >
        <el-table-column
          v-for="item in userConfigColumns"
          :key="item.uuid"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 0"
          :align="item.align || 'left'"
          :formatter="item.formatter"
        >
          <template slot-scope="scope">
            <span v-if="item.prop === 'oper'">
              <el-button type="primary" @click="onEdit(scope.row.uuid)"
                >编辑</el-button
              >
              <el-button type="danger" @click="onDel(scope.row.uuid)"
                >删除</el-button
              >
            </span>
            <span v-else>{{ item.formatter ? item.formatter(scope.row) : scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
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
      <el-form :model="form" slot="body" style="padding: 20px" :rules="rules" class="tl" ref="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色级别" :label-width="formLabelWidth" style="margin: auto 0" prop="roleLevel">
          <el-rate v-model="form.roleLevel" show-text> </el-rate>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拥有权限" :label-width="formLabelWidth" prop="permissions">
          <el-input v-model="form.permissions" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </myDialog>
  </div>
</template>

<script>
import http from "../../utils/http";
import myDialog from "@/components/myDialog";
import { formValidate } from "utils/index";
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
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        roleLevel: [{ required: true, message: "请选择角色级别", trigger: "blur",validator:(rule, value, callback)=>{
          console.log(value,'values');
          if(!value) {
            callback(new Error('请选择角色级别'));
          }else{
            callback();
          }
        } }],
        permissions: [{ required: true, message: "请选择权限", trigger: "blur" }],
      },
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
      this.dialogTitle = "新增";
      this.form = {permissions:[]}
      this.dialogFormVisible = true;
    },
    confirmDialog() {
      formValidate(this, "form")
        .then((valid) => {
          if (valid) {
            const addOrEdit = this.dialogTitle === '编辑' ? '/user/role/update' : '/user/role/add'
            return http.post(addOrEdit, {
              ...this.form,
              permissions: (this.form.permissions || []).join(),
            });
          }
          return Promise.reject();
        })
        .then(() => {
          this.dialogFormVisible = false;
          this.getList();
        });
    },
    cancelDialog() {
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