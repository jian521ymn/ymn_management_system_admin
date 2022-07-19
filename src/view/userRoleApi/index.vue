<template>
  <div>
    <div class="search tl">
      <el-tabs v-model="systemKey" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabData"
          :key="item.value"
          :label="item.value"
          :name="item.label"
        />
      </el-tabs>
      <div class="tr" style="margin-right: 40px">
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button
          type="primary"
          @click="batchEnable(true)"
          :disabled="!multipleSelection.length"
          >批量启用</el-button
        >
        <el-button
          type="primary"
          @click="batchEnable(false)"
          :disabled="!multipleSelection.length"
          >批量关闭</el-button
        >
      </div>
    </div>
    <div class="table" style="margin-left: 20px; margin-top: 50px">
      <el-table
        :data="tableData"
        :border="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-key="rowKey"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
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
            <span v-else>{{
              item.formatter ? item.formatter(scope.row) : scope.row[item.prop]
            }}</span>
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
      <el-form
        :model="form"
        slot="body"
        style="padding: 20px"
        :rules="rules"
        class="tl"
        ref="form"
      >
        <el-form-item
          label="接口路径"
          :label-width="formLabelWidth"
          prop="path"
        >
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接口备注" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            style="display: block; margin-top: 10px"
            v-model="form.isEnable"
            active-text="接口开启时可进行鉴权，未启用时不生效"
          />
        </el-form-item>
      </el-form>
    </myDialog>
  </div>
</template>

<script>
import http from "../../utils/http";
import myDialog from "@/components/myDialog";
import dayjs from "dayjs";
import { formValidate } from "utils/index";

const roleLevelList = [
  { label: "1", value: "一级" },
  { label: "2", value: "二级" },
  { label: "3", value: "三级" },
  { label: "4", value: "四级" },
  { label: "5", value: "五级" },
];
const userConfigColumns = () => [
  { prop: "id", label: "id", width: "120", align: "center" },
  { prop: "parentId", label: "所属项目", width: "120", align: "center" },
  { prop: "path", label: "接口路径", width: "150", align: "center" },
  {
    prop: "operatingTime",
    label: "操作时间",
    width: "170",
    align: "center",
    formatter: (row) => dayjs(row.operatingTime).format("YYYY-MM-DD HH:mm:ss"),
  },
  { prop: "operatingor", label: "操作人", align: "center", width: "120" },
  { prop: "remark", label: "备注", width: "220", align: "center" },
  {
    prop: "isEnable",
    label: "是否启用",
    width: "120",
    align: "center",
    formatter: (row) => (row.isEnable === "1" ? "是" : "否"),
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
      form: { isEnable: false },
      roleLevelList,
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        permissions: [
          { required: true, message: "请选择权限", trigger: "blur" },
        ],
      },
      tabData: [],
      multipleSelection: [],
      systemKey: "build_platform",
    };
  },
  created() {
    this.getList();
    this.getSystemList();
  },
  watch: {
    systemKey() {
      this.pageNum = 1;
      this.getList({ pageNum: 1 });
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getList(query) {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        systemKey: this.systemKey,
      };
      params = Object.assign({}, params, query || {});
      http.get("user/role/api/list", { params }).then((res) => {
        const { list, total } = res?.data || {};
        this.tableData = list || [];
        this.total = total;
      });
    },
    getSystemList() {
      http.get("user/role/api/system_list").then((res) => {
        const data = res?.data || {};
        this.tabData = data;
      });
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    onSubmit() {
      this.getList();
    },
    onAdd() {
      this.dialogTitle = "新增";
      this.form = { isEnable: false };
      this.dialogFormVisible = true;
    },
    onEdit(uuid) {
      this.dialogTitle = "编辑";
      this.dialogFormVisible = true;
      this.getUserRoleInfo(uuid);
    },
    onDel(uuid) {
      const params = {
        params: {
          uuid,
        },
      };
      http.get("user/role/api/delete", params).then(() => {
        this.successMsg("删除成功！");
        this.getList();
      });
    },
    getUserRoleInfo(uuid) {
      const params = {
        params: {
          uuid,
        },
      };
      http.get("user/role/api/info", params).then((res) => {
        const data = res?.data || {};
        this.form = {
          ...data,
          isEnable: data.isEnable === "1",
        };
      });
    },
    confirmDialog() {
      formValidate(this, "form")
        .then((valid) => {
          if (valid) {
            const addOrEdit =
              this.dialogTitle === "编辑"
                ? "/user/role/api/update"
                : "/user/role/api/add";
            return http.post(addOrEdit, {
              ...this.form,
              parentId: this.systemKey,
              isEnable: this.form.isEnable ? "1" : "0",
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowKey(row) {
      return row.uuid;
    },
    batchEnable(val) {
      http.post("/user/role/api/batch_edit", {
        ids: this.multipleSelection.map((item) => item.id),
        isEnable: val ? "1" : "0",
      })
      .then(res=>{
        if(res.code !== 0) {
          this.errorMsg('批量更新失败');
          return
        }
        this.pageNum=1;
        this.successMsg('批量更新成功！')
        this.getList()
      })
    },
  },
};
</script>
<style scoped>
.el-rate {
  margin-top: 10px;
}
</style>