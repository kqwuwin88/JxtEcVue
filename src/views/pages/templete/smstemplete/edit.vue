<template>
    <div class="init-content-lay content-page-view" style="overflow: auto;">
        <div class="add_temp_view">
            <el-button type="primary" size="small" class="vsd-mb-20" @click="addBL">添加变量</el-button>
            <div class="add_temp_area_wrap">
                <el-input v-model="inputValue" type="textarea" ref="textareaRef" placeholder="请输入模板内容..." resize="none" :rows="5" maxlength="500"></el-input>
                <div class="tip">模板的内容不超过<span class="d-color">500</span>字，当前已输入<span class="d-color vsd-ml-20 vsd-mr-20">{{inputValue.length}}</span>字。</div>
            </div>
        </div>
        <div flex="main:center" class="vsd-p-10">
            <el-button type="primary" size="small" @click="addTempSubmit">提交</el-button>
        </div>
        <div class="add_temp_trans">
            <p>一、添加模板示例为：</p>
            <p class="p1">尊敬的<i class="d-color">【变量】</i>，您好！您本次需要交纳的费用为 <i class="d-color">【变量】</i>元，当前账户余额为<i class="d-color">【变量】</i>元，请您及时充值。</p>
            <p>二、添加模板及审核规则要求：</p>
            <p class="p1">①、模板中 <i class="d-color">【变量】</i>表示需要替换的内容，模板变量的个数不能超过8个。</p>
            <p class="p1">②、添加模板时，请控制好 <i class="d-color">【变量】</i>部分需要替换内容的长度，原则上英文、数字、字母不能超过20个字符，中文不能超过10个字符。</p>
            <p class="p1">③、提交模板时，模板内容中不能以<i class="d-color">【变量】</i>开头；除动态验证码模板外，整条模板内容中不能出现独立 <i class="d-color">【变量】</i>。</p>
            <p class="p1">④、<i class="d-color">凡是金融服务类客户提交结息提醒类模板时，应在模板尾部加上“拒收回TD退订”提醒可提高模板审核通过率。</i></p>
            <p>三、模板审核提醒：</p>
            <p class="p1">模板的审核时间为周一至周五 上午09:00～12:00，下午14:00～17:00，请合理安排模板提交申请开通时间。</p>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
export default {
	data(){
		return {
            inputValue:''
		}
	},
    filters:{
       
    },
	mixins:[storeData],
	components: {},
	created() {
        this.queryView()
	},
  	watch: {
    },
  	computed: {
       
    },
	mounted(){},
	methods:{
		queryView(){
            if(this.hasDataCache) return
            const id = this.$route.query.id
            if(id){
                this.$api.showSmsTemplate({id}).then( res => { 
                    this.inputValue = res.info.content
                }).catch(error=>{
                    console.log(error)
                })
            }
		},
        addBL(){
            let dom = this.$refs.textareaRef.$refs.textarea;
            let index  = dom.selectionStart;
            let contont = dom.value;
            let val = '【变量】'
            this.inputValue = contont.substring(0,index) + val + contont.substring(index,contont.length)
            this.$nextTick(()=>{
                dom.focus();
                dom.setSelectionRange(index + val.length,index + val.length)
            });
        },

        addTempSubmit(){
            const inputValue = this.inputValue
            if(inputValue === ''){
                this.$message.warning('请输入模板内容')
                return
            }
            const reg = /^【变量】|【变量】【变量】|【变量】$/g
            const regMatch = /【变量】/g
            const blCount = inputValue.match(regMatch) || []
            console.log(blCount,'blCount')
            if(reg.test(inputValue) || blCount.length>40){
                this.$message.warning('1、不允许【变量】开头或结尾； 2、不允许串联，如【变量】【变量】 3、不允许【变量】数超过8个 ')
                return
            }
            const id = this.$route.query.id
            if(id){
                this.$api.modifySmsTemplate({content: inputValue,id}).then( res => { 
                    this.$message.success('操作成功')
                    this.closeAndGoback()
                }).catch(error=>{
                    console.log(error)
                }) 
            }else{
                this.$api.addSmsTemplate({content: inputValue}).then( res => { 
                    this.$message.success('操作成功')
                    this.closeAndGoback()
                }).catch(error=>{
                    console.log(error)
                })
            }
        },
	}
}
</script>
<style scoped lang="scss">
   
</style>