<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.classId" placeholder="所属类别">
                        <el-option label="所属类别" value="-1"></el-option>
                        <el-option :label="item.className" v-for="item in classList" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.status" placeholder="审核状态">
                        <el-option label="审核状态" value="-1"></el-option>
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
                    <el-button type="primary" @click="editRow()" icon="el-icon-upload2">创建模板</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="id" label="模板编号" width="100"></el-table-column>
                    <el-table-column prop="content" label="彩信标题" width="">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="m-color" @click="toView(scope.row)" title="查看内容">{{scope.row.contentTitle}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="className" label="所属类别" width="100"></el-table-column>
                    <el-table-column prop="addTime" label="添加时间" width="160"></el-table-column>
                    <el-table-column prop="status" label="当前状态" width="100">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status ===0">未审核</p>
                            <p class="m-color" v-if="scope.row.status ===6">审核通过</p>
                            <p class="d-color" v-if="scope.row.status ===7">审核未通过</p>
                            <p v-if="scope.row.status === 7" :title="scope.row.noPassDesc" class="d-color">【原因】</p>
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
        <mmsView ref="mmsView"></mmsView>
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
            classList:[],
            date:[],
			formInline:{
                beginTime:'',
                endTime:'',
                classId:'-1',
                status:'-1',
			},
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
			multipleSelection:[],
		}
	},
    filters:{
    },
	mixins:[pagination,storeData],
	components: {mmsView},
	created() {
        this.getClassList()
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
        getClassList(){
            this.$api.mmsClassList({...this.formInline}).then( res => { 
                 this.classList = res.info
			}).catch(error=>{
				console.log(error)
			})
        },
        toView(row){
            this.$refs.mmsView.queryView(row.id)
        },
        editRow(row){
            if(row){
                this.$router.push('/mmstemplete/edit?id='+row.id)
            }else{
                this.$router.push('/mmstemplete/add')
            }
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.mmsTemplateList({...this.formInline,page:this.page}).then( res => { 
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
				this.$api.deleteMmsTemplate({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
	}
}
</script>