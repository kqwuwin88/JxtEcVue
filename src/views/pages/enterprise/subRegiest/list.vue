<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="账号名称" v-model="formInline.corpName" />
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="editRow()" icon="el-icon-plus">申请子账号</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="corpName" label="账号名称" min-width="220"></el-table-column>
                    <el-table-column prop="signName" label="短信签名" width=""></el-table-column>
                    <el-table-column prop="srcAddr" label="接入号" width=""></el-table-column>
                    <el-table-column prop="content" label="附件" width="220">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="m-color" @click="toView1(scope.row)">营业执照</a>
                            <el-divider direction="vertical"></el-divider>
                            <a href="javascript:;" class="m-color" @click="toView2(scope.row)">合同</a>
                            <el-divider direction="vertical"></el-divider>
                            <a href="javascript:;" class="m-color" @click="toView3(scope.row)">使用说明</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="申请时间" width="160"></el-table-column>
                    <el-table-column prop="status" label="当前状态" width="100">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140" align="">
                        <template slot-scope="scope">
                            <i class="el-icon-edit-outline row_icon_link" v-if="(scope.row.status== 0||scope.row.status == 2)" @click="editRow(scope.row)" title="修改"></i>
                            <i class="el-icon-delete row_icon_link" v-if="(scope.row.status == 0||scope.row.status == 2)" @click="delRow(scope.row)" title="删除"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <vsd-ico-dialog icon="11" title="图片预览" :visible.sync="dialogViewVisible" width="500px">
            <div class="img_wrap">
                <img :src="$baseUrl + viewPic">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogViewVisible = false" type="primary" plain size="small">关 闭</el-button>
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
            dialogViewVisible:false,
			formInline:{
                corpName:'',
			},
            viewPic:'',
			tableData:[],
		}
	},
    filters:{
        filterStatus(val){
            const obj = {0:'审核中', 1:'数据制作中', 2:'审核未通过', 3:'已完成'}
			return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.$nextTick(()=>{
            this.queryList();
        })
	},
  	watch: {
    },
  	computed: {
    },
	mounted(){},
	methods:{
        toView1(row){
            this.dialogViewVisible = true
            this.viewPic = row.businessLicense
        },
        toView2(row){
            // window.location.href=this.$baseUrl + row.agreementDoc;
            this.$open(this.$baseUrl + row.agreementDoc)
        },
        toView3(row){
            this.$open(this.$baseUrl + row.booklet)
        },
        editRow(row){
            if(row){
                this.$router.push('/subRegiest/edit?id='+row.id)
            }else{
                this.$router.push('/subRegiest/add')
            }
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.childCorpRegistList({...this.formInline,page:this.page}).then( res => { 
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
				this.$api.deleteCorpRegist({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
	}
}
</script>