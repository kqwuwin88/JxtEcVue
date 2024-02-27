<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
		<div class="info_content_box" flex-box="1">
			<div class="ic_title">发送控制</div>
			<div class="info_content_cell vsd-mb-40">
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>发送方式</div>
					<div class="dd">
                        <el-radio-group v-model="formData.sendBirthdayNotice">
							<el-radio :label="0">每日</el-radio>
							<el-radio :label="1">每月</el-radio>
							<el-radio :label="1">按次</el-radio>
						</el-radio-group>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>发送消息总数</div>
					<div class="dd">
                        <el-input v-model="formData.signName" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>每日消息数</div>
					<div class="dd">
                        <el-input v-model="formData.srcAddr" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>消息发送时间段</div>
					<div class="dd">
                        <el-row style="width:40%">
                            <el-col :span="11">
                                <el-time-picker placeholder="选择起始时间" style="width:100%" v-model="formData.sendBeginTime" format='HH:mm' :picker-options="{format:'HH:mm:s'}" value-format="HH:mm"></el-time-picker>
                            </el-col>
                            <el-col :span="2" class="driver-line_color">
                                ——
                            </el-col>
                            <el-col :span="11">
                                <el-time-picker placeholder="选择结束时间" v-model="formData.sendBeginTime" format='HH:mm' :picker-options="{format:'HH:mm:s'}" value-format="HH:mm" style="width:100%"></el-time-picker>
                            </el-col>
                        </el-row>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>任务失效日期</div>
					<div class="dd">
						<el-input v-model="formData.mobile" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
					</div>
				</div>
			</div>
            <div class="ic_title">用户标签</div>
			<div class="info_content_cell vsd-mb-40">
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>任务名称</div>
					<div class="dd">
                        <el-input v-model="formData.corpName" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>区域ID</div>
					<div class="dd">
                        <el-input v-model="formData.signName" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>年龄</div>
					<div class="dd">
                        <el-row style="width:40%">
                            <el-col :span="11">
                                <el-input v-model="formData.srcAddr" autocomplete="off" maxlength="20" size="small" style="width:100%"></el-input>
                            </el-col>
                            <el-col :span="2" class="driver-line_color">
                                ——
                            </el-col>
                            <el-col :span="11">
                                <el-input v-model="formData.srcAddr" autocomplete="off" maxlength="20" size="small" style="width:100%"></el-input>
                            </el-col>
                        </el-row>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>性别</div>
					<div class="dd">
                        <el-radio-group v-model="formData.sendBirthdayNotice">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">男</el-radio>
							<el-radio :label="1">女</el-radio>
						</el-radio-group>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
                    </div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>开机状态</div>
					<div class="dd">
						<el-radio-group v-model="formData.sendBirthdayNotice">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">开机</el-radio>
							<el-radio :label="1">停机</el-radio>
						</el-radio-group>
					</div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>上月ARPU</div>
					<div class="dd">
						<el-input v-model="formData.mobile" autocomplete="off" maxlength="20" size="small" style="width:40%"></el-input>
                        <span class="form-item-trans">说明文字说明文字说明文字说明文字</span>
					</div>
				</div>
                <div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>用户归属</div>
					<div class="dd">
						<el-radio-group v-model="formData.sendBirthdayNotice">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">省内</el-radio>
							<el-radio :label="1">省外</el-radio>
						</el-radio-group>
					</div>
				</div>
			</div>
		</div>
		<div class="edit-bot-op" flex-box="0">
            <el-button type="primary" size="small" @click="submit">创建任务</el-button>
            <el-button type="primary" size="small" @click="cancel" plain>取消</el-button>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
export default {
	data(){
		return {
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
	},
  	watch: {
    },
  	computed: {
       
    },
	mounted(){},
	methods:{
		cancel(){
            this.closeAndGoback()
        },
        submit(){
            /* if(this.formData.corpName === ''){
                return this.$message.warning('请输入子账号名称')
            }
            const url = this.formData.id ? 'modifyCorpRegist' : 'addCorpRegist'
            this.$api[url](this.formData).then( res => { 
                this.$message.success('保存成功')
                this.closeAndGoback()
            }).catch(error=>{
                console.log(error)
            }) */
        },
	}
}
</script>
<style scoped lang="scss">
    
</style>