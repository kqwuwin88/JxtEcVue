<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.status" placeholder="请选择">
                        <el-option label="当前状态" value="-1"></el-option>
                        <el-option label="未审核" value="0"></el-option>
                        <el-option label="审核通过" value="1"></el-option>
                        <el-option label="审核未通过" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.sendType" placeholder="请选择">
                        <el-option label="发送方式" value="-1"></el-option>
                        <el-option label="即时" value="0"></el-option>
                        <el-option label="定时" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="发送f时间"
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
                    <el-table-column prop="contentId" label="彩信内容" width="120">
                        <template slot-scope="scope">
                            <i class="el-icon-view row_icon_link" @click="toView(scope.row)" title="查看内容"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="当前状态" width="120">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status ===0">未审核</p>
                            <p v-if="scope.row.status ===1">审核通过</p>
                            <p v-if="scope.row.status ===2">审核未通过</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sendType" label="发送方式" width="140">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status ===0">即时</p>
                            <p v-if="scope.row.status ===1">定时</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userNum" label="用户数" width="100"></el-table-column>
                    <el-table-column prop="sendTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column label="操作" width="140" align="">
                        <template slot-scope="scope">
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
import mmsView from '@/components/mms-view'
import pagination from '@/mixins/pagination'
import moment from 'moment'
export default {
	data(){
		return {
            date:[],
			formInline:{
                beginTime:'',
                endTime:'',
                status:'-1',
                sendType:'-1',
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
        delRow(row){
      		this.$confirm('确认删除吗？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
				this.$api.deleteMmsCheck({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.mmsCheckList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
	}
}
</script>