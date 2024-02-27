<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="任务名称" v-model.trim="formInline.taskName"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="结束时间"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        range-separator="~"
                        style="width:240px"
                        :clearable="true"
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
                <el-table :data="tableData" v-if="refresh" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%" style="width:100%">
                    <el-table-column width="50px">
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="taskName" label="任务名称" min-width="180"></el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="180"></el-table-column>
                    <el-table-column prop="circleType" label="发送方式" width="120px">
                        <template slot-scope="scope">{{scope.row.circleType | filterCircleType}}</template>
                    </el-table-column>
                    <!--<el-table-column prop="regId" label="区域ID" width="140"></el-table-column>-->
                    <!--<el-table-column prop="stopopenSts" label="开机状态" width="120px">
                        <template slot-scope="scope">{{scope.row.stopopenSts | filterStopopenSts}}</template>
                    </el-table-column>-->
                    <el-table-column prop="contentTotalNum" label="计划发送量" width="140"></el-table-column>
                    <el-table-column prop="hadSendTotalNum" label="累计发送量" width="140"></el-table-column>
                    <el-table-column prop="expireDay" label="任务结束日期" width="160"></el-table-column>
                    <el-table-column prop="submitBeginTime" label="发送时段" width="160">
                        <template slot-scope="scope">
                            {{scope.row.submitBeginTime}}-{{scope.row.submitEndTime}}
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
                taskName:'',
                endTime:'',
                beginTime:'',
			},
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
            refresh:true,
		}
	},
    filters:{
        filterCircleType(val){
            const obj = {
                0:'一次性任务',
                1:'每日',
                2:'按月',
            }
            return obj[val] || ''
        },
        filterStopopenSts(val){
            const obj = {
                0:'停机',
                1:'在用',
                2:'其他',
            }
            return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        // if(!this.hasDataCache) this.date = [moment().subtract(7, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
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
			this.$api.placeMsgList({...this.formInline,page:this.page}).then( res => { 
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