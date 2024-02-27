<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
		<div class="info_content_box" flex-box="1">
			<div class="ic_title">{{$route.query.id ? '修改子账号申请' : '子账号申请'}}</div>
			<div class="info_content_cell vsd-mb-40">
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>子账号名称</div>
					<div class="dd">
                        <el-input v-model="formData.corpName" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">注：请给子账号设置—个合适的名字，以便识别。</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>短信签名</div>
					<div class="dd">
                        <el-input v-model="formData.signName" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">注：发送短信时，该签名将显示在短信内容前面，签名请控制在10个字以内。</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>子账号端口</div>
					<div class="dd">
                        <el-input v-model="formData.srcAddr" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">注：子端口必须以<i class="d-color">{{CorpInfoData.serviceCode}}</i>开头，且长度不能超过20位。</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>联系人手机号码</div>
					<div class="dd">
                        <el-input v-model="formData.mobile" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">注：联系人手机号码用来接收子账号申请的审核通知。</span>
                    </div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>营业执照</div>
					<div class="dd">
                        <div v-if="formData.businessLicense">
                            <img style="cursor:pointer" @click="showImg('businessLicenseImg')" src="@/assets/imgs/child_02.png" />
                            <el-image :src="formData.businessLicense" ref="businessLicenseImg" style="display:none" :preview-src-list="[$baseUrl + formData.businessLicense]"> </el-image>
                        </div>
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUpload1">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>集信通业务合同</div>
					<div class="dd">
                        <img v-if="formData.agreementDoc" src="@/assets/imgs/child_02.png" style="cursor:pointer" @click="showDoc(formData.agreementDoc)" />
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUpload2">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>子账号使用说明</div>
					<div class="dd">
                        <img v-if="formData.booklet" src="@/assets/imgs/child_02.png" style="cursor:pointer" @click="showDoc(formData.booklet)" />
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUpload3">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">备注</div>
					<div class="dd">
						<el-input v-model.trim="formData.describes" :rows="4" placeholder="请输入..." resize="none" type="textarea" autocomplete="off" maxlength="300" style="width:100%"></el-input>
                    </div>
				</div>
			</div>
		</div>
		<div class="edit-bot-op" flex-box="0">
            <el-button type="primary" size="small" @click="submit">保存</el-button>
            <el-button type="primary" size="small" @click="cancel" plain>取消</el-button>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
export default {
	data(){
		return {
            CorpInfoData:{}, 
            formData:{
                id:'',
                corpName:'',
                signName:'',
                srcAddr:'',
                mobile:'',
                describes:'',
                businessLicense:'',
                agreementDoc:'',
                booklet:'',
            }
		}
	},
    filters:{
    },
	mixins:[storeData],
	components: {},
	created() {
        this.queryView()
        this. queryCorpInfoList()
	},
  	watch: {
    },
  	computed: {
       
    },
	mounted(){},
	methods:{
        showImg(dom){
            console.log(this.$refs[dom],'this.$refs[dom]')
            this.$refs[dom].showViewer = true
        },
        showDoc(url){
            // window.location.href = this.$baseUrl + url
            this.$open(this.$baseUrl + url)
        },
		beforeAvatarUpload1(file){
            const types = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
            const isJPG = (types.indexOf(file.type)>-1)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是 jpg/png/gif/bmp 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            formData.append('uploadType', 1);
            this.$api.uploadChildCorpFile(formData).then( res => {
                this.$message.success('上传成功')
                this.formData.businessLicense = res.filePath.replace(/\\/g,'//')
            }).catch(error=>{})
            return false;
		},
        beforeAvatarUpload2(file){
            console.log(file.name,'file.name')
            const types = file.name.substring(file.name.lastIndexOf('.') + 1)
            const isFile = types === 'doc' || types === 'docx' || types === 'pdf'
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isFile) {
                this.$message.error('上传文件只能是 doc/docx/pdf 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            formData.append('uploadType', 2);
            this.$api.uploadChildCorpFile(formData).then( res => {
                this.$message.success('上传成功')
                this.formData.agreementDoc = res.filePath.replace(/\\/g,'//')
            }).catch(error=>{})
            return false;
		},
        beforeAvatarUpload3(file){
            const types = file.name.substring(file.name.lastIndexOf('.') + 1)
            const isFile = types === 'doc' || types === 'docx' || types === 'pdf'
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isFile) {
                this.$message.error('上传文件只能是 doc/docx/pdf 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            formData.append('uploadType', 3);
            this.$api.uploadChildCorpFile(formData).then( res => {
                this.$message.success('上传成功')
                this.formData.booklet = res.filePath.replace(/\\/g,'//')
            }).catch(error=>{})
            return false;
		},
        cancel(){
            this.closeAndGoback()
        },
        queryCorpInfoList(){
			this.$api.getCorpInfo().then( res => { 
				this.CorpInfoData = res.corpInfo
			}).catch(error=>{
				console.log(error)
			})
		},

		queryView(){
            if(this.hasDataCache) return
            const id = this.$route.query.id
            if(id){
                this.$api.getCorpRegist({id}).then( res => { 
                    for (let key in this.formData) {
						this.formData[key] = res.info[key]
					}
                }).catch(error=>{
                    console.log(error)
                })
            }
		},
        submit(){
            if(this.formData.corpName === ''){
                return this.$message.warning('请输入子账号名称')
            }
            if(this.formData.signName === ''){
                return this.$message.warning('请输入短信签名')
            }
            if(this.formData.srcAddr === ''){
                return this.$message.warning('请输入子账号端口')
            }
            if(this.formData.mobile === ''){
                return this.$message.warning('请输入联系人手机号码')
            }
            if(this.formData.businessLicense === ''){
                return this.$message.warning('请上传营业执照')
            }
            if(this.formData.agreementDoc === ''){
                return this.$message.warning('请上传集信通业务合同')
            }
            if(this.formData.booklet === ''){
                return this.$message.warning('请上传子账号使用说明')
            }
            const url = this.formData.id ? 'modifyCorpRegist' : 'addCorpRegist'
            this.$api[url](this.formData).then( res => { 
                this.$message.success('保存成功')
                this.closeAndGoback()
            }).catch(error=>{
                console.log(error)
            })
        },
	}
}
</script>
<style scoped lang="scss">
    
</style>