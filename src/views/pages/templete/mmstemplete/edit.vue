<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-content-box" flex-box="1">
            <el-form ref="formEdit" :model="formEdit" label-position="top" label-width="100%" class="edit-form-custom">
                <el-form-item label="彩信主题">
                    <el-input v-model="formEdit.subject" placeholder="请输入彩信主题"></el-input>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-select v-model="formEdit.classId" placeholder="请选择" style="width:100%">
                        <el-option :label="item.className" v-for="item in classList" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="彩信内容" class="flex-label-item">
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
                                注：图片支持JPG、PNG、GIF等格式；视频支持3gp格式。
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
                    <div flex="cross:center">
                        <div class="mms_s_l" flex-box="0" @click="scrollLeft"><i class="el-icon-caret-left"></i></div>
                        <ul class="mm_s_c_box sort_list" flex-box="1" ref="scrollBox" flex>
                            <li v-for="(li,index) in pages" :key="li.key" class="sort_item" :class="{actived:active==index}" @click="activeFun(index)">
                                <span class="xg_img"></span>
                                <i class="el-icon-close" @click.stop="delRoll(index)" v-if="pages.length>1"></i>
                            </li>
                            <li @click="addRoll" class="li_add"><span class="el-icon-plus"></span></li>
                        </ul>
                        <div class="mms_s_r" flex-box="0" @click="scrollRight"><i class="el-icon-caret-right"></i></div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="edit-bot-op" flex-box="0">
            <el-button type="primary" size="small" @click="addTempSubmit">保存</el-button>
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
        <mmsView ref="mmsView" :isPreview="true" :previewData="{pages,...formEdit}" />
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import mmsView from '@/components/mms-view'
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
                subject: '',
                classId:'',
            },
            classList:[],
            pages:[{...defaultPage,key:util.uuid()}],
            ativePage:{...defaultPage},
            active:0,
            textVisible:false,
            pagemmSize:'0k',
            addText:''
		}
	},
    filters:{
       
    },
	mixins:[storeData],
	components: {mmsView},
	created() {
        this.queryView()
        this.getClassList()
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
            },
            immediate:true
        },
        mmsSize(val){
            this.pagemmSize = val > 1024 ? ((val/1024).toFixed(2) + 'M') : (val + 'K')
        },
    },
  	computed: {
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
                console.log(evt)
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
        getClassList(){
            this.$api.mmsClassList().then( res => { 
                 this.classList = res.info
			}).catch(error=>{
				console.log(error)
			})
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
            if(this.pages[this.active].audioPath && this.pages[this.active].audioPath !== ''){
                return this.$message.warning('请先删除音频！')
            }
			this.pages[this.active].videoPath = "";
			this.pages[this.active].videoPathsize = 0;
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
            if(this.hasDataCache) return
            const id = this.$route.query.id
            if(id){
                this.$api.toModifyMmsTemplate({templateId:id}).then( res => { 
                    this.formEdit.subject = res.mmsTitle
                    this.formEdit.classId = res.classId+''
                    this.pages = JSON.parse(res.info).map(item=>{
                        item.key = util.uuid()
                        return item
                    })
                    console.log(this.pages,'this.pages')
                    /* this.$nextTick(()=>{
                        this.pagemmSize = res.mmsSize > 1024 ? ((res.mmsSize/1024).toFixed(2) + 'M') : (res.mmsSize + 'K')
                    }) */
                }).catch(error=>{
                    console.log(error)
                })
            }
		},
        addTempSubmit(){
            if(this.formEdit.subject==='') return this.$message.warning('彩信标题不能为空！')
            if(this.formEdit.classId==='') return this.$message.warning('所属分类不能为空！')
            const isEmpty = this.pages.some(item=>{
                const keys = ['content','imgPath','videoPath']
                return keys.every(key=>{
                    return Object.hasOwnProperty.call(item, key) && item[key]===''
                })
            })
            if(isEmpty) return this.$message.warning('文本不能为空,且有图片或视频！')
            const frames = this.pages.map((item,index)=>{
                return {
                    frameNo:index,
                    imgPath:item.imgPath,
                    videoPath:item.videoPath,
                    audioPath:item.audioPath,
                    content:item.content,
                }
            })
            const id = this.$route.query.id
            let url = 'addMmsTemplate'
            const sendData = {
                frames,
                ...this.formEdit
            }
            if(id){
               sendData.id = id 
               url = 'modifyMmsTemplate'
            }
            this.$api[url](sendData).then( res => { 
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