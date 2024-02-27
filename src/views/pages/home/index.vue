<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="content-chart-wrap home-lay-box" flex-box="1" flex>
            <div class="home-lay-left" flex-box="1">
				<div class="home-lay-chart">
					<div class="home-lay-title">
						<img src="@/assets/imgs/home_01.png" /><span>短信/彩信发送数</span>
					</div>
					<div class="home-ct-box">
						<chartLine :barData="barData"></chartLine>
					</div>
				</div>
				<div class="home-lay-progress">
					<div flex="cross:center main:justify">
						<div class="home-lay-title">
							<img src="@/assets/imgs/home_02.png" /><span>短信/彩信使用量</span>
						</div>
						<img class="ref-ico" @click="getInfo" src="@/assets/imgs/home_10.png" />
					</div>
					<div class="progress-info">
						<div class="progress-info-col">
							<div flex="main:justify" class="vsd-mb-10">
								<span>短信使用量</span>
								<el-tooltip class="item" effect="dark" content="日短信使用量/月短信使用量" placement="top-start">
									<span class="tip-cor">{{formInline.smsDayNum}}/{{corpInfo.daySmsNum === 0 ? '不限' : corpInfo.daySmsNum}}</span>
								</el-tooltip>
							</div>
							<el-progress :percentage="getPecent(formInline.smsDayNum,corpInfo.daySmsNum)" class="custom_progress" :show-text="false"></el-progress>
						</div>
						<div class="progress-info-col" v-if="formData.supportMms =='1'">
							<div flex="main:justify" class="vsd-mb-10" >
								<span>彩信使用量</span>
								<el-tooltip class="item" effect="dark" content="日彩信使用量/月彩信使用量" placement="top-start">
									<span class="tip-cor">{{formInline.mmsDayNum}}/{{corpInfo.dayMmsNum === 0 ? '不限' : corpInfo.dayMmsNum }}</span>
								</el-tooltip>
							</div>
							<el-progress :percentage="getPecent(formInline.mmsDayNum,corpInfo.dayMmsNum)" class="custom_progress" :show-text="false"></el-progress>
						</div>
					</div>
				</div>
				<div class="home-lay-quickly">
					<el-row :gutter="30">
						<el-col :span="12">
							<div class="home-quickly-col" flex @click="$router.push('/smstemplete/add')">
								<div class="t_img"><img src="@/assets/imgs/home_03.png" flex-box="0" /></div>
								<div flex-box="1" style="overflow:hidden">
									<div class="color1 col-title">创建短信模板</div>
									<div class="col-text">将常用短信创建为模板，便于后期的使用。</div>
								</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="home-quickly-col" flex @click="$router.push('/smsSendedDetail')">
								<div class="t_img"><img src="@/assets/imgs/home_05.png" flex-box="0" /></div>
								<div flex-box="1" style="overflow:hidden">
									<div class="color2 col-title">已发送短信查询</div>
									<div class="col-text">可根据手机号码、短信内容、发送时间等查询已发送的短信记录。</div>
								</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="home-quickly-col" flex @click="$router.push('/smsRecieveBox')">
								<div class="t_img"><img src="@/assets/imgs/home_04.png" flex-box="0" /></div>
								<div flex-box="1" style="overflow:hidden">
									<div class="color3 col-title">短信收件箱</div>
									<div class="col-text">查看手机用户回复的短信，实现与用户的交互式沟通。</div>
								</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="home-quickly-col" flex @click="$router.push('/statday')">
								<div class="t_img"><img src="@/assets/imgs/home_06.png" flex-box="0" /></div>
								<div flex-box="1" style="overflow:hidden">
									<div class="color4 col-title">统计报表</div>
									<div class="col-text">统计每日的短信发送量、成功数、成功率等。</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="home-lay-right" flex-box="0">
				<div class="home-lay-title">
					<img src="@/assets/imgs/home_07.png" /><span>平台公告</span>
				</div>
				<div class="home-notice">
					<p v-for="item in formInline.announceList" @click="toNoticeView(item.content)" :key="item.id">{{item.subject}}</p>
				</div>
				<img class="home-under" src="@/assets/imgs/home_14.png" />
				<div flex="cross:center">
					<div class="home-lay-title" flex-box="0">
						<img src="@/assets/imgs/home_08.png" /><span>技术支持</span>
					</div>
					<span class="home-lay-titler" flex-box="1">工作日 08:30-17:30</span>
				</div>
				<div class="home-zc">
					<div>Q   Q： 5006194</div>
					<div>电话1： 085182205039</div>
					<div>电话2： 18798726105</div>
					<div>电话3： 18785523478</div>
				</div>
				<img class="home-under" src="@/assets/imgs/home_14.png" />
				<div class="home-lay-title">
					<img src="@/assets/imgs/home_09.png" /><span>资源下载</span>
				</div>
				<div class="home-zy">
					<p @click="dnLoad(4)">· 操作手册</p>
					<p @click="dnLoad(3)">· 接口文档</p>
					<p @click="dnLoad(5)">· 视频地址</p>
				</div>
				<img class="home-under" src="@/assets/imgs/home_14.png" />
			</div>
        </div>
		<vsd-ico-dialog title="公告详情" icon="21" :visible.sync="noticeVisible" width="600px">
            <div v-html="noticeContent" style="min-height:200px"></div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="noticeVisible = false" type="primary" plain size="small">关 闭</el-button>
            </div>
        </vsd-ico-dialog>
		<el-dialog :visible.sync="realVisible" width="630px" append-to-body class="custom-dialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div slot="title" flex="cross:center">
				<img class="vsd-mr-10" src="@/assets/imgs/modal/22.png" />
				<span>实名认证</span>
			</div>
            <div style="line-height:26px;padding:20px">
                根据工信部与移动集团公司风险管控安全指导要求，在您启用端口时，须填报实名制信息(营业执照、法人身份证等信息)，仅需填报—次即可，我司同时承诺实名内容仅用于安全防控工作备案，除此之外将对您的信息进行绝对保密。考虑到紧急发送短信情况，您可忽略关闭本弹窗3次，3次后将不允许关闭，必须完成填写才能使用本平台功能，对您造成不便敬请谅解!
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleReal" v-if="formInline.closeButton === 0" plain size="small">暂时忽略</el-button>
                <el-button type="primary" size="small" @click="apprVisible = true">确认填写</el-button>
            </div>
        </el-dialog>
		<el-dialog :visible.sync="apprVisible" width="1400px" append-to-body class="custom-dialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div slot="title" flex="cross:center">
				<img class="vsd-mr-10" src="@/assets/imgs/modal/22.png" />
				<span>{{formData.status === 0 ? '行业端口实名制填报' : '审核未通过，审核意见: '+formData.noPassDescribe}}</span>
			</div>
			<div class="info_content_cell">
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>集团编号</div>
					<div class="dd">{{formData.corpId}}</div>
					<div class="tt"><i class="label-require">*</i>集团名称</div>
					<div class="dd">{{formData.corpName}}</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>企业签名</div>
					<div class="dd">{{formData.signName}}</div>
					<div class="tt"><i class="label-require">*</i>接入省份</div>
					<div class="dd">{{formData.province}}</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>接入地市</div>
					<div class="dd">
						<el-select v-model="formData.areaId" placeholder="请选择" style="width:100%"> 
							<el-option v-for="item in formInline.areaList" :key="item.areaId" :label="item.areaName" :value="item.areaId"> </el-option>
						</el-select>
					</div>
					<div class="tt"><i class="label-require">*</i>所属分公司</div>
					<div class="dd">
                        <el-input v-model="formData.branchCorpName" autocomplete="off" size="small" style="width:100%"></el-input>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>主端口</div>
					<div class="dd">{{formData.srcAddr}}</div>
					<div class="tt"><i class="label-require">*</i>需要子端口</div>
					<div class="dd">
						<el-radio-group v-model="formData.needChildPort">
							<el-radio :label="1">需要</el-radio>
							<el-radio :label="0">不需要</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt">子端口</div>
					<div class="dd">
                        <el-input v-model="formData.childPort" autocomplete="off" size="small" style="width:100%"></el-input>
					</div>
					<div class="tt"><i class="label-require">*</i>端口实际使用单位</div>
					<div class="dd">
                        <el-input v-model="formData.userCorp" autocomplete="off" size="small" style="width:100%"></el-input>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>营业执照/组织机构代码</div>
					<div class="dd">
                        <el-input v-model="formData.businessLicense" autocomplete="off" size="small" style="width:100%"></el-input>
					</div>
					<div class="tt"></div>
					<div class="dd"></div>
				</div>
				<div class="info_content_tr">
					<div class="tt">端口实际使用单位营业执照/组织机构代码</div>
					<div class="dd">
						<div v-if="formData.businessPic">
                            <img style="cursor:pointer" @click="showImg('businessPicImg')" src="@/assets/imgs/child_02.png" />
                            <el-image :src="formData.businessPic" ref="businessPicImg" style="display:none" :preview-src-list="[postUrl + formData.businessPic]"> </el-image>
                        </div>
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="file=>beforeAvatarUpload1(file,'businessPic')">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>有APP使用该端口发送消息</div>
					<div class="dd">
						<el-radio-group v-model="formData.app">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</div>
					<div class="tt">APP名称</div>
					<div class="dd">
                        <el-input v-model="formData.appName" autocomplete="off" size="small" style="width:100%"></el-input>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tds">
						<div class="tds_dd">
							<div class="tt"><i class="label-require">*</i>责任人（法人）姓名</div>
							<div class="dd">
								<el-input v-model="formData.artificialPerson" autocomplete="off" size="small" style="width:100%"></el-input>
							</div>
						</div>
						<div class="tds_dd">
							<div class="tt"><i class="label-require">*</i>责任人（法人）证件号码</div>
							<div class="dd">
								<el-input v-model="formData.idCardNo" autocomplete="off" size="small" style="width:100%"></el-input>
							</div>
						</div>
					</div>
					<div class="tt"><i class="label-require">*</i>责任人（法人）证件类型</div>
					<div class="dd">
						<el-radio-group v-model="formData.idCardType" class="wid_radio">
							<el-radio :label="1">居民身份证</el-radio>
							<el-radio :label="2">港澳居民来往内地通行证</el-radio>
							<el-radio :label="3">台湾居民来往内地通行证</el-radio>
							<el-radio :label="4">护照</el-radio>
							<el-radio :label="5">外国人永久居留身份证</el-radio>
							<el-radio :label="6">港澳台居民居住证</el-radio>
						</el-radio-group>
					</div>
				</div>
				
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>责任人（法人）证件</div>
					<div class="dd">
						<div v-if="formData.idCardPic">
                            <img style="cursor:pointer" @click="showImg('idCardPicImg')" src="@/assets/imgs/child_02.png" />
                            <el-image :src="formData.idCardPic" ref="idCardPicImg" style="display:none" :preview-src-list="[postUrl + formData.idCardPic]"> </el-image>
                        </div>
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="file=>beforeAvatarUpload1(file,'idCardPic')">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>

				<div class="info_content_tr">
					<div class="tds">
						<div class="tds_dd">
							<div class="tt"><i class="label-require">*</i>经办人姓名</div>
							<div class="dd">
								<el-input v-model="formData.operatorPerson" autocomplete="off" size="small" style="width:100%"></el-input>
							</div>
						</div>
						<div class="tds_dd">
							<div class="tt"><i class="label-require">*</i>经办人证件号码</div>
							<div class="dd">
								<el-input v-model="formData.operatorIdCardNo" autocomplete="off" size="small" style="width:100%"></el-input>
							</div>
						</div>
					</div>
					<div class="tt"><i class="label-require">*</i>经办人证件类型</div>
					<div class="dd">
						<el-radio-group v-model="formData.operatorIdCardType" class="wid_radio">
							<el-radio :label="1">居民身份证</el-radio>
							<el-radio :label="2">港澳居民来往内地通行证</el-radio>
							<el-radio :label="3">台湾居民来往内地通行证</el-radio>
							<el-radio :label="4">护照</el-radio>
							<el-radio :label="5">外国人永久居留身份证</el-radio>
							<el-radio :label="6">港澳台居民居住证</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>经办人证件</div>
					<div class="dd">
						<div v-if="formData.operatorIdCardPic">
                            <img style="cursor:pointer" @click="showImg('operatorIdCardPicImg')" src="@/assets/imgs/child_02.png" />
                            <el-image :src="formData.operatorIdCardPic" ref="operatorIdCardPicImg" style="display:none" :preview-src-list="[postUrl + formData.operatorIdCardPic]"> </el-image>
                        </div>
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="file=>beforeAvatarUpload1(file,'operatorIdCardPic')">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>授权书</div>
					<div class="dd">
						<div v-if="formData.empowerPic">
                            <img style="cursor:pointer" @click="showImg('empowerPicImg')" src="@/assets/imgs/child_02.png" />
                            <el-image :src="formData.empowerPic" ref="empowerPicImg" style="display:none" :preview-src-list="[postUrl + formData.empowerPic]"> </el-image>
                        </div>
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="file=>beforeAvatarUpload1(file,'empowerPic')">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>授权开始日期</div>
					<div class="dd">
						<el-date-picker v-model="formData.empowerBeginDate" type="date" style="width:100%;" placeholder="请选择" value-format="yyyy-MM-dd" clearable></el-date-picker>
					</div>
					<div class="tt"><i class="label-require">*</i>授权到期日期</div>
					<div class="dd">
						<el-date-picker v-model="formData.empowerEndDate" type="date" style="width:100%;" placeholder="请选择" value-format="yyyy-MM-dd" clearable></el-date-picker>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>短信端口服务类型</div>
					<div class="dd">
						<el-radio-group v-model="formData.serviceType">
							<el-radio :label="1">账号注册/登录</el-radio>
							<el-radio :label="2">广告促销</el-radio>
							<el-radio :label="3">通知提醒</el-radio>
							<el-radio :label="4">公共服务</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>现场拍摄留存经办人手持身份证照片</div>
					<div class="dd">
						<div v-if="formData.scenePic">
                            <img style="cursor:pointer" @click="showImg('scenePicImg')" src="@/assets/imgs/child_02.png" />
                            <el-image :src="formData.scenePic" ref="scenePicImg" style="display:none" :preview-src-list="[postUrl + formData.scenePic]"> </el-image>
                        </div>
						<img v-else src="@/assets/imgs/child_01.png" />
                        <el-upload action="" :show-file-list="false" :before-upload="file=>beforeAvatarUpload1(file,'scenePic')">
                            <el-button type="primary"><img src="@/assets/imgs/info_01.png" class="btn-img1">点击上传</el-button>
                        </el-upload>
					</div>
				</div>
				<div class="info_content_tr">
					<div class="tt"><i class="label-require">*</i>短信端口企业商接入机房位置与设备位置</div>
					<div class="dd">
						<el-input v-model="formData.custmerDevice" autocomplete="off" size="small" style="width:100%"></el-input>
					</div>
					<div class="tt"></div>
					<div class="dd"></div>
				</div>
			</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="apprVisible = false" v-if="formInline.closeButton === 0" plain size="small">取  消</el-button>
                <el-button type="primary" size="small" @click="submitRz">提  交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import chartLine from '@/components/chart-line'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
	data(){
		return {
			postUrl:process.env.VUE_APP_APR + '/viewCorpExtendImage?fileName=',
			apprVisible:false,
            realVisible:false,
			noticeVisible:false,
            noticeContent:'',
			formInline:{
				smsDayNum:0,
				smsMonthNum:0,
				mmsDayNum:0,
				mmsMonthNum:0,
				announceList:[],
				extendInfoNotice:0,
				closeButton:0,
			},
			formData:{

			},
			barData:{x:[],y1:[],y2:[]},
		}
	},
    filters:{
    },
	mixins:[storeData],
	components: {chartLine},
	created() {
       this.getInfo()
	},
  	watch: {
       
    },
  	computed: {
		...mapState('allstore', {
            corpInfo: state => state.user.corpInfo,
        }),
		...mapGetters('allstore/menu', [
			'aside'
		])
	},
	mounted(){},
	methods:{
		...mapMutations("allstore/menu", ["asideSet"]),
		dnLoad(param){
			window.location.href = process.env.VUE_APP_APR + '/downloadFile?fileType=' + param;
		},
		cancleReal(){
			this.$api.modifyCorpExtendNoticeNum().then(res=>{
				this.realVisible = false
			})
		},
		submitRz(){
			const rules = [
				{name:'areaId',msg:'请选择接入地市'},
				{name:'branchCorpName',msg:'请输入所属分公司'},
				{name:'needChildPort',msg:'请选择是否需要子端口'},
				{name:'childPort',msg:'请输入子端口'},
				{name:'userCorp',msg:'请输入端口实际使用单位'},
				{name:'businessLicense',msg:'请输入营业执照/组织机构代码'},
				// {name:'businessPic',msg:'请上传端口实际使用单位营业执照/组织机构代码'},
				{name:'app',msg:'请选择是否有APP使用该端口发送消息'},
				{name:'appName',msg:'请输入APP名称'},
				{name:'artificialPerson',msg:'请输入责任人（法人）姓名'},
				{name:'idCardNo',msg:'请输入责任人（法人）证件号码'},
				{name:'idCardType',msg:'请选择责任人（法人）证件类型'},
				{name:'idCardPic',msg:'请上传责任人（法人）证件'},
				{name:'operatorPerson',msg:'请输入经办人姓名'},
				{name:'operatorIdCardNo',msg:'请输入经办人证件号码'},
				{name:'operatorIdCardType',msg:'请选择经办人证件类型'},
				{name:'operatorIdCardPic',msg:'请上传经办人证件'},
				{name:'empowerPic',msg:'请上传授权书'},
				{name:'empowerBeginDate',msg:'请选择授权开始日期'},
				{name:'empowerEndDate',msg:'请选择授权到期日期'},
				{name:'serviceType',msg:'请选择短信端口服务类型'},
				{name:'scenePic',msg:'请上传现场拍摄留存经办人手持身份证照片'},
				{name:'custmerDevice',msg:'短信端口企业商接入机房位置与设备位置'},
			]
			console.log(123)
			try {
				rules.forEach(item=>{
					if(item.name === 'childPort' && this.formData.needChildPort === 1 && this.formData.childPort === ''){
						throw item.msg
					}else if(item.name === 'appName' && this.formData.app === 1 && this.formData.appName === ''){
						throw item.msg
					}else if(item.name === 'serviceType' && (this.formData.serviceType === 0 || this.formData.serviceType === '')){
						throw item.msg
					}else if(item.name === 'operatorIdCardType' && (this.formData.operatorIdCardType === 0 || this.formData.operatorIdCardType === '')){
						throw item.msg
					}else if(item.name === 'idCardType' && (this.formData.idCardType === 0 || this.formData.idCardType === '')){
						throw item.msg
					}else if(this.formData[item.name] === ''){
						throw item.msg
					}
				})
			} catch (error) {
				return this.$message.warning(error)
			}
			this.$api.updateCorpExtend(this.formData).then( res => { 
				this.$message.success('保存认证成功')
				this.apprVisible = false
				this.realVisible = false

			}).catch(error=>{})
		},
		showImg(dom){
            this.$refs[dom].showViewer = true
        },
		beforeAvatarUpload1(file,param){
			console.log(param,'param')
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
            this.$api.uploadCorpExtend(formData).then( res => {
                this.$message.success('上传成功')
                this.formData[param] = res.fileName.replace(/\\/g,'//')
            }).catch(error=>{})
            return false;
		},
		toNoticeView(view){
			this.noticeContent = view
			this.noticeVisible = true
		},
		getInfo(){
			this.$api.indexView({}).then( res => { 
				this.formInline = res
				this.barData = {
                    x: res.smsStatist.map(item=>item.statistDate),
                    y1: res.smsStatist.map(item=>item.smsNum),
                    y2: res.mmsStatist.map(item=>item.smsNum),
                }
				if(this.formInline.extendInfoNotice === 1){
					this.realVisible = true
				}
				this.formData = res.corpExtend || {}
				this.formData.supportMms =res.supportMms
					const newAside = []
					//左菜单权限控制器
					this.aside.forEach(item=>{
						if(item.meta.title === '模板管理'){
							if(res.supportMms === 0){
								newAside.push({...item,children:[item.children[0]]})
							}else{
								newAside.push(item)
							}
						}else if(item.meta.title === '企业管理'){
							if(this.corpInfo.createChild === 1){
								newAside.push({...item,children:[item.children[0],item.children[1],item.children[2]]})
							}else{
								newAside.push(item)
							}
						}else if(item.meta.title === '彩信管理'){
							if(res.supportMms !== 0){
								newAside.push(item)
							}
						}else if(item.meta.title === '短信管理'){
							if(this.corpInfo.sceneType == 1){
								newAside.push(item)

							}else{
								newAside.push({...item,children:[item.children[0],item.children[1],item.children[2],item.children[3]
									,item.children[5],item.children[6],item.children[7],item.children[8]]})
							}
						}else if(item.meta.title === '报表管理'){
							//不支持彩信和位置短信
							if(res.supportMms == 0 && this.corpInfo.sceneType !== 1){
								newAside.push({...item,children:[item.children[0],item.children[1],item.children[2]]})
							}
							//不支持彩信支持位置短信
						    else if(res.supportMms == 0 && this.corpInfo.sceneType == 1){
								newAside.push({...item,children:[item.children[0],item.children[1],item.children[2],item.children[3]]})
							}
							//支持彩信不支持位置短
							else if(res.supportMms !== 0 && this.corpInfo.sceneType !== 1){
								newAside.push({...item,children:[item.children[0],item.children[1],item.children[2],item.children[4]]})
							}else{
								newAside.push(item)
							}
						}else{
							newAside.push(item)
						}
					})
					console.log(newAside,'newAside')
					this.asideSet(newAside)
			}).catch(error=>{
				console.log(error)
			})
		},
		getPecent(fz,fm){
			if(!fz || fz === 0) return 0
			if(fz > fm) return 100
			if(fm === 0) return 20
			return Math.max((fz/fm).toFixed(2),5)
		},
	}
}
</script>