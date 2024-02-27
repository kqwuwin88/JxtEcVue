<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
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
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="dnLink" icon="el-icon-search">下载</el-button>
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
                    <el-table-column prop="staffId" label="手机号码" width="140"></el-table-column>
                    <el-table-column prop="corpId" label="姓名" width="100"></el-table-column>
                    <el-table-column prop="deliverTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="destAddr" label="接入号" width="120"></el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="200"></el-table-column>
                    <el-table-column label="操作" width="140" align="">
                        <template slot-scope="scope">
                            <img class="point" @click="toRecieve(scope.row)" src="@/assets/imgs/recieve_01.png" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <vsd-ico-dialog icon="19" title="短信互动" :visible.sync="dialogHdVisible" class="no_pad_dialog" width="630px">
            <div class="rec_im_box" ref="scorllDiv">
                <div v-for="(item,index) in recieveList" :key="item.deliverTime" :class="index !== 0 ? 'vsd-mt-20' : ''">
                    <div class="text_time"><span>{{item.deliverTime}}</span></div>
                        <div class="text_o" v-if="item.isShow === 0">
                            <img src="@/assets/imgs/rec_01.png" />
                            <p><span>{{item.content}}</span></p>
                        </div>
                        <div class="text_m" v-if="item.isShow === 1">
                            <img src="@/assets/imgs/rec_02.png" />
                            <p><span>{{item.content}}</span></p>
                        </div>
                </div>
            </div>
            <div class="rec_im_area" flex="cross:center">
                <el-input v-model="recieveText" placeholder="请输入文本..." type="textarea" :rows="1" flex-box="1" size="small" resize="none"></el-input>
                <el-button type="primary" size="small" flex-box="0" @click="recieveMsg" class="vsd-ml-10">发送</el-button>
            </div>
        </vsd-ico-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
import moment from 'moment'

export default {
	data(){
		return {
            recieveList:[],
            pageInfo:{},
            curMsisdn:'',
            recieveText:'',
            date:[],
			formInline:{
                msisdn:'',
                beginTime:'',
                endTime:'',
			},
            dialogHdVisible:false,
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
        toBotttomFn(){
            const scrollEl = this.$refs.scorllDiv
            scrollEl.scrollTo({ top: scrollEl.scrollHeight });
        },
        toRecieve(row){
            this.dialogHdVisible =  true
            this.curMsisdn = row.srcAddr
            this.getRecieveView()
        },
        getRecieveView(){
            this.$api.getActiveMsg({msisdn:this.curMsisdn}).then(res=>{
                this.recieveList = res.info
                this.$nextTick(()=>{
                    this.toBotttomFn()
                })
            }).catch(err=>{})
        },
        recieveMsg(){
            if(this.recieveText.trim() === '') return
            this.$api.sendActiveMsg({msisdn:this.curMsisdn,content:this.recieveText}).then(res=>{
                this.$message.success('发送成功')
                this.recieveText = ''
                this.getRecieveView()
            }).catch(err=>{})
        },
        dnLink(){
            window.location.href = `${process.env.VUE_APP_APR}/downloadSmsReceive`;
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
			this.$api.smsReceiveList({...this.formInline,page:this.page}).then( res => { 
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
<style scoped lang="scss">
    ::v-deep.no_pad_dialog{
        .el-dialog__body{
            padding: 0 !important;
            .rec_im_box{
                background: #f1f1f1;
                padding: 30px;
                height: 328px;
                box-sizing: border-box;
                overflow: auto;
                .text_time{
                    text-align: center;
                    line-height: 18px;
                    font-size: 12px;
                    span{
                        background: #d5d5d5;
                        padding: 0 5px;
                        display: inline-block;
                    }
                }
                .text_o{
                    display: flex;
                    margin-top: 20px;
                    margin-right: 64px;
                    img{
                        flex-grow: 0;
                        flex-shrink: 0;
                        margin-right: 20px;
                        height: 44px;
                        width: 44px;
                    }
                    p{
                        flex: 1 1 auto;
                        position: relative;
                        line-height: 24px;
                        &:before{
                            position: absolute;
                            content: "";
                            bottom: 0;
                            left: -6px;
                            width: 15px;
                            height: 10px;
                            background: #fff;
                            transform: skewX(-60deg);
                        }
                        span{
                            background: #fff;
                            border-radius: 3px;
                            padding: 10px 15px;
                            display: inline-block;
                        }
                    }
                }
                .text_m{
                    display: flex;
                    flex-direction: row-reverse;
                    margin-top: 20px;
                    margin-left: 64px;
                    img{
                        flex-grow: 0;
                        flex-shrink: 0;
                        margin-left: 20px;
                    }
                    p{
                        flex: 1 1 auto;
                        position: relative;
                        line-height: 24px;
                        text-align: right;
                        &:before{
                            position: absolute;
                            content: "";
                            bottom: 0;
                            right: -6px;
                            width: 15px;
                            height: 10px;
                            background: #fff;
                            transform: skewX(60deg);
                        }
                        span{
                            background: #fff;
                            border-radius: 3px;
                            padding: 10px 15px;
                            display: inline-block;
                            text-align: left;
                            word-break: break-all;
                        }
                    }
                }
            }
            .rec_im_area{
                height: 72px;
                background: #fff;
                padding: 0 40px;
                .el-textarea__inner{
                    border: none;
                    padding: 5px 0;
                }
            }
        }
    }
</style>