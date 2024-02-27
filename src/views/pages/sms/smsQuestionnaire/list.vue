<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="问卷标题" v-model="formInline.title"></el-input>
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
                    <el-button type="primary" @click="editRow()" icon="el-icon-plus">创建问卷</el-button>
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
                    <el-table-column prop="title" label="问卷主题" width="180"></el-table-column>
                    <el-table-column prop="content" label="问卷内容" min-width="200"></el-table-column>
                    <el-table-column prop="beginDate" label="开始时间" width="160"></el-table-column>
                    <el-table-column prop="endDate" label="截至时间" width="160"></el-table-column>
                    <el-table-column prop="status" label="当前状态" width="100">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status ===0">正常</p>
                            <p v-if="scope.row.status ===6">暂停</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="220" align="">
                        <template slot-scope="scope">
                            <i class="el-icon-view row_icon_link" @click="rowCView(scope.row)" title="查看"></i>
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
			formInline:{
                beginTime:'',
                endTime:'',
                title:'',
			},
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
            refresh:true,
		}
	},
    filters:{
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
        rowCView(row){
            this.$router.push('/smsQuestionnaire/view?id=' + row.id)
        },
        editRow(){
            this.$router.push('/smsQuestionnaire/edit')
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
			this.$api.questionList({...this.formInline,page:this.page}).then( res => { 
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
				this.$api.deleteQuestion({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
	}
}
</script>