<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="主题" v-model="formInline.title" />
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="创建时间"
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
                    <el-button type="primary" @click="editRow()" icon="el-icon-plus">创建日程提醒</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData"  v-if="refresh" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column width="50px">
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="主题" min-width="220"></el-table-column>
                    <el-table-column prop="content" label="短信内容" width=""></el-table-column>
                    <el-table-column prop="createTime" label="创建日期" width="160"></el-table-column>
                    <el-table-column prop="endDate" label="截至时间" width="160"></el-table-column>
                    <el-table-column prop="status" label="当前状态" width="100">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140" align="">
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
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
export default {
	data(){
		return {
            date:[],
            dialogViewVisible:false,
			formInline:{
                title:'',
                beginTime:'',
                endTime:'',
			},
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
            refresh:true,
		}
	},
    filters:{
        filterStatus(val){
            const obj = {0:'正常', 1:'暂停'}
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
        editRow(row){
            if(row){
                this.$router.push('/smsSchedule/edit?id='+row.id)
            }else{
                this.$router.push('/smsSchedule/add')
            }
        },
        plusEdit(row){
            this.refresh = false
            row.show = !row.show
            this.$nextTick(()=>{
                this.refresh = true
            })
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.noticeList({...this.formInline,page:this.page}).then( res => { 
                this.tableData = res.info.map(item=>{
                    item.show = false
                    return item
                 })
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
				this.$api.deleteNotice({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
	}
}
</script>