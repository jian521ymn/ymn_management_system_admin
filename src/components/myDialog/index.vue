<template>
  <div class="">
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="35%"
    >
      <slot name="body"></slot>
      <div name="footer" class="dialog-footer">
        <el-button @click="cancel()">{{ cancelText }}</el-button>
        <el-button :loading="loadingConfirm" type="primary" @click="confirm()">{{
          confirmText
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    title: {
      type: String,
      default: "提示",
    },
    cancel: {
      type: Function,
      default: () => {},
    },
    confirm: {
      type: Function,
      default: () => {},
    },
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    showConfirmBtn: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    loadingConfirm:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    beforeClose(done) {
      this.cancel();
      done();
    },
  },
};
</script>

<style lang="less" scoped>
.a {
}
</style>