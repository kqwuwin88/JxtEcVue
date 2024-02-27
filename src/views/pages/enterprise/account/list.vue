<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.userType" placeholder="用户类别">
                        <el-option label="用户类别" value="-1"></el-option>
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="普通用户" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="editRow()" v-if="userinfo.userType =='1'" icon="el-icon-plus">添加用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div style="color:#666666" class="vsd-mb-10">注：普通用户只允许使用手机号码+短信验证码的方式登录。</div>
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%" style="width:100%">
                    <el-table-column prop="userId" label="账号" width=""></el-table-column>
                    <el-table-column prop="realName" label="用户姓名" width=""></el-table-column>
                    <el-table-column prop="mobile" label="手机号码" width=""></el-table-column>
                    <el-table-column prop="userType" label="用户类别" width="">
                        <template slot-scope="scope">
                            {{scope.row.userType | filterUserType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastLoginTime" label="最后登录时间" width=""></el-table-column>
                    <el-table-column label="操作" width="180" align="" fixed="right" v-if="userinfo.userType === '1'">
                        <template slot-scope="scope">
                            <i class="el-icon-edit-outline row_icon_link" @click="editRow(scope.row)" title="修改"></i>
                            <i class="el-icon-delete row_icon_link" @click="delRow(scope.row)" title="删除"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <vsd-ico-dialog :title="dialogForm.userId?'修改用户':'添加用户'" :icon="dialogForm.userId?'08':'07'" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="500px">
            <el-form :model="dialogForm" label-position="top" ref="dialogForm">
                <el-form-item label="姓名" prop="realName" :rules="{ required: true, message: '请输入姓名！', trigger: 'blur'}">
                    <el-input v-model.trim="dialogForm.realName" autocomplete="off" maxlength="20" placeholder="请输入姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile" :rules="{ required: true, message: '请输入手机号码！', trigger: 'blur'}">
                    <el-input v-model.trim="dialogForm.mobile" autocomplete="off" maxlength="11" placeholder="请输入手机号码" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDialog" size="small">确 定</el-button>
                <el-button @click="dialogFormVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </vsd-ico-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	data(){
		return {
			formInline:{
                userType:'',
			},
			dialogFormVisible:false,
			dialogForm:{
				realName:'',
				mobile:'',
                userId:'',
			},
			tableData:[],
		}
	},
    filters:{
        filterUserType(val){
            const obj = {1:'管理员', 0:'普通用户'}
			return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.queryList()
	},
  	watch: {
    },
  	computed: {
        ...mapState('allstore', {
            userinfo: state => state.user.userInfo,
        }),
    },
	mounted(){},
	methods:{
        editRow(row){
            if (row) {
				this.$api.getUserInfo({userId:row.userId}).then(res => {
					for (let key in this.dialogForm) {
						this.dialogForm[key] = res.info[key]
					}
                    this.dialogFormVisible = true
				}).catch(error => { })
			} else {
				for (let key in this.dialogForm) {
					this.dialogForm[key] = '';
				}
                this.dialogFormVisible = true
			}
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.userList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
      	delRow(row){
      		this.$confirm('确认删除吗？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
				this.$api.deleteUser({userId:row.userId}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
  		submitDialog(){
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    const url = this.dialogForm.userId === '' ? 'addUser' : 'modifyUser'
                    this.$api[url](this.dialogForm).then( res => { 
                        this.$message({message: '操作成功', type: 'success'});
                        this.searchList();
                        this.dialogFormVisible = false; 
                    }).catch(error=>{})
                } else {
                    return false;
                }
            });
		},
	}
}
</script>