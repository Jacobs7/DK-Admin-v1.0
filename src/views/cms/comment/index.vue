<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="commentManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="comment_id" width="65">
        <template scope="scope">
          <span>{{scope.row.commentId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="回复楼中楼编号回复楼中楼编号">
        <template scope="scope">
          <span>{{scope.row.pid}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="文章编号">
        <template scope="scope">
          <span>{{scope.row.articleId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户编号">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="评论内容">
        <template scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="状态(-1:不通过,0:未审核,1:通过)">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="评论人ip地址">
        <template scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="评论人终端信息">
        <template scope="scope">
          <span>{{scope.row.agent}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="所属系统">
        <template scope="scope">
          <span>{{scope.row.systemId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.ctime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="commentManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="commentManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="回复楼中楼编号回复楼中楼编号" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入回复楼中楼编号回复楼中楼编号"></el-input>
        </el-form-item>
        <el-form-item label="文章编号" prop="articleId">
          <el-input v-model="form.articleId" placeholder="请输入文章编号"></el-input>
        </el-form-item>
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户编号"></el-input>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入评论内容"></el-input>
        </el-form-item>
        <el-form-item label="状态(-1:不通过,0:未审核,1:通过)" prop="status">
          <el-input v-model="form.status" placeholder="请输入状态(-1:不通过,0:未审核,1:通过)"></el-input>
        </el-form-item>
        <el-form-item label="评论人ip地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入评论人ip地址"></el-input>
        </el-form-item>
        <el-form-item label="评论人终端信息" prop="agent">
          <el-input v-model="form.agent" placeholder="请输入评论人终端信息"></el-input>
        </el-form-item>
        <el-form-item label="所属系统" prop="systemId">
          <el-input v-model="form.systemId" placeholder="请输入所属系统"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="ctime">
          <el-input v-model="form.ctime" placeholder="请输入创建时间"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from 'api/cms/comment/index';
  import { mapGetters } from 'vuex';

  export default {
    name: 'comment',
    data() {
      return {
        form: {
          pid: undefined,
          articleId: undefined,
          userId: undefined,
          content: undefined,
          status: undefined,
          ip: undefined,
          agent: undefined,
          systemId: undefined,
          ctime: undefined
        },
        rules: {
          pid: [
            {
              required: true,
              message: '请输入回复楼中楼编号回复楼中楼编号',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], articleId: [
            {
              required: true,
              message: '请输入文章编号',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], userId: [
            {
              required: true,
              message: '请输入用户编号',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], content: [
            {
              required: true,
              message: '请输入评论内容',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], status: [
            {
              required: true,
              message: '请输入状态(-1:不通过,0:未审核,1:通过)',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], ip: [
            {
              required: true,
              message: '请输入评论人ip地址',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], agent: [
            {
              required: true,
              message: '请输入评论人终端信息',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], systemId: [
            {
              required: true,
              message: '请输入所属系统',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], ctime: [
            {
              required: true,
              message: '请输入创建时间',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        commentManager_btn_edit: false,
        commentManager_btn_del: false,
        commentManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.commentManager_btn_edit = this.elements['commentManager:btn_edit'];
      this.commentManager_btn_del = this.elements['commentManager:btn_del'];
      this.commentManager_btn_add = this.elements['commentManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          description: undefined
        };
      }
    }
  }
</script>
