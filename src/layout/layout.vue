<template>
    <div class="layout-group" flex="dir:top">
        <div class="layout-header" flex-box="0" flex="cross:center main:justify">
            <div class="logo-wrap"><img :src="pageLogo" style="max-height:70px" /></div>
            <div flex="cross:center">
                <!--<a href="javascript:;" @click="dialogStyleVisible = true">切换主题{{isExpired}}</a>-->
                <a href="javascript:;" @click="dialogStyleVisible = true">切换主题风格</a>
                <el-divider direction="vertical" class="vsd-ml-20 vsd-mr-20"></el-divider>
                <span class="user-set">
                    <img class="user-img" src="@/assets/imgs/top_user.png">
                    您好，{{corpInfo.corpName || '--'}}
                </span>
                <el-divider direction="vertical" class="vsd-ml-20 vsd-mr-20"></el-divider>
                <img style="cursor:pointer" @click="psdHandle" src="@/assets/imgs/top_lock.png" title="修改密码"/>
                <img style="cursor:pointer" title="退出系统" class="vsd-ml-20" @click="cancleHandle" src="@/assets/imgs/top_cancel.png"/>
            </div>
        </div>
        <div class="layout-container" flex-box="1" flex>
            <div flex-box="0" ref="aside" class="menu-aside-wrap">
                <menu-side/>
            </div>
            <!-- 页面 -->
            <div class="container-main-right" flex="dir:top" flex-box="1">
                <div class="main-tab" flex="cross:center" flex-box="0">
                    <el-tabs v-model="tabValue" type="card" @tab-click="handleTabsClick" @tab-remove="handleTabsRemove" flex-box="1" style="overflow:hidden">
                        <el-tab-pane :key="item.fullPath" v-for="item in tabs" :label="item.meta.title" :name="item.fullPath" :closable="item.fullPath !== '/home' && tabs.length !== 1">
                            {{item.content}}
                        </el-tab-pane>
                    </el-tabs>
                    <i flex-box="0" title="关闭全部" v-if="tabs.length>1" @click="closeAll" class="el-icon-circle-close all-color-ico"></i>
                </div>
                <div class="container-main-body" flex-box="1">
                    <transition name="fade-transverse">
                        <router-view :key="routerViewKey" />
                    </transition>
                </div>
                <div flex-box="0" style="color:#272727;text-align:center;margin-bottom:10px">版权所有 @中国移动通信集团贵州有限公司 网站备案号: <span style="color:#1c61e0">黔B2-20010020-102</span> 服务电话: 0851-82205039 <span style="color:#ea1c1c;cursor:pointer" @click="showSHDF = true">扫黄打非举报</span></div>
            </div>
        </div>

        <vsd-ico-dialog :visible.sync="dialogFormVisible" width="540px" icon="02" title="修改密码" :onEscape="!isExpired" :show-close="!isExpired">
            <el-form :model="dialogForm" :rules="dialogrules" label-position="top" ref="dialogForm" autocomplete="off" size="small">
                <el-form-item label="原密码：" prop="passwordold" label-position="top">
                    <el-input  v-model.trim="dialogForm.passwordold" type="password" autocomplete="new-password" placeholder="请输入原密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="password">
                    <el-input v-model.trim="dialogForm.password" type="password" autocomplete="new-password" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="再次输入新密码：" prop="pwdSure">
                    <el-input v-model.trim="dialogForm.pwdSure" type="password" autocomplete="new-password" placeholder="请再次输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <p class="i-color">注：密码必须包括字母、数字、特殊字符（*&@#等），长度为8-14位</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDialog" size="small">确 定</el-button>
                <el-button @click="dialogFormVisible = false" v-if="!isExpired" type="primary" plain size="small">取 消</el-button>
            </div>
        </vsd-ico-dialog>
        <vsd-ico-dialog :visible.sync="dialogStyleVisible" width="630px" icon="20" title="切换风格">
            <div>选择您要设置的主题风格：</div>
            <div class="style_cg_box">
                <div class="style_cg_info">
                    <div class="style_cg_col" @click="styleChange('blue')" :class="{active:styleActive === 'blue'}"> <img src="@/assets/imgs/home_11.png"/> </div>
                    <div class="vsd-mt-10">科技蓝</div>
                </div>
                <div class="style_cg_info">
                    <div class="style_cg_col" @click="styleChange('red')" :class="{active:styleActive === 'red'}"> <img src="@/assets/imgs/home_12.png"/> </div>
                    <div class="vsd-mt-10">正气红</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setStyleSubmit" size="small">设 置</el-button>
                <el-button @click="dialogStyleVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </vsd-ico-dialog>
        <el-dialog :visible.sync="showSHDF" append-to-body width="660px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <i class="vsd-mr-5 el-icon-info m-color"/>扫黄打非举报 </div>
            <div style="font-size:14px;padding-bottom:20px;line-height:30px;">
                <p style="margin-bottom:10px">中国移动提醒您:远脂网络有害信息，不上传、不分享、不下载深秽色情信息，如果遇到包含淫秽色情内容的不良信息，您可以通过以下方式进行举报:拨打热线电话10086</p>
                <p style="margin-bottom:10px">发送短信”9“举报网址址”至号码10086999</p>
                <p style="margin-bottom:10px">发送邮件给10086666@chinamobile.com</p>
                <p>友情链接:<a href="https://www.12377.cn/" target="_blank" class="m-color">中央网信办-违法和不良信息举报中心</a></p>
            </div>
        </el-dialog>
        
        
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import menuSide from './components/menu-side'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    name: "layout-header-aside",
    components: {
        menuSide,
    },
    computed: {
        ...mapState('allstore', {
            userinfo: state => state.user.userInfo,
            corpInfo: state => state.user.corpInfo,
            isExpired: state => state.user.isExpired,
        }),
        ...mapGetters('allstore/menu', [
            'aside',
        ]),
        ...mapGetters('allstore/menu', [
            'tabs',
        ]),
        /**
         * @description 用来实现带参路由的缓存
         */
        routerViewKey () {
            // 默认情况下 key 类似 __transition-n-/foo
            // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
            return `${this.$route.fullPath}`
        },
        tabNames(){
            return this.tabs.map(item=>item.name)
        },
    },
    data () {
        var validatePass = (rule, value, callback) => {
	      	if (this.dialogForm.pwdSure !== '') {
		        this.$refs.dialogForm.validateField('pwdSure');
	      	}
	      	callback();
	    };
	    var validatePass2 = (rule, value, callback) => {
	      	if (value !== this.dialogForm.password) {
	        	callback(new Error('两次输入密码不一致!'));
	      	} else {
	        	callback();
	      	}
	    };
        var psdValid = (rule, value, callback)=>{
            var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,10}$/;
            if(!pwdReg.test(value)){
                callback(new Error('密码必须包含大小写字母及数字，且长度为8-10位!'));
            }else{
                callback();
            }
        }
        return {
            pageLogo:require('@/assets/imgs/logo_top.png'),
            styleActive:'blue',
            dialogStyleVisible:false,
            showSHDF:false,
            pageInfo:{},
            dialogFormVisible:false,
            tabValue:'',
            dialogForm:{
                passwordold: '',
		        password: '',
		        pwdSure: ''
            },
            dialogrules:{
                passwordold: [
                    {required: true, message: '请输入原密码', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {min: 8, message: '密码必须包含大小写字母及数字，且长度不低于8位!', trigger: 'blur'},
                    {validator: validatePass, trigger: 'blur'},
                    // {validator: psdValid, trigger: 'blur'},
                ],
                pwdSure: [
                    {required: true, message: '请输入确认密码', trigger: 'blur'},
                    {validator: validatePass2, trigger: 'blur'}
                ]
            },
        }
    },
    watch:{
        corpInfo:{
            handler(val){
                if(this.corpInfo.logoUrl && this.corpInfo.logoUrl != ''){
                    this.pageLogo = this.$baseUrl + this.corpInfo.logoUrl
                }else{
                    this.pageLogo = require('@/assets/imgs/logo_top.png')
                }
                
            },
            immediate:true,
            deep:true
        },
        isExpired(val){
            console.log(val,'val')
            if(val){
                this.$nextTick(()=>{
                    this.dialogFormVisible = true
                })
            }
        },
        userinfo:{
            handler(val){
                if(this.userinfo.webStyle){
                    this.styleActive = this.userinfo.webStyle === 0 ? 'blue' : 'red'
                    this.setTheme(this.styleActive)
                }
                if(this.userinfo.webUrl){
                    this.setBaseUrl(this.userinfo.webUrl)
                    if(this.corpInfo.logoUrl){
                        this.pageLogo = this.$baseUrl + this.corpInfo.logoUrl
                    }
                }
            },
            immediate:true,
            deep:true
        },
        '$route':{
            immediate:true,
            handler(to,form){
                this.tabValue = to.fullPath
            }
        }
    },
    mounted(){
        this.queryInfo()
    },
    methods:{
        ...mapActions("allstore/account", ["logout"]),
        ...mapMutations("allstore/menu", ["tabRemove",'tabCloseAll','tabReset','tabCloseWithoutHome']),
        ...mapActions("allstore/user", ["setTheme"]),
        handleTabsClick(tab){
            this.$router.push(tab.name)
        },
        setStyleSubmit(){
            const webStyle  = this.styleActive === 'blue' ? 0 : 1
            this.$api.modifySkin({webStyle}).then(res=>{
                this.$message.success('切换成功')
                this.setTheme(this.styleActive)
                this.dialogStyleVisible = false
            })
        },
        styleChange(index){
            this.styleActive = index
        },
        closeAll(){
            if(this.$route.name === 'home'){
                this.tabCloseWithoutHome()
            }else{
                this.tabCloseAll()
                this.$nextTick(()=>{
                    this.$router.push('/home')
                })
            }
            
        },
        handleTabsRemove(name){
            const index = this.tabs.findIndex(item=>item.fullPath === name)
            if(index > -1){
                this.tabRemove(index)
                if(index > 0){
                    this.$router.push(this.tabs[index-1].fullPath)
                }else{
                    this.$router.push(this.tabs[0].fullPath)
                }
            }else{
                this.$router.push(this.tabs[0].fullPath)
            }
        },
        
        Encrypt(code){
            var key = CryptoJS.enc.Utf8.parse(this.pageInfo.info); 
            var iv  = CryptoJS.enc.Utf8.parse(this.pageInfo.info);
            var srcs = CryptoJS.enc.Utf8.parse(code);  
            var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
            return encrypted.toString();
        },
        submitDialog(){
            this.$refs.dialogForm.validate((valid) => {
                if(valid){
                    this.$api.modifyPwd({passwordOld:this.Encrypt(this.dialogForm.passwordold),password:this.Encrypt(this.dialogForm.password)}).then(res=>{
                        this.$message.success('修改成功')
                        this.dialogFormVisible = false
                    }).catch(err=>{})
                }else{
                    // this.$message.error("表单校验失败，请检查");
                    return false
                }
            })
        },
        cancleHandle(){
            this.logout({
                confirm: true
            });
        },
        queryInfo(){
            this.$api.getLoginInfo().then(res=>{
                this.pageInfo = res
            }).catch(res=>{})
        },
        psdHandle(){
            this.dialogFormVisible = true
            //刷新清空修改密码框属性值
            if(this.$refs.dialogForm){
                this.$refs.dialogForm.resetFields()
            }
              
        }
    }
};
</script>
<style lang="scss">
@import '~@/assets/style/theme/register.scss';
</style>
