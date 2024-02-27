<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.timeType" placeholder="查询类型" @change="changTime">
                        <el-option label="按日" value="1"></el-option>
                        <el-option label="按月" value="2"></el-option>
                        <el-option label="按年" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="formInline.timeType == 1">
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
                <el-form-item label="" v-if="formInline.timeType == 2">
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
                <el-form-item label="" v-if="formInline.timeType == 3">
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
                        <el-radio-button label="1">图表视图</el-radio-button>
                        <el-radio-button label="2">表格展示</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div flex-box="0" style="color:#666666;">注：由于手机用户停、关机等原因导致暂时未能送达的短信，系统会在72小时内持续发送，因此当日的短信发送量仅供参考，以3天后的数据为准。</div>
            <div flex-box="1" class="vsd-mt-10" v-if="chartType === '1'">
                <chartBar :barData="barData" />
            </div>
            <div flex-box="1" class="vsd-mt-10" flex="dir:top" style="overflow:hidden;" v-if="chartType === '2'">
                <div class="table-wrap" flex-box="1">
                    <el-table :data="tableData" v-if="refresh" class="table-border" ref="multipleTable" height="100%" :summary-method="getSummaries" show-summary>
                        <el-table-column prop="statistDate" label="日期" width=""></el-table-column>
                        <el-table-column prop="totalNum" label="接受短信数" width=""></el-table-column>
                        <el-table-column prop="sendImmediate" label="系统直接发送数" width="140"></el-table-column>
                        <el-table-column prop="intercept" label="拦截数" width=""></el-table-column>
                        <el-table-column prop="rejectNum" label="系统拒发数" width=""></el-table-column>
                        <el-table-column prop="checkPass" label="审核通过数" width=""></el-table-column>
                        <el-table-column prop="checkNoPass" label="审核未通过数" width="120"></el-table-column>
                        <el-table-column prop="checkExpireSend" label="审核超时（发送）" width="140"></el-table-column>
                        <el-table-column prop="checkExpireNotSend" label="审核超时（未发送）" width="160"></el-table-column>
                    </el-table>
                </div>
                <div class="pagination-wrap" flex="main:right" flex-box="0">
                    <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
                </div>
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
            chartType:'1',
            date:[],
			formInline:{
                timeType:'1',
                endTime:'',
                beginTime:'',
			},
			tableData:[],
            barData:[],
            totalStatist:{},
            refresh:true,
		}
	},
    components:{
        chartBar
    },
	mixins:[pagination,storeData],
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(30, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
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
  	computed: {},
	mounted(){},
	methods:{
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
        changTime(val){
            this.date = []
        },
        exoprtList(){
            if(this.barData.length === 0) return this.$message.warning('尚不存在可以导出的数据')
            const {beginTime, endTime} = this.formInline
            const str = `?statistType=1`
            window.location.href=process.env.VUE_APP_APR + '/exportStatistCorpOrIndustry' + str;
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.refresh = false
			this.$api.smsStatistCorp({...this.formInline}).then( res => { 
                 this.barData = res.info
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
