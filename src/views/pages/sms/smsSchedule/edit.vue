<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-content-box" flex-box="1">
            <el-form ref="formEdit" :model="formEdit" label-position="top" label-width="100%" class="edit-form-custom">
                <el-form-item label="主题">
                    <el-input v-model.trim="formEdit.title" placeholder="请输入主题"></el-input>
                </el-form-item>
                <el-form-item label="短信内容">
                    <el-input v-model="formEdit.content" :rows="10" type="textarea" resize="none" placeholder="请输入短信内容"></el-input>
                    <div style="line-height:1.5;color:#8e8e8e">
                        包括企业签名  <i class="d-color">{{formInfo.signName}}</i> ，当前已输入         <span>{{formInfo.signName.length + formEdit.content.length}}</span>         字，分          <span>{{smsCount}}</span>        条发送，为提高短信收接成功率，发送短信前，先阅读  <a href="javscript:;" class="d-color" @click="dialogTipVisible = true">短信内容说明要求</a>  。<br>
                        <i class="d-color">【注意：输入短信内容时，请勿在整条短信结尾处敲回车键，否则导致短信条数拆分存在误差。】</i>
                    </div>
                </el-form-item>
                <el-form-item label="接收号码">
                    <el-button type="primary" size="small" class="vsd-mb-20" @click="showMailDialog">通讯录</el-button>
                    <el-button type="primary" size="small" class="vsd-mb-20" @click="exportMail" plain>文件导入</el-button>
                    <div class="add_temp_area_wrap vsd-pt-10">
                        <div class="cks-text">{{cksRowGroup}}</div>
                        <div class="cks-text">{{cksRowText}}</div>
                        <el-input v-model="formEdit.msisdn" type="textarea" ref="textareaRef" placeholder="请输入手机号码，多个号码请换行" resize="none" :rows="5"></el-input>
                        <div class="tip">  注：多个手机号码之间请用 ,隔开，如139XXXXXXXX,138XXXXXXXX</div>
                    </div>
                </el-form-item>
                <el-form-item label="发送设置">
                    <el-radio-group v-model="formEdit.cycleType" @change="formEdit.sendDay = []">
                        <el-radio :label="1">按天</el-radio>
                        <el-radio :label="2">按周</el-radio>
                        <el-radio :label="3">按月</el-radio>
                    </el-radio-group>
                    <div class="info_content_cell wid140">
                        <div class="info_content_tr" v-if="formEdit.cycleType === 2">
                            <div class="tt">发送日期</div>
                            <div class="dd">
                                <el-checkbox-group v-model="formEdit.sendDay">
                                    <el-checkbox v-for="(date,index) in weekDates" :label="index+1 + ''" :key="date">{{date}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div class="info_content_tr" v-if="formEdit.cycleType === 3">
                            <div class="tt">发送日期</div>
                            <div class="dd">
                                <el-checkbox-group v-model="formEdit.sendDay">
                                    <el-checkbox v-for="date in monthDates" :label="date + ''" :key="date">{{date}}日</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div class="info_content_tr">
                            <div class="tt">发送时间</div>
                            <div class="dd">
                                <el-time-picker placeholder="请选择" v-model="formEdit.sendTime" format='HH:mm:ss' :picker-options="{format:'HH:mm:ss'}" value-format="HH:mm:ss" style="width:50%"></el-time-picker>
                            </div>
                            <div class="tt">截至日期</div>
                            <div class="dd">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="formEdit.endDate" placeholder="请选择" style="width:50%"></el-date-picker>
                                <i class="d-color vsd-ml-20">为空表示永久有效</i>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="edit-bot-op" flex-box="0">
            <el-button type="primary" size="small" @click="sendSubmit">提交</el-button>
            <el-button type="primary" size="small" @click="cancel" plain>取消</el-button>
        </div>
        <mailSelect ref="mailSelect" @mailChange="mailChange" />
        <vsd-ico-dialog title="上传" :visible.sync="dialogFormImport" icon="13" width="440px">
            <el-form label-position="top">
                <el-form-item label="文件" require>
			      	<el-upload class="pic-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
                        <a href="javascript:;" class="pic-uploader-icon"><i class="el-icon-upload2"></i>上传文件</a>
					</el-upload>
			    </el-form-item>
            </el-form>
            <div>
                <p class="i-color">支持Excel及txt文本，每行一个手机号码</p>
            </div>
        </vsd-ico-dialog>
        <vsd-ico-dialog icon="14" title="短信内容说明要求" :visible.sync="dialogTipVisible" width="630px">
                <div flex class="vsd-mb-20">
                    <span flex-box="0">①、</span>
                    <span flex-box="1">为避免短信被拦截，短信内容中不能出现带有【】文字内容（如：尊敬的【张三】，您好! ）或双签名（如:【技术部】【集信通】)。</span>
                </div>
                <div flex class="vsd-mb-20">
                    <span flex-box="0">②、</span>
                    <span flex-box="1">包含企业签名【集信通】在内,普通短信按70个字为1条计费，长短信按66个字为1条拆分计费。</span>
                </div>
                <div flex class="vsd-mb-20">
                    <span flex-box="0">③、</span>
                    <span flex-box="1">该平台严禁发送违法、诈骗、反党、反政府、黄赌毒类短信。</span>
                </div>
                <div flex class="vsd-mb-20">
                    <span flex-box="0">④、</span>
                    <span flex-box="1">严禁发送商业营销类短信，凡营销类短信提交后,—律作审核不通过处理。</span>
                </div>
                <div flex class="vsd-mb-20">
                    <span flex-box="0">⑤、</span>
                    <span flex-box="1">凡金融结息催缴或会员通知类短信，请务必在短信内容结尾加上“拒收回TD退订"提醒，否则一律审核不通过。</span>
                </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTipVisible = false" type="primary" size="small">关 闭</el-button>
            </div>
        </vsd-ico-dialog>

    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import mailSelect from '@/components/mail-select/index.vue'
export default {
	data(){
		return {
            dialogTipVisible:false,
            formInfo:{
                signName:'',
                signLen:'',
            },
            formEdit:{
                title:'',
                content:'',
                msisdn:'',
                cycleType:1,
                sendDay:[],
                sendTime:'',
                endDate:''
            },
            monthDates: 31,
            weekDates: ['周一','周二','周三','周四','周五','周六','周日'],
            dialogFormImport:false,
            cksCustom:[],
            cksRows:[],
		}
	},
    filters:{
       
    },
	mixins:[storeData],
	components: {mailSelect},
	created() {
	},
  	watch: {
       
    },
  	computed: {
       cksRowText(){
            return this.cksCustom.map(item=>item.msisdn).join(',')
            
        },
        cksRowGroup(){
            return this.cksRows.map(item=>`【${item.group_name}】`).join(',')
        },
        smsCount(){
            const allLen = this.formInfo.signName.length + this.formEdit.content.length
            return allLen<71 ? 1 : Math.ceil(allLen/66)
        }
    },
	mounted(){
        this.getPageInfo()
        this.queryView()
    },
	methods:{
        queryView(){
            if(this.hasDataCache) return
            const id = this.$route.query.id
            if(id){
                this.$api.getNotice({id}).then( res => { 
                    this.formEdit.title = res.info.title
                    this.formEdit.content = res.info.content
                    this.formEdit.msisdn = res.info.msisdns
                    this.formEdit.cycleType = res.info.cycleType
                    this.formEdit.sendDay = res.info.sendDay?.split(',') ?? []
                    this.formEdit.sendTime = res.info.sendTime
                    this.formEdit.endDate = res.info.endDate
                    this.formEdit.id = res.info.id
                }).catch(error=>{
                    console.log(error)
                })
            }
        },
        getPageInfo(){
            this.$api.toAddNotice().then(res=>{
                this.formInfo.signName = res.signName
                this.formInfo.signLen = res.signLen
            }).catch(error=>{}) 
        },
        mailChange(data){
            this.cksCustom = data.cksCustom
            this.cksRows = data.cksRows
        },
        cancel(){
            this.closeAndGoback()
        },
        sendSubmit(){
            console.log(this.formEdit,'this.formEdit')
            const {content,msisdn,title,sendDay,sendTime,endDate,cycleType} = this.formEdit
            if(title=='')return this.$message.warning('标题不能为空')
            if(content=='')return this.$message.warning('短信内容不能为空')
            if(this.cksRowGroup=='' && this.cksRows.length === 0 && this.cksRowText == '' && msisdn === '')return this.$message.warning('请输入手机号或从通讯录选择群组号码')
            if(cycleType === 2 || cycleType === 3){
                if(sendDay.length === 0)return this.$message.warning('按周或按月必须填写发送日期')
            }
            if(sendTime=='')return this.$message.warning('发送时间不能为空')
             this.$confirm('确认提交日程提醒？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
                const msisdns = msisdn.replace('\n',',')
                const groupId = this.cksRows.map(item=>item.id).join(',')
                const sendData = {
                    content,
                    title,
                    msisdns:[this.cksRowText,msisdns].join(','),
                    groupId,
                    cycleType,
                    sendDay:sendDay.sort((a,b)=>Number(a)-Number(b)).join(','),
                    sendTime,
                    endDate,
                }
                let url = 'addNotice'
                const id = this.$route.query.id
                if(id){
                  sendData.id =  id 
                  url = 'modifyNotice'
                }
                this.$api[url](sendData).then(res=>{
                    this.$message.success(res.msg)
                    this.closeAndGoback()
                }).catch(error=>{
                    console.log(error)
                })
			}).catch(()=>{})
        },
        showMailDialog(){
            //this.$refs.mailSelect.open({cksCustom:this.cksCustom,cksRows:this.cksRows})
            this.$refs.mailSelect.open({cksCustom:JSON.parse(JSON.stringify(this.cksCustom)),cksRows:JSON.parse(JSON.stringify(this.cksRows))})
        },
        beforeAvatarUpload(file){
            const excelTypes = ['xls','xlsx','txt']
            var index= file.name.lastIndexOf(".");
            var ext = file.name.substr(index+1);
            const isExcel = excelTypes.indexOf(ext) > -1
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isExcel) {
                this.$message.error('只能是excel或者txt格式!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            this.$api.importMsisdn(formData).then( res => {
                this.$message.success(res.msg)
                if(this.formEdit.msisdn === ''){
                    this.formEdit.msisdn = res.msisdn
                }else{
                    this.formEdit.msisdn += ','+res.msisdn
                }
                this.dialogFormImport = false
            }).catch(error=>{})
            return false;
		},
        exportMail(){
            this.dialogFormImport = true
        }
	}
}
</script>
<style scoped lang="scss">
    
</style>