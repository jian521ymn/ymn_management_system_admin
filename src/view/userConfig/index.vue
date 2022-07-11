<template>
  <div>
    <div class="search tl">
      <el-form :inline="true" :model="formData">
        <el-form-item label="选择所属角色">
          <el-input
            v-model="formData.userRole"
            placeholder="选择所属角色"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="查询用户名称">
          <el-input
            v-model="formData.name"
            placeholder="输入用户名称"
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
      <el-table :data="tableData" border style="width: 100%">
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
      :loadingConfirm="loadingConfirm"
    >
      <el-form
        :model="form"
        slot="body"
        style="padding: 20px"
        class="tl"
        :rules="rules"
        ref="form"
      >
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="userName"
        >
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          :label-width="formLabelWidth"
          class="tl"
          prop="sex"
        >
          <el-radio-group v-model="form.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="拥有权限"
          :label-width="formLabelWidth"
          prop="roles"
        >
          <el-checkbox-group v-model="form.roles">
            <el-checkbox
              v-for="role in roleList"
              :label="role.id"
              :key="role.id"
            >
              {{ role.roleName }}
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
import { formValidate } from "utils/index";
const userConfigColumns = (roleList) => [
  { prop: "id", label: "id", width: "120", align: "center" },
  { prop: "userName", label: "姓名", width: "120", align: "center" },
  {
    prop: "sex",
    label: "性别",
    width: "120",
    align: "center",
    formatter: (row) => (row.sex === "1" ? "男" : "女"),
  },
  { prop: "address", label: "地址", width: "200", align: "center" },
  { prop: "email", label: "邮箱", width: "150", align: "center" },
  { prop: "phone", label: "手机号码", width: "150", align: "center" },
  { prop: "operatingTime", label: "操作时间", width: "150", align: "center" },
  { prop: "operatingor", label: "操作人", align: "center", width: "120" },
  {
    prop: "roles",
    label: "拥有角色",
    align: "center",
    formatter: (row) => {
      return roleList
        .filter(({ id }) => row.roles.split().includes(`${id}`))
        .map(({ roleName }) => roleName)
        .join();
    },
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
      userConfigColumns: userConfigColumns(this.roleList || []),
      dialogTitle: "新增",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loadingConfirm: false,
      form: {
        roles: [],
      },
      roleList: [],
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        roles: [{ required: true, message: "请选择权限", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getUserRoleList();
  },
  watch: {
    pageNum() {
      this.getList();
    },
  },
  methods: {
    getList(query) {
      let params= {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.formData,
        }
      params = Object.assign({},params,query)
      http.get("user/list", {params}).then((res) => {
        const { list, total } = res?.data || {};
        this.tableData = list || [];
        this.total = total;
      });
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
    },
    onSubmit() {
      this.getList({pageNum:1});
    },
    onAdd() {
      this.dialogTitle = "新增";
      this.form = {roles:[]}
      this.dialogFormVisible = true;
      this.getUserRoleList();
    },
    onEdit(uuid) {
      this.dialogTitle = "编辑";
      this.dialogFormVisible = true;
      this.getUserRoleList();
      this.getUserInfo(uuid);
    },
    onDel(uuid) {
      const params = {
        params: {
          uuid,
        },
      };
      http.get("user/delete", params).then(() => {
        this.successMsg('删除成功！');
        this.getList();
      });
    },
    confirmDialog() {
      formValidate(this, "form")
        .then((valid) => {
          if (valid) {
            this.loadingConfirm = true;
            const addOrEdit = this.dialogTitle === '编辑' ? '/user/update' : '/user/add'
            return http.post(addOrEdit, {
              ...this.form,
              roles: this.form.roles.join(),
            });
          }
          return Promise.reject();
        })
        .then(() => {
          this.loadingConfirm = false
          this.dialogFormVisible = false;
          this.getList();
        }).catch(()=>{
            this.loadingConfirm = false
        });
    },
    getUserRoleList() {
      const params = {
        params: {
          pageSize: 100,
          pageNum: 1,
        },
      };
      http.get("user/role/list", params).then((res) => {
        const { list } = res?.data || {};
        this.roleList = list || [];
        this.userConfigColumns = userConfigColumns(list || []);
      });
    },
    getUserInfo(uuid) {
      const params = {
        params: {
          uuid,
        },
      };
      http.get("user/info", params).then((res) => {
        const data = res?.data || {};
        this.form = {
          ...data,
          roles:(data.roles || '').split().map(item=>Number(item))
        }
      });
    },
    cancelDialog() {
      this.dialogFormVisible = false;
    },
  },
};
</script>