<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="短信内容" v-model.trim="formInline.keyWord"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker type="date" v-show="!isCf" value-format="yyyy-MM-dd" :clearable="false" v-model="formInline.sendTime" placeholder="发送时间" style="width:240px"></el-date-picker>
                    <el-date-picker v-show="isCf && specialCorp"
                        title="发送时间"
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
                    <el-date-picker type="date" v-show="isCf && !specialCorp" value-format="yyyy-MM-dd" :clearable="false" v-model="formInline.beginTime" placeholder="发送时间" style="width:240px"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="dnLink" icon="el-icon-search">下载</el-button>
                    <el-button type="success" @click="changeModel" icon="el-icon-view">{{isCf?'短信整条显示':'短信分条显示'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1" v-if="!isCf">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData"  v-if="refresh" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column width="50px">
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="srcAddr" label="服务代码" width="150"></el-table-column>
                    <el-table-column prop="destAddr" label="手机号码" width="160"></el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="200"></el-table-column>
                    <el-table-column prop="receiveTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="totalNum" label="条数" width="100"></el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1" v-else>
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData"  v-if="refresh" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column width="50px">
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="srcAddr" label="服务代码" width="150"></el-table-column>
                    <el-table-column prop="destAddr" label="手机号码" width="160"></el-table-column>
                    <el-table-column prop="srcType" label="归属" width="100">
                        <template slot-scope="scope">
                            {{scope.row.srcType | filtersrcType}}
                            <!--<p v-if="scope.row.srcType ===0">网内</p>
                            <p v-if="scope.row.srcType ===1">异网</p>-->
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="200"></el-table-column>
                    <el-table-column prop="deliverTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="staffId" label="发送状态" width="160">
                    </el-table-column>
                    <el-table-column prop="DELIVRD" label="状态码" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="scope.row.jobId" @click="toDELIVRD(scope.row)">{{scope.row.jobId}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <vsd-ico-dialog icon="16" title="查看错误码" :visible.sync="dialogViewVisible" width="630px">
            <el-form label-width="120px" size="small">
                <el-form-item label="错误码">
                    <div class="border_item" style="min-height:60px">{{formView.errorCode}}</div>
                </el-form-item>
                <el-form-item label="错误描述">
                    <div class="border_item">{{formView.describe}}</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogViewVisible = false" type="primary" size="small">关 闭</el-button>
            </div>
        </vsd-ico-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import pagination from '@/mixins/pagination'
import moment from 'moment'

export default {
	data(){
		return {
            dialogViewVisible:false,
            date:[],
			formInline:{
                keyWord:'',
                beginTime:'',
                endTime:'',
                msisdn:'',
                sendTime:'',
			},
            formView:{
                errorCode:'',
                describe:'',
            },
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
            refresh:true,
            isCf:true,  //true:分条
		}
	},
    filters:{
        filtersrcType(val){
            const obj = {0:'网内', 1:'网外'}
			return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(0, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
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
                    this.formInline.sendTime = val[0]
                    
                }else{
                    this.formInline.beginTime = ''
                    this.formInline.endTime = ''
                    this.formInline.sendTime =''
                }
            },
            immediate:true
        }
    },
  	computed: {
        ...mapState('allstore', {
            specialCorp: state => state.user.userInfo.specialCorp === 1,
        }),
    },
	mounted(){},
	methods:{
        changeModel(){
            this.isCf = !this.isCf
            this.queryList()
        },
        dnLink(){
            const {keyWord,beginTime,endTime,msisdn,sendTime} = this.formInline
            if(this.isCf){
                window.location.href = `${process.env.VUE_APP_APR}/downloadSmsSendList?keyWord=${keyWord}&beginTime=${beginTime}&endTime=${endTime}&msisdn=${msisdn}`;
            }else{
                window.location.href = `${process.env.VUE_APP_APR}/downloadSmsSourceList?keyWord=${keyWord}&sendTime=${sendTime}&msisdn=${msisdn}`;
            }
            
        },
        toDELIVRD(row){
            this.$api.showErrorCode({errorCode:row.jobId}).then(res=>{
                this.formView = res.info
                this.dialogViewVisible = true
            }).catch(err=>{})
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
            const {keyWord,msisdn,beginTime,endTime,sendTime} = this.formInline
            if(this.isCf){
                const sendData = {keyWord,msisdn,beginTime,page:this.page}
                if(this.specialCorp){
                    sendData.endTime = endTime
                }
                this.$api.smsSendList(sendData).then( res => { 
                    this.tableData = res.info.map(item=>{
                        item.show = false
                        return item
                    })
                    this.total = res.total
                }).catch(error=>{
                    console.log(error)
                })
            }else{
                this.$api.smsSourceList({keyWord,msisdn,sendTime,page:this.page}).then( res => { 
                    this.tableData = res.info.map(item=>{
                        item.show = false
                        return item
                    })
                    this.total = res.total
                }).catch(error=>{
                    console.log(error)
                })
            }
			
		},
	}
}
</script>
<style scoped lang="scss">
    .border_item{
        border: 1px solid #d4d5db;
        border-radius: 5px;
        padding: 10px;
        min-height: 220px;
    }
</style>