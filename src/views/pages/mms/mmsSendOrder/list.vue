<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="发送f时间"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        :clearable="false"
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
                    <el-table-column prop="sendAddress" label="发送地址" width="140"></el-table-column>
                    <el-table-column prop="msisdn" label="手机号码" width="100"></el-table-column>
                    <el-table-column prop="sendTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="status" label="当前状态" width="120">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status ===1000">发送成功</p>
                            <p v-else>发送失败</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contentId" label="彩信内容" width="120">
                        <template slot-scope="scope">
                            <i class="el-icon-view row_icon_link" @click="toView(scope.row)" title="查看内容"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="下载" width="220" align="">
                        <template slot-scope="scope">
                            <i class="el-icon-download row_icon_link" @click="dnRow(scope.row)" title="下载内容"></i>
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
                msisdn:'',
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
            //this.queryList();
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
            this.$refs.mmsView.queryView(row.contentId)
        },
        dnRow(row){
			window.location.href = process.env.VUE_APP_APR + '/downloadMms?contentId=' + row.contentId;
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.mmsSendList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
	}
}
</script>