<template>
  <div>
    <div class="search tl">
      <el-form :inline="true" :model="formData">
        <el-form-item label="查询角色名称">
          <el-input v-model="formData.roleName" placeholder="输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="选择级别">
          <el-select v-model="formData.roleLevel" placeholder="请选择" clearable>
            <el-option v-for="item in roleLevelList" :key="item.label" :label="item.value" :value="item.label">
            </el-option>
          </el-select>
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
      <el-table :data="tableData" :border="true" style="width: 100%">
        <el-table-column v-for="item in userConfigColumns" :key="item.uuid" :prop="item.prop" :label="item.label"
          :width="item.width || 0" :align="item.align || 'left'" :formatter="item.formatter">
          <template slot-scope="scope">
            <span v-if="item.prop === 'oper'">
              <el-button type="primary" @click="onEdit(scope.row.uuid)">编辑</el-button>
              <el-button type="danger" @click="onDel(scope.row.uuid)">删除</el-button>
            </span>
            <span v-else>{{ item.formatter ? item.formatter(scope.row) : scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="tr" @current-change="handleCurrentChange" :current-page="this.pageNum"
        :page-size="this.pageSize" layout="total, prev, pager, next" :total="this.total">
      </el-pagination>
    </div>
    <myDialog :title="dialogTitle" :dialogFormVisible="dialogFormVisible" :cancel="cancelDialog"
      :confirm="confirmDialog">
      <el-form :model="form" slot="body" style="padding: 20px" :rules="rules" class="tl" ref="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色级别" :label-width="formLabelWidth" prop="roleLevel">
          <el-radio-group v-model="form.roleLevel">
            <el-radio v-for="role in roleLevelList" :label="role.label" :key="role.label">
              {{ role.value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拥有权限" :label-width="formLabelWidth" prop="permissions">
         <el-checkbox-group v-model="form.permissions">
            <el-checkbox v-for="api in permissionsList" :label="api.uuid" :key="api.uuid">
              {{`${api.parentId}-${api.remark}` }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </myDialog>
  </div>
</template>

<script>
import http from "../../utils/http";
import myDialog from "@/components/myDialog";
import dayjs from "dayjs"
import { formValidate } from "utils/index";

const roleLevelList = [
  { label: "1", value: '一级' },
  { label: "2", value: '二级' },
  { label: "3", value: '三级' },
  { label: "4", value: '四级' },
  { label: "5", value: '五级' },
]
const userConfigColumns = (permissionsList) => [
  { prop: "id", label: "id", width: "120", align: "center" },
  { prop: "roleName", label: "角色名称", width: "120", align: "center" },
  {
    prop: "roleLevel", label: "角色级别", width: "120", align: "center",
    formatter: (row) => roleLevelList.filter(item => row.roleLevel === item.label)[0].value
  },
  {
    prop: "operatingTime", label: "操作时间", width: "170", align: "center",
    formatter: (row) => dayjs(row.operatingTime).format("YYYY-MM-DD HH:mm:ss")
  },
  { prop: "operatingor", label: "操作人", align: "center", width: "120" },
  { prop: "remark", label: "备注", width: "220", align: "center" },
  { prop: "permissions", label: "拥有权限", align: "center",
     formatter: (row) => permissionsList.filter(item=>(row.permissions.split(',').includes(`${item.uuid}`))).map(item =>`${item.parentId}-${item.remark}`).join()
  },
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
      userConfigColumns: userConfigColumns(roleLevelList),
      dialogTitle: "新增",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: { roleLevel: [] },
      roleLevelList,
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        roleLevel: [{
          required: true, message: "请选择角色级别", trigger: "blur", validator: (rule, value, callback) => {
            console.log(value, 'values');
            if (!value) {
              callback(new Error('请选择角色级别'));
            } else {
              callback();
            }
          }
        }],
        permissions: [{ required: true, message: "请选择权限", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getPermissionsList()
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
    getPermissionsList(){
      const params = {
        params: {
          pageSize: 100,
          pageNum: 1,
        },
      };
      http.get("user/role/api/list", params).then((res) => {
        const { list } = res?.data || {};
        this.permissionsList = list || [];
        this.userConfigColumns = userConfigColumns(list || []);
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
      this.form = { permissions: [], roleLevel: [] }
      this.dialogFormVisible = true;
      this.getPermissionsList()
    },
    onEdit(uuid) {
      this.dialogTitle = "编辑";
      this.dialogFormVisible = true;
      this.getUserRoleInfo(uuid);
       this.getPermissionsList()
    },
    onDel(uuid) {
      const params = {
        params: {
          uuid,
        },
      };
      http.get("user/role/delete", params).then(() => {
        this.successMsg('删除成功！');
        this.getList();
      });
    },
    getUserRoleInfo(uuid) {
      const params = {
        params: {
          uuid,
        },
      };
      http.get("user/role/info", params).then((res) => {
        const data = res?.data || {};
        this.form = {
          ...data,
          permissions:data.permissions.split(',')
        }
      });
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
.el-rate {
  margin-top: 10px;
}
</style>