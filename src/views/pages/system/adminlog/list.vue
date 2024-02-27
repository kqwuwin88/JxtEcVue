<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="账号" v-model.trim="formInline.userId"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.logType" placeholder="请选择" style="width:100%">
                        <el-option label="日志类别" value="-1"></el-option>
                        <el-option label="用户登录" value="1"></el-option>
                        <el-option label="短信管理" value="2"></el-option>
                        <el-option label="彩信管理" value="3"></el-option>
                        <el-option label="联系人管理" value="4"></el-option>
                        <el-option label="企业管理" value="6"></el-option>
                        <el-option label="系统管理" value="7"></el-option>
                        <el-option label="报表管理" value="8"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="发送时间"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        range-separator="~"
                        style="width:240px"
                        :clearable="false"
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
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%" style="width:100%;">
                    <el-table-column prop="staffId" label="登录账号" width="160"></el-table-column>
                    <el-table-column prop="corpName" label="日志类型" width="120px">
                        <template slot-scope="scope">{{scope.row.logType | filterStatus}}</template>
                    </el-table-column>
                    <el-table-column prop="operDesc" label="操作内容" width=""></el-table-column>
                    <el-table-column prop="logTime" label="操作时间" width="160"></el-table-column>
                    <el-table-column prop="userIp" label="用户访问IP" width="140"></el-table-column>
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
                userId:'',
                logType:'-1',
                endTime:'',
                beginTime:'',
			},
			tableData:[],
		}
	},
    filters:{
        filterStatus(val){
            const obj = {
                1:'用户登录',
                2:'短信管理',
                3:'彩信管理',
                4:'联系人管理',
                6:'企业管理',
                7:'系统管理',
                8:'报表管理',
            }
            return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
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
  	computed: {},
	mounted(){},
	methods:{
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.logList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
	}
}
</script>