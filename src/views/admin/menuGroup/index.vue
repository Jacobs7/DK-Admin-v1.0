<template>
  <div class="app-container calendar-list-container">

    <!-----------------------------------------工具条------------------------------------------->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="menuGroupManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>

    <!-----------------------------------------Table------------------------------------------->
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="组名称">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="图标">
        <template scope="scope">
          <span>{{scope.row.icon}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.orderNum}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="描述">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" prop="enabled" label="启用禁用" :formatter="enableFormater">

      </el-table-column>


      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="menuGroupManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="menuGroupManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-----------------------------------------分页------------------------------------------->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!----------------------------------------弹出框----------------------------------------->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>


        <el-form-item label="状态">
          <el-select class="filter-item" v-model="form.enabled" placeholder="请选择">
            <el-option v-for="item in  enableOptions" :key="item" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
  // import  ajax请求对象 from 请求地址路径
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from 'api/admin/menuGroup/index';

  import {mapGetters} from 'vuex';

  export default {
    name: 'menuGroup',
    data() {
      return {
        form: {
          code: undefined,
          title: undefined,
          icon: undefined,
          description: undefined,
          enableOptions: '0'
        },
        rules: {
          code: [
            {
              required: true,
              message: '请输入路径编码',
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
              message: '请输入标题',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], icon: [
            {
              required: true,
              message: '请输入图标',
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
              message: '请输入描述',
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
        menuGroupManager_btn_edit: false,
        menuGroupManager_btn_del: false,
        menuGroupManager_btn_add: false,
        enableOptions: [{label:'启用',value:'1'},{label:'禁用',value:'0'}],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.menuGroupManager_btn_edit = this.elements['menuGroupManager:btn_edit'];
      this.menuGroupManager_btn_del = this.elements['menuGroupManager:btn_del'];
      this.menuGroupManager_btn_add = this.elements['menuGroupManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
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
      enableFormater(row, column){
        if(row.enabled === '0'){
          return '禁用'
        }else{
          return '启用'
        }
      },
      resetTemp() {
        this.form = {
          username: undefined,
          name: undefined,
          enabled: '启用',
          password: undefined,
          description: undefined
        };
      }
    }
  }
</script>
