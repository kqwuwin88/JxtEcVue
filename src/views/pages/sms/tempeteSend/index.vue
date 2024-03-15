<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-content-box" flex-box="1">
            <el-form label-position="top" label-width="100%" class="edit-form-custom">
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="短信内容">
                            <div class="sms_content">
                                {{formEdit.content}}
                            </div>
                            <div><i class="d-color">注：请从右边的模板中选择可用的短信模板</i></div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="短信模板">
                            <div class="sms_temp_list">
                                <div class="sms_temp_col" @click="rowClick(item)" v-for="item in tableData" :key="item.id" :title="item.content">{{item.content}}</div>
                            </div>
                            <div class="pagination-wrap" flex="main:right">
                                <vsd-table-pagination :currentPage="page" :pageSize="pageSize" :total="total" @handleChange="handleCurrentChange" layout="total, prev, pager, next"></vsd-table-pagination>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="vsd-pl-40 vsd-pr-40">
                <div flex="main:justify" class="vsd-mb-15">
                    <el-button type="primary" size="small" @click="exportMail">导入文件</el-button>
                    <div>
                        <el-button type="text" size="small" @click="dnLink">下载模板</el-button>
                        <el-button type="text" size="small" @click="dialogTipVisible = true">导入参数案例</el-button>
                    </div>
                </div>
                <el-table :data="tempData" class="table-border" style="width:100%">
                    <el-table-column prop="msisdn" label="手机号码" width="160"></el-table-column>
                    <el-table-column prop="content" label="短信内容" width=""></el-table-column>
                </el-table>
            </div>
        </div>
        <div class="edit-bot-op" flex-box="0">
            <el-button type="primary" size="small" @click="sendSubmit">发送</el-button>
            <el-button type="primary" size="small" @click="cancel" plain>取消</el-button>
        </div>
        <vsd-ico-dialog title="上传" :visible.sync="dialogFormImport" icon="13" width="440px">
            <el-form label-position="top">
                <el-form-item label="文件" require>
			      	<el-upload class="pic-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
                        <a href="javascript:;" class="pic-uploader-icon"><i class="el-icon-upload2"></i>上传文件</a>
					</el-upload>
			    </el-form-item>
            </el-form>
        </vsd-ico-dialog>
        <vsd-ico-dialog icon="15" title="导入参数案例" :visible.sync="dialogTipVisible" width="630px">
            <div flex class="vsd-mb-20">
                <span flex-box="0">①、</span>
                <span flex-box="1">导入的文件格式必须为Excel，且【A】列必须为【接收短信的手机号码】，其他列的内容与短信内容中的【变量】依次对应；</span>
            </div>
            <div flex class="vsd-mb-20">
                <span flex-box="0">②、</span>
                <span flex-box="1">模板示例：【变量】，您好！您本次需要交纳的费用为【变量】元，当前账户余额为【变量】元，请您及时充值。该模板所需导入的Excel文件的格式如下图例所示：</span>
            </div>
            <div flex class="vsd-mb-20">
                <span flex-box="0" style="visibility:hidden">③、</span>
                <span flex-box="1">
                    <img src="@/assets/imgs/temp_send_01.png">
                </span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTipVisible = false" type="primary" size="small">关 闭</el-button>
            </div>
        </vsd-ico-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
export default {
	data(){
		return {
            pageSize:5,
            dialogTipVisible:false,
            dialogFormImport:false,
            tableData:[],
            formEdit:{
                content:'',
                templateId:'',
            },
            tempData:[],
            
		}
	},
    filters:{
       
    },
	mixins:[storeData,pagination],
	components: {},
	created() {
	},
  	watch: {
       
    },
  	computed: {
       
    },
	mounted(){
        this.queryList()
    },
	methods:{
        exportMail(){
            if(this.formEdit.content === ''){
                return this.$message.warning('请选择短信模板')
            }
            this.dialogFormImport = true
        },
        dnLink(){
			window.location.href = process.env.VUE_APP_APR + '/downloadFile?fileType=2';
        },
        beforeAvatarUpload(file){
            const excelTypes = ['xls','xlsx']
            var index= file.name.lastIndexOf(".");
            var ext = file.name.substr(index+1);
            const isExcel = excelTypes.indexOf(ext) > -1
            const finleEnd = file.name.substring(file.name.lastIndexOf('.') + 1)
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isExcel) {
                this.$message.error('只能是excel格式!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            formData.append('templateId', this.formEdit.templateId);
            formData.append('fileType', finleEnd);
            this.$api.uploadFormatFile(formData).then( res => {
                this.$message.success('文件导入成功，数量'+res.smsNum)
                this.tempData = res.smsList
                this.dialogFormImport = false
            }).catch(error=>{})
            return false;
		},
        rowClick(item){
            this.formEdit.content = item.content
            this.formEdit.templateId = item.id
        },
        queryList(){
			this.$api.smsTemplateList({status:6,page:this.page,pageSize:this.pageSize}).then( res => { 
                this.tableData = res.info
                this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
        cancel(){
            this.closeAndGoback()
        },
        sendSubmit(){
             this.$confirm('确认发送模板短信？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
                if(this.tempData.length === 0)return this.$message.warning('请导入文件')
                this.$api.sendSmsFormat().then(res=>{
                    this.$message.success(res.msg)
                    this.closeAndGoback()
                }).catch(error=>{
                    console.log(error)
                })
			}).catch(()=>{})
        },
        
	}
}
</script>
<style scoped lang="scss">
    
</style>