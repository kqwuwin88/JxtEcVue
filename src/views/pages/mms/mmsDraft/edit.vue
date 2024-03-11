<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-content-box" flex-box="1">
            <el-form ref="formEdit" :model="formEdit" label-position="top" label-width="100%" class="edit-form-custom">
                <el-form-item label="" class="flex-label-item">
                    <div slot="label" flex="main:justify" @click.stop.prevent>
                        <span>接收号码</span>
                        <div>
                            <el-button type="primary" size="small" @click="showMailDialog">通讯录</el-button>
                            <el-button type="primary" size="small" @click="exportMail" plain>文件导入</el-button>
                        </div>
                    </div>
                    <div class="add_temp_area_wrap vsd-pt-10">
                        <div class="cks-text">{{cksRowGroup}}</div>
                        <div class="cks-text">{{cksRowText}}</div>
                        <el-input v-model="formEdit.msisdn" type="textarea" ref="textareaRef" placeholder="请输入手机号码，多个号码请换行" resize="none" :rows="5"></el-input>
                        <div class="tip">  注：多个手机号码之间请用 ,隔开，如139XXXXXXXX,138XXXXXXXX</div>
                    </div>
                </el-form-item>
                    <el-form-item label="彩信主题">
                        <el-input v-model="formEdit.mmsTitle" placeholder="请输入彩信主题"></el-input>
                    </el-form-item>
                    <el-form-item class="flex-label-item">
                        <div slot="label" flex="main:justify">
                            <span>彩信内容</span>
                            <span>{{pagemmSize}}</span>
                        </div>
                        <div class="mms_content_box" flex>
                            <div class="mms_text_area" flex-box="1">
                                <div class="mms_text">
                                    <div>{{ativePage.content}}</div>
                                    <img style="height:180px;width:320px"  v-if="ativePage.imgPath&&ativePage.imgPath!==''" :src="$baseUrl + ativePage.imgPath"/>
                                    <video style="max-width:300px;max-height:200px;" v-if="ativePage.videoPath&&ativePage.videoPath!==''" controls="controls" :src="$baseUrl + ativePage.videoPath">
                                        您的浏览器不支持 video 标签。
                                    </video>
                                    <div v-if="ativePage.audioPath&&ativePage.audioPath!==''">
                                        <audio controls :src="$baseUrl + ativePage.audioPath"/>
                                    </div>
                                </div>
                                <div class="mms_text_tip">
                                    注：图片支持JPG、PNG、GIF等格式；视频支持3gp/mp4格式。
                                </div>
                            </div>
                            <div class="vsd-ml-20" flex-box="0" flex="dir:top main:justify">
                                <div><el-button @click="showAddText" type="primary" size="small"><img class="btn-img" src="@/assets/imgs/mms_01.png"/>添加文本</el-button></div>
                                <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUploadImage">
                                    <el-button type="primary" size="small"><img class="btn-img" src="@/assets/imgs/mms_02.png"/>添加图片</el-button>
                                </el-upload>
                                <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUploadVideo">
                                    <el-button type="primary" size="small"><img class="btn-img" src="@/assets/imgs/mms_04.png"/>添加视频</el-button>
                                </el-upload>
                                <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUploadAudio" :disabled="ativePage.content === '' && !ativePage.imgPath && !ativePage.videoPath">
                                    <el-button type="primary" :disabled="ativePage.content === '' && !ativePage.imgPath && !ativePage.videoPath" size="small"><img class="btn-img" src="@/assets/imgs/mms_03.png"/>添加音频</el-button>
                                </el-upload>
                                <div><el-button type="primary" size="small" @click="delRollText"><img class="btn-img" src="@/assets/imgs/mms_05.png"/>删除文本</el-button></div>
                                <div><el-button type="primary" size="small" @click="delRollImg"><img class="btn-img" src="@/assets/imgs/mms_05.png"/>删除图片</el-button></div>
                                <div><el-button type="primary" size="small" @click="delRollVideo"><img class="btn-img" src="@/assets/imgs/mms_05.png"/>删除视频</el-button></div>
                                <div><el-button type="primary" size="small" @click="delRollAudio"><img class="btn-img" src="@/assets/imgs/mms_05.png"/>删除音频</el-button></div>
                            </div>
                        </div>
                    </el-form-item>
                <div flex="cross:center">
                    <div class="mms_s_l" flex-box="0" @click="scrollLeft"><i class="el-icon-caret-left"></i></div>
                    <ul class="mm_s_c_box sort_list" flex-box="1" ref="scrollBox" flex style="padding:5px 0">
                        <li v-for="(li,index) in pages" :key="li.key" class="sort_item" :class="{actived:active==index}" @click="activeFun(index)">
                            <span class="xg_img"></span>
                            <i class="el-icon-close" @click.stop="delRoll(index)" v-if="pages.length>1"></i>
                        </li>
                        <li @click="addRoll" class="li_add"><span class="el-icon-plus"></span></li>
                    </ul>
                    <div class="mms_s_r" flex-box="0" @click="scrollRight"><i class="el-icon-caret-right"></i></div>
                </div>
                <el-form-item label="发送方式">
                    <el-radio-group v-model="formEdit.sendType">
                        <el-radio :label="0">立即发送</el-radio>
                        <el-radio :label="1">定时发送</el-radio>
                    </el-radio-group>
                    <el-date-picker v-if="formEdit.sendType===1" size="medium" class="vsd-ml-20" v-model="formEdit.sendTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
                </el-form-item>
                <el-form-item label="操作方式">
                    <el-radio-group v-model="formEdit.delDraft">
                        <el-radio :label="1">发送后从草稿箱删除</el-radio>
                        <el-radio :label="0">发送后保留在草稿箱</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="edit-bot-op" flex-box="0">
            <el-button type="primary" size="small" @click="sendSubmit()">发送</el-button>
            <el-button type="primary" size="small" @click="priviewHandle" plain>预览</el-button>
        </div>
        <vsd-ico-dialog title="添加文本" icon="03" :visible.sync="textVisible" width="600px">
            <el-form label-position="top" size="default">
                <el-form-item>
                    <el-input type="textarea" :rows="10" resize="none" v-model="addText" placeholder="请输入文本...">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="textVisible = false" plain size="small">取消</el-button>
                <el-button @click="submitTextHandle" type="primary" size="small">保存</el-button>
            </div>
        </vsd-ico-dialog>
        <mmsView ref="mmsView" :isPreview="true" :previewData="{pages,subject:this.formEdit.mmsTitle}" />
        <mailSelect ref="mailSelect" @mailChange="mailChange" />
        <vsd-ico-dialog title="上传" :visible.sync="dialogFormImport" icon="13" width="440px">
            <el-form label-position="top">
                <el-form-item label="文件" require>
			      	<el-upload class="pic-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUploadMail">
                        <a href="javascript:;" class="pic-uploader-icon"><i class="el-icon-upload2"></i>上传文件</a>
					</el-upload>
			    </el-form-item>
            </el-form>
            <div>
                <p class="i-color">支持Excel及txt文本，每行一个手机号码</p>
            </div>
        </vsd-ico-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import mmsView from '@/components/mms-view'
import mailSelect from '@/components/mail-select/index.vue'
import pagination from '@/mixins/pagination'
import Sortable from 'sortablejs'
import util from '@/libs/util'
let defaultPage = {
    content:'',
    imgPath:'',
    videoPath:'',
    audioPath:'',
    videoPathsize:'',
    imgPathsize:'',
    audioPathsize:'',
}
export default {
	data(){
		return {
            formEdit: {
                mmsTitle: '',
                msisdn:'',
                sendType:0,
                sendTime:"",
                delDraft:0,
            },
            pages:[{...defaultPage,key:util.uuid()}],
            ativePage:{...defaultPage},
            active:0,
            textVisible:false,
            pagemmSize:'0k',
            addText:'',
            dialogFormImport:false,
            cksCustom:[],
            cksRows:[],
		}
	},
    filters:{
       
    },
	mixins:[storeData,pagination],
	components: {mmsView,mailSelect},
	created() {
        this.queryView()
        this.queryList()
	},
  	watch: {
        pages:{
            handler(val){
                this.ativePage = {...this.ativePage,...this.pages[this.active]}
            },
            deep: true
        },
        active:{
            handler(val){
                this.ativePage = this.pages[val]
                console.log(this.ativePage,'this.ativePage')
            },
            immediate:true
        },
        mmsSize(val){
            this.pagemmSize = val > 1024 ? ((val/1024).toFixed(2) + 'M') : (val + 'K')
        },
    },
  	computed: {
        cksRowText(){
            return this.cksCustom.map(item=>item.msisdn).join(',')
        },
        cksRowGroup(){
            return this.cksRows.map(item=>`【${item.group_name}】`).join(',')
        },
        mmsSize(){
            const res = this.pages.map(item=>{
                return (item.imgPathsize || 0) + (item.videoPathsize || 0) + (item.audioPathsize || 0)
            })
            const mediaSize = res.reduce((a,b)=>a+b,0)
            const texts = this.pages.map(item=>item.content).filter(item=>item).join('');
            const resSize = mediaSize + this.getTextSize(texts)
            return resSize === 0 ? 0 : resSize.toFixed(2)
        },
    },
	mounted(){
        const el = document.querySelectorAll('.sort_list')[0]
        Sortable.create(el, {
            draggable: ".sort_item", 
            onEnd: (evt) => {
                const { oldIndex, newIndex } = evt
                const page = this.pages[oldIndex]
                this.pages.splice(oldIndex, 1)
                this.pages.splice(newIndex, 0, page)
                this.$nextTick(()=>{
                    const index = this.pages.findIndex(item=>item.key === page.key)
                    this.active = index
                })
            }
        })
    },
	methods:{
        rowClick(item){
            this.$api.toModifyMmsTemplate({templateId:item.id}).then( res => { 
                this.pages = JSON.parse(res.info)
                this.formEdit.mmsTitle = res.mmsTitle
			}).catch(error=>{})
        },
        exportMail(){
            this.dialogFormImport = true
        },
        showMailDialog(){
            //this.$refs.mailSelect.open({cksCustom:this.cksCustom,cksRows:this.cksRows})
            this.$refs.mailSelect.open({cksCustom:JSON.parse(JSON.stringify(this.cksCustom)),cksRows:JSON.parse(JSON.stringify(this.cksRows))})
        },
        beforeAvatarUploadMail(file){
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
        mailChange(data){
            this.cksCustom = data.cksCustom
            this.cksRows = data.cksRows
        },
        
        priviewHandle(){
            this.$refs.mmsView.open()
        },
        submitTextHandle(){
            this.pages[this.active].content = this.addText
            this.textVisible = false
        },
        showAddText(){
            this.addText = this.ativePage.content
            this.textVisible = true
        },
        getTextSize(str) {
            if(str === '') return 0
            var total = 0, charCode;
            for (let i = 0; i < str.length; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0x007f) {
                    total += 1;
                } else if (charCode <= 0x07ff) {
                    total += 2;
                } else if (charCode <= 0xffff) {
                    total += 3;
                } else {
                    total += 4;
                }
            }

            return (total/1024);
        },
        beforeAvatarUploadImage(file){
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
            this.$api.addImage(formData).then( res => {
                this.pages[this.active].imgPath = res.path.replace(/\\/g,'//')
                this.pages[this.active].imgPathsize = res.size/1024
                this.pages[this.active].videoPath = ''
                this.pages[this.active].videoPathsize = 0
                console.log(this.pages,'this.pages')
            }).catch(error=>{})
            return false;
		},
        beforeAvatarUploadVideo(file){
            const types = ['video/3gpp', 'video/mp4']
            const isJPG = (types.indexOf(file.type)>-1)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传视频只能是 3gp/mp4 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传视频大小不能超过 2MB!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            this.$api.addVideo(formData).then( res => {
                this.pages[this.active].videoPath = res.path.replace(/\\/g,'//')
                this.pages[this.active].videoPathsize = res.size/1024
                this.pages[this.active].imgPath = ''
                this.pages[this.active].imgPathsize = 0
            }).catch(error=>{})
            return false;
		},
        beforeAvatarUploadAudio(file){
            const types = ['audio/mpeg']
            const audiotypes = ['amr','mid','imy']
            var index= file.name.lastIndexOf(".");
            var ext = file.name.substr(index+1);
            const isAudio = audiotypes.indexOf(ext) > -1
            const isJPG = (types.indexOf(file.type)>-1 )
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isAudio) {
                this.$message.error('上传音频只能是 amr、mid、imy 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传音频大小不能超过 2MB!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            formData.append('file', file);
            this.$api.addAudio(formData).then( res => {
                this.pages[this.active].audioPath = res.path.replace(/\\/g,'//')
                this.pages[this.active].audioPathsize = res.size/1024
            }).catch(error=>{})
            return false;
		},
        scrollRight(){
			this.$refs.scrollBox.scrollLeft +=120;
		},
		scrollLeft(){
			this.$refs.scrollBox.scrollLeft -=120;
		},
        addRoll(){
			var d = {...defaultPage,key:util.uuid()};
			this.pages.push(d);

		},
        delRoll(index){
			this.pages.splice( index, 1 );
			this.active = index>0 ? index - 1 : 0;
		},
        delRollText(){
            this.pages[this.active].content = "";
            this.$message.success('删除文本成功')
        },
        delRollVideo(){
            console.log('this.pages[this.active]')
            console.log(this.pages[this.active],'this.pages[this.active]')
            if(this.pages[this.active].audioPath && this.pages[this.active].audioPath !== ''){
                return this.$message.warning('请先删除音频！')
            }
            console.log(2)
			this.pages[this.active].videoPath = "";
			this.pages[this.active].videoPathsize = 0;
            console.log(3)
            // this.$message.success('删除视频成功')
		},
        delRollAudio(){
			this.pages[this.active].audioPath = "";
			this.pages[this.active].audioPathsize = 0;
            // this.$message.success('删除音频成功')
		},
        delRollImg(){
            if(this.pages[this.active].audioPath && this.pages[this.active].audioPath !== ''){
                return this.$message.warning('请先删除音频！')
            }
			this.pages[this.active].imgPath = "";
			this.pages[this.active].imgPathsize = 0;
            // this.$message.success('删除图片成功')
		},
        activeFun(index){
			this.active = index;
		},
		queryView(){
            const id = this.$route.query.id
            if(id){
                this.$api.getMmsDraft({id}).then( res => { 
                    this.$api.previewMms({id:res.info.content,msgType:0}).then( detail => { 
                        this.formEdit.mmsTitle = detail.mmsTitle
                        this.formEdit.sendType = res.info.sendType || 0
                        this.formEdit.sendTime = res.info.sendTime || ''
                        this.formEdit.msisdn = res.info.msisdns || ''
                        this.pages = JSON.parse(detail.info).map(item=>{
                            item.key = util.uuid()
                            return item
                        })
                        /* this.$nextTick(()=>{
                            this.pagemmSize = detail.mmsSize > 1024 ? ((detail.mmsSize/1024).toFixed(2) + 'M') : (detail.mmsSize + 'K')
                        }) */
                    }).catch(error=>{})
                }).catch(error=>{
                    console.log(error)
                })
            }
		},
        sendSubmit(){
            const id = this.$route.query.id
            const {mmsTitle,sendType,sendTime,msisdn,delDraft} = this.formEdit
            if(this.cksRowGroup=='' && this.cksRows.length === 0 && this.cksRowText == '' && msisdn === '')return this.$message.warning('请输入手机号或从通讯录选择群组号码')
            if(mmsTitle==='') return this.$message.warning('彩信标题不能为空！')
            console.log(this.pages,'this.pages')
            const isEmpty = this.pages.some(item=>{
                const keys = ['content','imgPath','videoPath']
                return keys.every(key=>{
                    return Object.hasOwnProperty.call(item, key) && item[key]===''
                })
            })
            if(isEmpty) return this.$message.warning('文本不能为空,且有图片或视频！')
            if(sendType===1 && sendTime === '')return this.$message.warning('定时发送时日期不能为空')
            const time = new Date(sendTime)
            if(time.getTime() < Date.now())return this.$message.warning('定时发送时间必须大于当前时间')
            const frames = this.pages.map((item,index)=>{
                return {
                    frameNo:index,
                    imgPath:item.imgPath,
                    videoPath:item.videoPath,
                    audioPath:item.audioPath,
                    content:item.content,
                }
            })
            const msisdns = msisdn.replace('\n',',')
            const groupId = this.cksRows.map(item=>item.id).join(',')
            const sendData = {
                draftId:id,
                opType:0,
                msisdn:[this.cksRowText,msisdns].join(','),
                groupId,
                mmsTitle,
                frames,
                sendType,
                sendTime,
                delDraft
            }
            this.$api.sendMms(sendData).then( res => { 
                this.$message.success('操作成功')
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