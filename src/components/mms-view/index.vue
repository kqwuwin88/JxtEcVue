<template>
    <vsd-ico-dialog title="彩信预览" icon="04" :visible.sync="pageVisible" width="600px">
        <div v-if="pageVisible" class="module-preview" flex-box="0" flex="dir:top">
            <div class="mms_view_title">
                <span>彩信标题</span>
                <p>{{subject}}</p>
            </div>
            <div class="mms_view_zm" flex-box="1">
                <el-carousel :interval="5000" :autoplay="false" :initial-index="0" indicator-position="none" arrow="never" height="420px" @change="changCar" ref="mmsCarousel">
                    <el-carousel-item v-for="(item,index) in pages" :key="index">
                        <div class="pre_mms_content">
                            <p class="text">{{ item.content }}</p>
                            <img style="width:100%;height:240px"  v-if="item.imgPath&&item.imgPath!==''" :src="$baseUrl + item.imgPath"/>
                            <video style="width:100%" v-if="item.videoPath&&item.videoPath!==''" controls="controls" :src="$baseUrl + item.videoPath">
                                您的浏览器不支持 video 标签。
                            </video>
                            <div class="carousel_audio" v-if="item.audioPath&&item.audioPath!==''">
                                <audio controls :src="$baseUrl + item.audioPath"/>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="pre_mms_bot">
                <div @click="toPrev" class="el-icon-arrow-left left"></div>
                <div>{{indexCar}}/{{pages.length}}</div>
                <div @click="toNext" class="el-icon-arrow-right right"></div>
            </div>
        </div>
    </vsd-ico-dialog>
</template>

<script>
export default {
	data(){
		return {
            indexCar:1,
            subject:'',
            pages:[],
            pageVisible:false,
		}
    },
    props:{
        isPreview:{
            type:Boolean,
            default:false,
        },
        previewData:{
            type:Object,
            default:()=>({})
        },
        msgType:{
            type:Number,
            default:1,
        }
    },
    computed: {
        
    },
    components:{
    },
    filters:{
    },
  	watch: {
        
    },
    created(){
    },
	mounted(){},
	methods:{
        toPrev(){
            this.$refs.mmsCarousel.prev()
        },
        toNext(){
            this.$refs.mmsCarousel.next()
        },
        changCar(index){
            this.indexCar = index + 1
        },
        open(id){
            this.indexCar = 1
            this.pageVisible = true
            this.queryView(id)
        },
        closeDialog(e) {
            // console.log("弹窗关闭了", e);
            this.pageVisible = false
        },
        queryView(id){
            if(this.isPreview) {
                this.pages = this.previewData.pages
                this.subject = this.previewData.subject
                return
            }
			this.$api.previewMms({id:id,msgType:this.msgType}).then( res => { 
                this.pageVisible = true
                this.pages = JSON.parse(res.info)
                this.subject = res.mmsTitle
			}).catch(error=>{})
        },
	}
}
</script>
<style scoped lang="scss">
    .mms_view_title{
        border: 1px solid #d4d5db;
        border-radius: 3px;
        display: flex;
        span{
            padding: 10px;
            flex: 0 0 auto;
            border-right: 1px solid #d4d5db;
        }
        p{
            padding: 10px;
            white-space: nowrap;
            flex: 1 1 auto;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .mms_view_zm{
        border: 1px solid #d4d5db;
        margin-top: 10px;
        padding: 6px 30px;
        .pre_mms_content{
            height: 100%;
            overflow: auto;
            .text{
                font-size: 14px;
                color: #3d3b3d;
            }
        }
    }
</style>