<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-date-picker
                        title="统计时间"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        :clearable="true"
                        range-separator="~"
                        style="width:240px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="msgId" label="彩信主题" width=""></el-table-column>
                    <el-table-column prop="contentId" label="彩信内容" width="120">
                        <template slot-scope="scope">
                            <i class="el-icon-view row_icon_link" @click="toView(scope.row)" title="查看内容"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="staffId" label="创建人" width="180"></el-table-column>
                    <el-table-column prop="submitTime" label="添加时间" width="160"></el-table-column>
                    <el-table-column prop="userNum" label="用户数" min-width="120"></el-table-column>
                    <el-table-column label="操作" width="220" align="">
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
        <mmsView ref="mmsView" :msgType="0"></mmsView>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
import mmsView from '@/components/mms-view'
import moment from 'moment'
export default {
	data(){
		return {
            date:[],
			formInline:{
                beginTime:'',
                endTime:'',
			},
			tableData:[],
		}
	},
    filters:{
    },
	mixins:[pagination,storeData],
	components: {mmsView},
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(7, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
        this.$nextTick(()=>{
            this.queryList();
        })
	},
  	watch: {
        date:{
            handler(val){
                if(val && val.length){
                    this.formInline.beginTime = val[0]
                    this.formInline.endTime = val[1]
                }else{
                    this.formInline.beginTime = ''
                    this.formInline.endTime = ''
                }
            },
            immediate:true
        }
    },
  	computed: {
    },
	mounted(){},
	methods:{
        toView(row){
            this.$refs.mmsView.queryView(row.content)
        },
        editRow(row){
            this.$router.push('/mmsDraft/edit?id='+row.id)
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.mmsDraftList({...this.formInline,page:this.page}).then( res => { 
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
				this.$api.deleteMmsDraft({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
	}
}
</script>