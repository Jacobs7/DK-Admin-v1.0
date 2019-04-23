<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="articleManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="article_id" width="65">
        <template scope="scope">
          <span>{{scope.row.articleId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="所属专题">
        <template scope="scope">
          <span>{{scope.row.topicId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="文章标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="文章原作者">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="转载来源网址">
        <template scope="scope">
          <span>{{scope.row.fromurl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="封面图">
        <template scope="scope">
          <span>{{scope.row.image}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="关键字">
        <template scope="scope">
          <span>{{scope.row.keywords}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="简介">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="类型(1:普通,2:热门...)" >
        <template scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="是否允许评论(0:不允许,1:允许)">
        <template scope="scope">
          <span>{{scope.row.allowcomments}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="状态(-1:不通过,0未审核,1:通过)">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="内容">
        <template scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="发布人id">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>


      <el-table-column width="200px" align="center" label="发布人名称">
        <template scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="阅读数量">
        <template scope="scope">
          <span>{{scope.row.readnumber}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="置顶等级">
        <template scope="scope">
          <span>{{scope.row.top}}</span>
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
      <el-table-column width="200px" align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.orders}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="articleManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="articleManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
        <el-form-item label="所属专题" prop="topicId">
          <el-input v-model="form.topicId" placeholder="请输入所属专题"></el-input>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章原作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入文章原作者"></el-input>
        </el-form-item>
        <el-form-item label="转载来源网址" prop="fromurl">
          <el-input v-model="form.fromurl" placeholder="请输入转载来源网址"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="image">
          <el-input v-model="form.image" placeholder="请输入封面图"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="form.description" placeholder="请输入简介"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请输入类型(1:普通,2:热门...)">
            <el-option value="1">普通</el-option>
            <el-option value="2">热门</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否允许评论" prop="allowcomments">
          <el-select v-model="form.allowcomments" placeholder="请输入是否允许评论(0:不允许,1:允许)">
            <el-option
              v-for="item in optionsAllow" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请输入状态(-1:不通过,0未审核,1:通过)">

            <el-option
              v-for="item in optionsStatus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>

           
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="发布人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入发布人id"></el-input>
        </el-form-item>
        <el-form-item label="阅读数量" prop="readnumber">
          <el-input v-model="form.readnumber" placeholder="请输入阅读数量"></el-input>
        </el-form-item>
        <el-form-item label="置顶等级" prop="top">
          <el-input v-model="form.top" placeholder="请输入置顶等级"></el-input>
        </el-form-item>
        <el-form-item label="所属系统" prop="systemId">
          <el-input v-model="form.systemId" placeholder="请输入所属系统"></el-input>
        </el-form-item>
        <!--<el-form-item label="创建时间" prop="ctime">-->
          <!--<el-input v-model="form.ctime" placeholder="请输入创建时间"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="排序" prop="orders">-->
          <!--<el-input v-model="form.orders" placeholder="请输入排序"></el-input>-->
        <!--</el-form-item>-->
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
  } from 'api/cms/article/index';
  import { mapGetters } from 'vuex';


  export default {
    name: 'article',
    data: function () {
      return {
        form: {
          topicId: undefined,
          title: undefined,
          author: undefined,
          fromurl: undefined,
          image: undefined,
          keywords: undefined,
          description: undefined,
          type: undefined,
          allowcomments: [{
            value: '0',
            label: '不允许'
          }, {
            value: '1',
            label: '允许'
          }],
          status: undefined,
          content: undefined,
          userId: undefined,
          readnumber: undefined,
          top: undefined,
          systemId: undefined,
          ctime: undefined,
          orders: undefined
        },
        rules: {
          topicId: [
            {
              required: true,
              message: '请输入所属专题',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], title: [
            {
              required: true,
              message: '请输入文章标题',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], author: [
            {
              required: true,
              message: '请输入文章原作者',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], fromurl: [
            {
              required: true,
              message: '请输入转载来源网址',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], image: [
            {
              required: true,
              message: '请输入封面图',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], keywords: [
            {
              required: true,
              message: '请输入关键字',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], description: [
            {
              required: true,
              message: '请输入简介',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], type: [
            {
              required: true,
              message: '请输入类型(1:普通,2:热门...)',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], allowcomments: [
            {
              required: true,
              message: '请输入是否允许评论(0:不允许,1:允许)',
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
              message: '请输入状态(-1:不通过,0未审核,1:通过)',
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
              message: '请输入内容',
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
              message: '请输入发布人id',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], readnumber: [
            {
              required: true,
              message: '请输入阅读数量',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], top: [
            {
              required: true,
              message: '请输入置顶等级',
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
          ], orders: [
            {
              required: true,
              message: '请输入排序',
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
        articleManager_btn_edit: false,
        articleManager_btn_del: false,
        articleManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        optionsAllow: [{
          value: '0',
          label: '不允许'
        }, {
          value: '1',
          label: '允许'
        }],
        optionsStatus: [{
          value: '-1',
          label: '不通过'
        }, {
          value: '0',
          label: '未审核'
        }, {
          value: '1',
          label: '通过'
        }]
      }
    },
    created() {
      this.getList();
      this.articleManager_btn_edit = this.elements['articleManager:btn_edit'];
      this.articleManager_btn_del = this.elements['articleManager:btn_del'];
      this.articleManager_btn_add = this.elements['articleManager:btn_add'];
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
        getObj(row.articleId)
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
            delObj(row.articleId)
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
            putObj(this.form.articleId, this.form).then(() => {
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
