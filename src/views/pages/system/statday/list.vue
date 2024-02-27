<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline" label-width="100px">
                <el-form-item label="">
                    <el-select v-model="formInline.statistType" placeholder="查询类型" @change="changTime">
                        <el-option label="按日" value="1"></el-option>
                        <el-option label="按月" value="2"></el-option>
                        <el-option label="按年" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="formInline.statistType == 1">
                    <el-date-picker
                        title="统计时间"
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
                <el-form-item label="" v-if="formInline.statistType == 2">
                    <el-date-picker
                        title="发送时间"
                        v-model="date"
                        type="monthrange"
                        unlink-panels
                        :clearable="false"
                        range-separator="~"
                        style="width:240px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" v-if="formInline.statistType == 3">
                    <div flex>
                        <el-date-picker
                            title="统计时间"
                            v-model="formInline.beginTime"
                            type="year"
                            :clearable="false"
                            style="width:140px"
                            placeholder="开始时间"
                            value-format="yyyy">
                        </el-date-picker>
                        <span class="vsd-ml-5 vsd-mr-5">~</span>
                        <el-date-picker
                            title="统计时间"
                            v-model="formInline.endTime"
                            type="year"
                            :clearable="false"
                            style="width:140px"
                            placeholder="结束时间"
                            value-format="yyyy">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="exoprtList" icon="el-icon-download">下载</el-button>
                    <el-radio-group v-model="chartType" class="vsd-ml-20">
                        <el-radio-button label="2">表格展示</el-radio-button>
                        <el-radio-button label="1">图表视图</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div flex-box="0" style="color:#666666;" class="vsd-mb-10">注：由于手机用户停、关机等原因导致暂时未能送达的短信，系统会在72小时内持续发送，因此当日的短信发送量仅供参考，以3天后的数据为准。</div>
            <div flex-box="1" v-if="chartType === '1'">
                <chartBar :barData="barData" />
            </div>
            <div class="table-wrap" flex-box="1" v-if="chartType === '2'">
                <el-table :data="tableData" v-if="refresh" class="table-border" ref="multipleTable" height="100%" :summary-method="getSummaries" show-summary>
                    <el-table-column prop="statistDate" label="日期" width=""></el-table-column>
                    <el-table-column prop="smsNum" label="短信总数" width=""></el-table-column>
                    <el-table-column prop="ydSmsNum" label="网内短信数" width=""></el-table-column>
                    <el-table-column prop="smsSucc" label="网内成功数" width=""></el-table-column>
                    <el-table-column prop="smsFail" label="网内失败数" width=""></el-table-column>
                    <el-table-column prop="succRate" label="网内成功率" width=""></el-table-column>
                    <el-table-column prop="ywSmsNum" label="网外短信数" width=""></el-table-column>
                    <el-table-column prop="ywSmsSucc" label="网外成功数" width=""></el-table-column>
                    <el-table-column prop="ywSmsFail" label="网外失败数" width=""></el-table-column>
                    <el-table-column prop="ywSuccRate" label="网外成功率" width=""></el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0" v-if="chartType === '2'">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
import moment from 'moment'
import chartBar from '@/components/chart-bar'
export default {
	data(){
		return {
            chartType:'2',
            date:[],
			formInline:{
                statistType:'1',
                beginTime:'',
                endTime:'',
			},
            totalStatist:{},
			tableData:[],
            refresh:false,
            barData:{x:[],y1:[],y2:[]},
		}
	},
	mixins:[pagination,storeData],
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(7, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
        this.$nextTick(()=>{
            this.queryList();
        })
	},
  	watch: {
        date:{
            handler(val){
                if(this.formInline.statistType != 3){
                    if(val && val.length){
                        this.formInline.beginTime = val[0]
                        this.formInline.endTime = val[1]
                    }else{
                        this.formInline.beginTime = ''
                        this.formInline.endTime = ''
                    }
                }
            },
            immediate:true
        },
        chartType(val){
            this.searchList()
        }
    },
  	computed: {},
	components: {chartBar},
	mounted(){},
	methods:{
        changTime(val){
            this.date = []
            this.formInline.beginTime = ''
            this.formInline.endTime = ''
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总计';
                    return;
                }
                sums[index] = this.totalStatist[column.property]
            })
            return sums;
        },
        exoprtList(){
            window.location.href=process.env.VUE_APP_APR + '/downloadSmsStatist?downType=1';
        },
        searchList(){
            
            if(this.chartType === '1'){
                this.queryChartData()
            }
            if(this.chartType === '2'){
                this.page = 1
                this.queryList()
            }
        },
        queryChartData(){
            this.$api.statistOfDate({...this.formInline}).then( res => {
                console.log(res,'barData')
                this.barData = {
                    x: res.info.map(item=>item.statistDate),
                    y1: res.info.map(item=>item.smsNum),
                    y2: res.info.map(item=>item.smsSucc + item.ywSmsSucc),
                }
                console.log(this.barData,'this.barData')
			}).catch(error=>{
				console.log(error)
			}) 
        },
		queryList(){
            if(this.formInline.beginTime === ''){
                this.$message.warning('请选择时间')
                return 
            }
            this.tableData = []
            this.refresh = false
			this.$api.statistOfDate({...this.formInline,page:this.page}).then( res => { 
                this.tableData = res.info
                this.total = res.total
                this.totalStatist = res.totalStatist
                this.refresh = true
			}).catch(error=>{
                this.refresh = true
				console.log(error)
			})
		},

	}
}
</script>