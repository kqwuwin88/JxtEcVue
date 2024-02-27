<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="类别名称" v-model="formInline.className" />
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="editRow()" icon="el-icon-plus">添加类别</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%" style="width:100%">
                    <el-table-column prop="className" label="类别名称" width=""></el-table-column>
                    <el-table-column prop="desc" label="描述" width=""></el-table-column>
                    <el-table-column label="操作" width="180" align="" fixed="right">
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
        <vsd-ico-dialog :title="dialogForm.id?'修改模板类别':'添加模板类别'" :icon="dialogForm.id?'06':'05'" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="500px">
            <el-form :model="dialogForm" label-position="top" ref="dialogForm">
                <el-form-item label="类别名称" prop="className" :rules="{ required: true, message: '请输入类别名称', trigger: 'blur' }">
                    <el-input v-model.trim="dialogForm.className" placeholder="请输入类别名称" maxlength="21" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="userId">
                    <el-input v-model.trim="dialogForm.desc" placeholder="请输入备注..." type="textarea" :rows="6" maxlength="300" show-word-limit></el-input>
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
export default {
	data(){
		return {
			formInline:{
                className:'',
			},
			dialogFormVisible:false,
			dialogForm:{
				className:'',
				desc:'',
                id:'',
			},
			tableData:[],
		}
	},
    filters:{
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.queryList()
	},
  	watch: {
    },
  	computed: {},
	mounted(){},
	methods:{
        editRow(row){
            if (row) {
				this.$api.getMmsClass({id:row.id}).then(res => {
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
			this.$api.mmsClassList({...this.formInline,page:this.page}).then( res => { 
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
				this.$api.deleteMmsClass({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
  		submitDialog(){
            console.log(this.dialogForm,'this.dialogForm')
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    const url = this.dialogForm.id === '' ? 'addMmsClass' : 'modifyMmsClass'
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