<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.sendType" placeholder="请选择">
                        <el-option label="发送方式" value="-1"></el-option>
                        <el-option label="立即发送" value="0"></el-option>
                        <el-option label="定时发送" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="提交时间"
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
                <el-table :data="tableData"  v-if="refresh" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column width="50px">
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="srcAddr" label="服务代码" width="150"></el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="200"></el-table-column>
                    <el-table-column prop="userNum" label="用户数" width="100"></el-table-column>
                    <el-table-column prop="submitTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="sendType" label="发送方式" width="160">
                        <template slot-scope="scope">
                            <p v-if="scope.row.sendType ===0">立即发送</p>
                            <p v-if="scope.row.sendType ===1">定时发送</p>
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
                sendType:'-1',
                beginTime:'',
                endTime:'',
                status:'-1',
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
			this.$api.smsJobList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info.map(item=>{
                    item.show = false
                    return item
                 })
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
	}
}
</script>