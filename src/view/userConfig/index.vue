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
            v-model="formData.userName"
            placeholder="输入用户名称"
            clearable
          ></el-input>
        </el-form-item>
        <div class="tr">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>
      <el-pagination
        class="tr"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="this.page.pageNum"
        :page-size="this.page.pageSize"
        layout="total, prev, pager, next"
        :total="this.page.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from "../../utils/http";
export default {
  name: "userConfig",
  data() {
    return {
      formData: {},
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      http.get("user/list").then((res) => {
        const { list, total, pageSize, pageNum } = res?.data || {};
        this.tableData = list || [];
        this.page = { total, pageSize, pageNum };
      });
    },
    handleCurrentChange(pageNum){
      console.log(pageNum);
    },
    onSubmit(value) {
      console.log(value, this.formData);
    },
  },
};
</script>