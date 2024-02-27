<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.status" placeholder="请选择">
                        <el-option label="当前状态" value="-1"></el-option>
                        <el-option label="未审核" value="0"></el-option>
                        <el-option label="审核通过" value="6"></el-option>
                        <el-option label="审核未通过" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="添加时间"
                        v-model="date"
                        type="daterange"
                        :clearable="true"
                        unlink-panels
                        range-separator="~"
                        style="width:240px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="editRow()" icon="el-icon-upload2">创建模板</el-button>
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
                    <el-table-column prop="id" label="模板编号" width="100"></el-table-column>
                    <el-table-column prop="content" label="模板内容" min-width="200"></el-table-column>
                    <el-table-column prop="paramNum" label="参数个数" width="100"></el-table-column>
                    <el-table-column prop="addTime" label="添加时间" width="160"></el-table-column>
                    <el-table-column prop="status" label="当前状态" width="100">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status ===0">未审核</p>
                            <p class="m-color" v-if="scope.row.status ===6">审核通过</p>
                            <p class="d-color" v-if="scope.row.status ===7">审核未通过</p>
                            <p v-if="scope.row.status === 7" :title="scope.row.noPassDesc" class="d-color">【原因：{{scope.row.noPassDesc}}】</p>
                        </template>
                    </el-table-column>
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
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'

import pagination from '@/mixins/pagination'
import moment from 'moment'
export default {
	data(){
		return {
            date:[],
			formInline:{
                templateId:'',
                beginTime:'',
                endTime:'',
                status:'-1',
			},
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
			multipleSelection:[],
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
        editRow(row){
            if(row){
                this.$router.push('/smstemplete/edit?id='+row.id)
            }else{
                this.$router.push('/smstemplete/add')
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
			this.$api.smsTemplateList({...this.formInline,page:this.page}).then( res => { 
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
				this.$api.deleteSmsTemplate({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
	}
}
</script>