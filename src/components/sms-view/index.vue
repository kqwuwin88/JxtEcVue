<template>
    <el-dialog :visible.sync="pageVisible" append-to-body width="630px" class="custom-dialog" :close-on-click-modal="false">
        <div slot="title"><vsd-icon name="envelope-o" class="vsd-mr-5 m-color"/>短信模板</div>
        <div class="vsd-mb-10">所属企业：{{viewData.cropName}}</div>
        <div class="vsd-mb-10">创建日期：{{viewData.createDate}}</div>
        <div v-html="viewData.contentBody" class="mms-content-mode" style="height:300px"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="pageVisible = false" type="primary" plain size="small">关 闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
	data(){
		return {
            viewData:{
                cropName:'',
                createDate:'',
                contentBody:'',
            },
            pageVisible:false,
		}
    },
    props:{
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
        queryView(id){
			this.$api.showSmsTemplate({id,msgType:this.msgType}).then( res => { 
                this.pageVisible = true
                this.viewData.contentBody = res.info.content
                this.viewData.createDate = res.info.addTime
                this.viewData.cropName = res.info.corpName
			}).catch(error=>{})
        },
	}
}
</script>