<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
		<div class="info_content_box" flex-box="1">
			<div class="ic_title">企业基本信息</div>
			<div class="info_content_cell vsd-mb-40">
				<div class="info_content_tr">
					<div class="tt">企业名称</div>
					<div class="dd">{{formData.corpName}}</div>
					<div class="tt">企业账号</div>
					<div class="dd">{{formData.id}}</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">企业logo</div>
					<div class="dd">
						<img :src="$baseUrl + formData.logoUrl" v-if="formData.logoUrl" style="height:100px">
						<div flex>
							<el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
								<el-button type="primary" size="small"><img src="@/assets/imgs/info_01.png" class="btn-img">上传logo</el-button>
                            </el-upload>
							<el-button type="primary" class="vsd-ml-10" size="small" @click="resetLogo"><img src="@/assets/imgs/info_02.png" class="btn-img">重置logo</el-button>
							<span class="d-color vsd-ml-10" style="font-size:12px">注意：上传自定义logo图片尺寸要求透明png格式，长518像素，高34像素。</span>
						</div>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">接入号</div>
					<div class="dd">{{formData.serviceCode}}</div>
					<div class="tt">短信付费方式</div>
					<div class="dd">{{formData.feeType | filterFee}}</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">剩余异网彩信流量</div>
					<div class="dd">{{formData.remainMms}}</div>
					<div class="tt">日最大短信流量</div>
					<div class="dd">{{formData.daySmsNum}}</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">月最大短信流量</div>
					<div class="dd">{{formData.monthSmsNum}}</div>
					<div class="tt">日最大彩信流量</div>
					<div class="dd">{{formData.dayMmsNum}}</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">月最大彩信流量</div>
					<div class="dd">{{formData.monthMmsNum}}</div>
				</div>
			</div>
			<div class="ic_title">生日提醒设置</div>
			<div class="info_content_cell">
				<div class="info_content_tr">
					<div class="tt">生日提醒</div>
					<div class="dd">
						<el-radio-group v-model="formData.sendBirthdayNotice">
							<el-radio :label="0">不需要</el-radio>
							<el-radio :label="1">需要</el-radio>
						</el-radio-group>
					</div>
					<div class="tt">提前发送生日提醒天数</div>
					<div class="dd">
						<el-input v-model.trim="formData.noticeBeforDay" autocomplete="off" maxlength="10" size="small" style="width:80px"></el-input>
						<span class="vsd-ml-5">天</span>
						<span class="d-color vsd-ml-10" style="font-size:12px">注：0 表示生日当天发送，1 表示在生日前1天发送，依次类推。</span>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">生日提醒短信</div>
					<div class="dd">
						<el-button type="primary" class="vsd-mb-10" size="small" @click="addNameHandle">添加姓名</el-button>
						<el-input v-model.trim="formData.birthdayNotice" :rows="5" ref="textareaRef" placeholder="请输入..." resize="none" type="textarea" autocomplete="off" maxlength="300" style="width:100%"></el-input>
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
	data(){
		return {
            formData:{}
		}
	},
    filters:{
		filterFee(val){
			const obj = {0:'后付费', 1:'预付费'}
			return obj[val] || ''
		}
    },
	mixins:[storeData],
	components: {},
	created() {
        this.queryView()
	},
  	watch: {
    },
  	computed: {
       ...mapState('allstore', {
            corpInfo: state => state.user.corpInfo,
        }),
    },
	mounted(){},
	methods:{
		...mapActions("allstore/user", ["setCorpInfo"]),
		resetLogo(){
			this.$api.resetLogo().then( res => {
                this.$message.success('重置logo成功')
                this.queryView()
            }).catch(error=>{})
		},
		beforeAvatarUpload(file){
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
            this.$api.modifyLogo(formData).then( res => {
				console.log(this.corpInfo,'this.corpInfo')
                this.$message.success('修改logo成功')				
				this.queryView()
            }).catch(error=>{})
            return false;
		},
		addNameHandle(){
			console.log('dom')
			let dom = this.$refs.textareaRef.$refs.textarea;
			console.log(dom,'dom')
            let index  = dom.selectionStart;
            let contont = dom.value;
            let val = '【姓名】'
            this.formData.birthdayNotice = contont.substring(0,index) + val + contont.substring(index,contont.length)
            this.$nextTick(()=>{
                dom.focus();
                dom.setSelectionRange(index + val.length,index + val.length)
            });
		},
		cancel(){
            this.closeAndGoback()
        },
		queryView(){
			this.$api.getCorpInfo().then( res => { 
				this.formData = res.corpInfo
				this.formData.remainMms =res.remainMms
				this.corpInfo.logoUrl = res.corpInfo.logoUrl
				this.formData.birthdayNotice = res.birthdayNotice
				this.setCorpInfo(this.corpInfo)
			}).catch(error=>{
				console.log(error)
			})
		},

        submit(){
			console.log(this.formData.sendBirthdayNotice,'this.formData.sendBirthdayNotice')
			console.log(this.formData.birthdayNotice,'this.formData.birthdayNotice')
			console.log(this.formData.noticeBeforDay,'this.formData.noticeBeforDay')
			if(this.formData.sendBirthdayNotice === 1){
				if(this.formData.birthdayNotice === ''){
					return this.$message.warning('请输入生日提醒短信内容')
				}
				if(this.formData.noticeBeforDay === ''){
					return this.$message.warning('请输入提前发送生日提醒天数')
				}
			}
            this.$api.modifyBirthdayNotice({
				birthdayNotice:this.formData.birthdayNotice,
				sendBirthdayNotice:this.formData.sendBirthdayNotice,
				noticeBeforDay:this.formData.noticeBeforDay,
			}).then( res => { 
                this.$message.success('修改企业信息成功')
				this.queryView()
            }).catch(error=>{
                console.log(error)
            })
        },
	}
}
</script>
<style scoped lang="scss">
    
</style>