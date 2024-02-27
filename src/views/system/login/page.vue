<template>
    <div class="page-login--layer" flex="dir:top main:center cross:center">
        <!-- logo -->
        <div class="page-login--logo">
            <img src="@/assets/imgs/login_logo.png" />
        </div>
        <!-- form -->
        <div class="page-login-sub">
            <div class="login_er" @mouseenter="showErVisible = true" @mouseleave="showErVisible = false"> 
                <img src="@/assets/imgs/login_er.png">
            </div>
            <div class="login_er_box" v-show="showErVisible">
                <div>
                    <img src="@/assets/imgs/login_android.jpg">
                    <p>APP安卓版(浏览器扫一扫)</p>
                </div>
                <div>
                    <img src="@/assets/imgs/login_xcx.jpg">
                    <p>小程序(微信扫一扫)</p>
                </div>
                <div>
                    <img src="@/assets/imgs/login_wechat.jpg">
                    <p>公众号(微信扫一扫)</p>
                </div>
                
            </div>
            <div class="login_tab" flex="main:justify">
                <span :class="{active:activeName == 1}" @click="tabChange(1)">集团编号登录</span>
                <span :class="{active:activeName == 2}" @click="tabChange(2)">短信验证码登录</span>
            </div>
            <div class="page-login--form">
                <el-form ref="formCompany" label-position="top" :rules="rules" :model="formCompany" size="default" v-if="activeName === 1">
                    <el-form-item prop="corpId">
                        <el-input type="text" v-model.trim="formCompany.corpId" maxlength="18" placeholder="请输入集团编号">
                            <div class="cross_ico" slot="prefix">
                                <img slot="prefix" src="@/assets/imgs/lo_01.png" />
                            </div>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="passWord" v-model.trim="formCompany.password" maxlength="20" placeholder="请输入密码" show-password>
                            <div class="cross_ico" slot="prefix">
                                <img slot="prefix" src="@/assets/imgs/lo_02.png" />
                            </div>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="imageCode">
                        <div flex>
                            <el-input v-model.trim="formCompany.imageCode" maxlength="4" placeholder="验证码" class="input-solt" flex-box="1" oninput="value=value.replace(/[^\d]/g,'')">
                                <div class="cross_ico" slot="prefix">
                                    <img slot="prefix" src="@/assets/imgs/lo_03.png" />
                                </div>
                            </el-input>
                            <img flex-box="0" :src="formCompany.identifyCode" @click="getSmsValid" class="rt_code">
                        </div>
                    </el-form-item>
                </el-form>
                
                <el-form ref="formSms" label-position="top" :rules="rules" :model="formSms" size="default" v-if="activeName === 2">
                    <el-form-item prop="mobile">
                        <el-input type="text" v-model.trim="formSms.mobile" maxlength="11" placeholder="请输入手机号码" oninput="value=value.replace(/[^\d]/g,'')">
                            <div class="cross_ico" slot="prefix">
                                <img slot="prefix" src="@/assets/imgs/lo_01.png" />
                            </div>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="imageCode">
                        <div flex>
                            <el-input v-model.trim="formSms.imageCode" maxlength="4" placeholder="验证码" class="input-solt" flex-box="1" oninput="value=value.replace(/[^\d]/g,'')">
                                <div class="cross_ico" slot="prefix">
                                    <img slot="prefix" src="@/assets/imgs/lo_03.png" />
                                </div>
                            </el-input>
                            <img flex-box="0" :src="formSms.identifyCode" @click="getSmsValid" class="rt_code">
                        </div>
                    </el-form-item>
                    <el-form-item label="" prop="smsCode">
                        <div flex>
                            <div flex-box="1">
                                <el-input v-model.trim="formSms.smsCode" maxlength="6" placeholder="短信验证码" class="input-solt" oninput="value=value.replace(/[^\d]/g,'')">
                                    <div class="cross_ico" slot="prefix">
                                        <img slot="prefix" src="@/assets/imgs/lo_03.png" />
                                    </div>
                                </el-input>
                            </div>
                            <div class="rt_val_bt" :class="{disabled:timeFlag}" type="text" flex-box="0" @click="getMobileValid">{{timeText}}</div>
                        </div>
                    </el-form-item>
                </el-form>
                <div flex="main:justify cross:center" class="vsd-mb-20" style="text-align:left">
                    <div flex-box="1">
                        <el-checkbox v-model="checkedSaft"></el-checkbox><el-button size="small" type="text" class="vsd-ml-10" @click="saftDialogVisible = true">已阅读用户隐私协议</el-button>
                    </div>
                    <div flex-box="0"><a href="javascript:;" class="m-color" @click="findPsdHandle" v-if="activeName == 1">找回密码</a></div>
                </div>
                <el-button size="default" @click="submit" type="primary" class="button-login">登录</el-button>
            </div>
        </div>
        <div class="posibot-ba">
            <div>
                <p>版权所有 ©中国移动通信集团贵州有限公司&nbsp;&nbsp;网站备案号：黔B2-20010020-102&nbsp;&nbsp;服务电话：0851-82205039 本网站支持IPv6访问和IPv4网络访问，您正在使用{{pageInfo.ipType}}访问，您当前的IP地址是{{pageInfo.ip}}</p>
                <p>温馨提醒广大用户自觉远离网络有害信息，不上传、不分享、不下载淫秽色情信息。如有发现不良信息可通过如下方式举报：电话号码10086、短信平台号码10086999、电子邮箱10086666@chinamobile.com、<a href="https://www.12377.cn/" target="_blank"><b>中央网信办-违法和不良信息举报中心。</b></a></p>
            </div>
        </div>
        <el-dialog title="集信通平台用户隐私保密协议" :visible.sync="saftDialogVisible" append-to-body width="1000px" class="custom-dialog">
            <div style="line-height:21px;text-align:justify;height:500px;overflow:auto;padding-right:10px;">
                <p>更新日期：2022年04月20日</p>
                <p>生效日期：2022年04月20日</p>

                <p style="text-indent:2em" class="param_texts">
                    <br>中国移动通信集团贵州有限公司(以下称为“本公司”或“我们”)非常重视您的个人信息和他人的个人信息保护，并会尽全力保护您的个人信息和他人的个人信息。本《隐私政策》（“协议”）适用于本公司向您提供的集信通平台服务（以下简称“服务”），请您在使用服务前，仔细阅读并了解本协议条款。同时，我们以下划线方式提示您我们所收集、处理的个人敏感信息类型。但是本协议可能无法涉及所有场景，我们将会在收集前通过更新/补充协议或通知形式，告知您特定服务或功能将会收集您的个人数据，您可以选择同意或拒绝。同时，您在集信通平台上所直接或间接接触到的敏感信息，您有保密的责任和义务，不得向其他任何第三方泄露。
                    <br>当您开启集信通平台运营管理门户web端服务应用且完成登录程序后，即表示您已阅读、充分理解并同意接受本协议的全部内容，本协议即对您产生法律约束力。如您不同意部分或全部本协议内容，请您停止使用本服务。
                    <br>本协议包含以下内容：
                    <br>一、服务声明
                    <br>二、我们的服务版本功能声明
                    <br>三、我们如何收集和使用您的个人信息
                    <br>四、我们如何使用 Cookie 和同类技术
                    <br>五、我们如何共享、转让、公开披露您的个人信息
                    <br>六、我们如何保存及保护您的个人信息
                    <br>七、您的权利和义务
                    <br>八、我们如何处理未成年人的个人信息
                    <br>九、您的个人信息如何在全球范围转移
                    <br>十、本协议如何更新
                    <br>十一、如何联系我们
                    <br> <b>一、服务声明</b>
                    <br>（一）您在访问集信通平台，登录“集信通平台运营管理门户web端”时，一旦选择“已阅读用户隐私协议”按钮，即表示为您已自愿接受协议中所有的条款和内容。
                    <br>（二）协议条款的效力范围仅限于本平台，您在平台的行为均受协议的约束。
                    <br>（三）本平台有权在未提前通知您的情况下修改本协议的条款。
                    <br>（四）本平台有权在未提前通知您的情况下修改、暂停平台部分或全部的服务，且不承担由此产生来自“您”和第三方的任何责任；如有必要，我们会以系统公告等形式在本平台上发布，我们提请您定期查阅了解有关变更、终止等信息。
                    <br>（五）本平台提供相关功能服务，您选择使用均是自愿行为，并享有平台更加完善的服务。
                    <br>（六）您使用本平台时，不得制作、复制、发布、传播危害国家安全、泄露国家机密等违法犯罪活动，发生前述行为，平台有权终止为您提供服务，您不仅要承担因您个人行为带来的法律责任法律问题，还应赔偿由此给平台造成的损失。
                    <br><b>二、我们的服务版本功能声明</b>
                    <br>我们向您提供的“集信通平台运营管理门户web端”功能包括“模板管理”、“短信管理”、“彩信管理”、“企业管理”、“统计报表”、“系统管理”等。其中，“模板管理”包括短信模板、短信模板审核日志、彩信模板、彩信模板审核日志；“短信管理”包括内容审核、已发送短信查询、短信收件箱；“彩信管理”包括待审核彩信、彩信发送任务、彩信发送明细；“企业管理”包括SA管理、计费局数据管理、企业信息管理、企业接入管理、客户经理信息管理、客户注册管理；“统计报表”包括；按区域统计短信发送量、按日统计短信发送量、按企业统计短信发送量、按模板统计短信发送量、按时段统计短信发送量、彩信发送量统计；“系统管理”包括网关管理、黑白名单用户管理、关键字管理、用户管理、企业门户操作日志、管理门户操作日志。
                    <br><b>三、我们如何收集和使用您的个人信息</b>
                    <br>个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
                    <br>本公司仅会出于本协议所述的以下目的，收集和使用您的个人信息：
                    <br>（一）为更好地为您提供服务，本公司将遵循“合法、正当、必要”原则，按照法律法规的规定和您的同意收集您的个人信息，主要业务功能包括：
                    <br>1． web端登录
                    <br>为了验证账号身份合法性，我们会收集您登录访问集信通平台运营管理门户web端所有使用的用户鉴权及登录信息，包括：账号、网络IP，获取用户登录所在城市。
                    <br>2．web端日志收集
                    <br>日志信息是指您使用我们的服务时，系统会记录您的操作日志信息，包括：登录账号、登录IP地址、操作日志详情、日志类别，这类信息是为您提供服务必须收集的基础信息。
                    <br>3．web端日志信息查询
                    <br>（1）您使用“短信管理”和“彩信管理”功能查询发送明细时，系统会记录您查询短彩信发送的日志信息，包括短信内容/彩信内容、手机号码、发送时间、接收状态。审核短彩信内容时，系统会记录您审核短彩信内容的日志信息，包括短信内容/彩信内容、所属客户、审核状态、发送方式、用户数、发送时间。这些信息是为您提供服务的目的，也是您使用集信通平台运营管理门户web端服务所接触到的敏感信息。
                    <br>（2）您使用“模板管理”、“短信管理”、“彩信管理”、“企业管理”、“统计报表”和“系统管理”功能进行查询、添加、修改、删除相关的操作行为，系统将会保存您的操作日志记录信息，包括登录账号、日志类型、操作时间、操作详情、登录IP。
                    <br>4.实名认证
                    <br>根据《互联网安全保护技术措施规定》，客户在使用我们的集信通产品或服务时所提供的实名认证资料包括客户编码 、客户名称 、企业签名 、接入省份 、接入地市、所属分公司、主端口 、子端口、端口实际使用单位 、营业执照/组织机构代码、端口实际使用单位营业执照/组织机构代码证照片、APP名称、责任人(法人)姓名 、责任人(法人)证件类型 、责任人(法人)证件号码 、责任人(法人)证件照片、经办人姓名、经办人证件类型 、经办人证件号码、经办人证件照片、授权书照片、授权开始时间、授权到期时间、短信端口服务类型、短信端口具体用途 、现场拍摄留存经办人手持证件照片、短信端口企业商接入机房位置与设备位置，我们将通过“集信通平台运营管理门户web端”进行实名认证资料合法性审批，并收集用于完善客户基础资料实名认证填报备案。
                    <br>（二）集信通平台运营管理门户web端功能使用电脑设备权限说明
                    <br>1．登录：您登录集信通平台运营管理门户web端后，要获电脑端网络IP及网络IP所属城市。
                    <br>2．本地目录访问权限：当您使用集信通平台运营管理门户web端涉及文件上传、下载保存时（如：短信发送明细、彩信发送明细、关键字维护、黑白名单用户维护涉及手机号码导入、文件上传、短彩信发送明细下载等），集信通平台运营管理门户web端需要访问您电脑端本地目录。 
                    <br>3．查看网络状态：用于提示用户当前的网络状况情况，改善用户体验。
                    <br>4．网络权限：用于通过网络访问互联网页面及网络通信。
                    <br><b>四、我们如何使用 Cookie 和同类技术</b>
                    <br>（一）Cookie
                    <br>为确保服务能够正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通常包含标识符、站点名称以及一些号码和字符。
                    <br>我们不会将 Cookie 用于本协议所述目的之外的任何用途。您可根据自己的偏好管理或删除 Cookie。
                    <br>您可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻止 Cookie 的功能。但如果您这么做，则需要在每一次访问我们产品时亲自更改用户设置。
                    <br>（二）Do Not Track（请勿追踪）
                    <br>很多网络浏览器均设有 Do Not Track 功能，该功能可向网站发布 Do Not Track 请求。目前，主要互联网标准组织尚未设立相关协议来规定网站应如何应对此类请求。但如果您的浏览器启用了 Do Not Track，那么我们的所有网站都会尊重您的选择。
                    <br><b>五、我们如何共享、转让、公开披露您的个人信息</b>
                    <br>（一）共享
                    <br>我们不会与本产品服务提供者以外的公司、组织和个人共享您的个人信息，但以下情况除外：
                    <br>1．在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
                    <br>2．在法定情形下的共享：我们可能会根据法律法规规定、诉讼争议解决需要，或按行政、司法机关依法提出的要求，对外共享您的个人信息。
                    <br>3．与关联公司间共享：为了与我们的其他产品或服务所关联，为您提供更好的服务，或保护中国移动关联公司或其他用户或公众的人身财产安全免遭侵害，您的信息可能会在中国移动关联公司内共享。我们仅会出于特定、明确而合法的且在本政策所声明的目的范围内，在中国移动关联公司之间共享您的个人信息，并且只会共享提供服务所必要的信息。对于与关联公司共享的信息，我们会要求关联公司对您的信息采取不低于本政策声明的保护措施，并且严格遵守相关法律法规与监管要求。关联公司如要改变个人信息的处理目的，将需要再次征求您的授权同意。
                    <br>（二）转让
                    <br>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                    <br>1．在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
                    <br>2．在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受此个人信息保护协议的约束，否则我们将要求该公司、组织重新向您征求授权同意。
                    <br>（三）公开披露
                   <br> 我们仅会在以下情况下，公开披露您的个人信息：
                   <br> 1．获得您明确同意后；
                   <br> 2．基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的个人信息。
                    <br>（四）您充分知晓，以下情形中我们使用个人信息无需征得您的授权同意：
                    <br>1．与国家安全、国防安全直接相关的；
                    <br>2．与公共安全、公共卫生、重大公共利益直接相关的；
                    <br>3．与犯罪侦查、起诉、审判和判决执行等直接相关的；
                    <br>4．出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                    <br>5．所收集的个人信息是个人信息主体自行向社会公众公开的；
                    <br>6．从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道、政府信息公开等渠道；
                    <br>7．根据您的要求签订合同所必需的；
                    <br>8．用于维护所提供的产品与/或服务的安全稳定运行所必需的，例如发现、处置产品与/或服务的故障；
                    <br>9．为合法的新闻报道所必需的；
                    <br>10．学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
                    <br>11．法律法规规定的其他情形。
                    <br><b>六、我们如何保存及保护您的个人信息</b>
                    <br>（一）保存期限
                    <br>我们只会在达成本协议所述目的所需的期限内保留您的个人信息，除非经过您的同意延长保留期或受到法律的允许。如果您注销账号或主动删除上述信息，我们将按照法律、法规规定的最短期限保留您的现有个人信息，在法律法规要求的最短保存期限内，我们将不再对您的个人信息进行商业化使用。当您的个人信息超出上述保存期限，我们将会对其进行匿名化处理。
                    <br>（二）存放地域
                    <br>您的个人信息均储存于中华人民共和国境内；
                    <br>（三）安全保护措施
                    <br>1．我们会以“最小化”原则收集、使用、存储和传输用户信息，并通过用户协议和隐私协议告知您相关信息的使用目的和范围。我们会严格按照《网络安全法》《全国人民代表大会常务委员会关于加强网络信息保护的决定》《电信和互联网用户个人信息保护规定》（工业和信息化部令第24号）《电话用户真实身份信息登记规定》（工业和信息化部令第25号）等法律法规的相关要求，建立信息安全保障制度，采取技术措施和其他必要措施保护您的个人信息安全。
                    <br>2．本公司将运用各种安全技术和程序建立完善的管理制度来保护您的个人信息，以免遭受未经授权的访问、使用或披露。
                    <br>（一）数据加密：用户信息、日志信息和网络传输敏感参数数据采用RSA、AES、MD5加密技术确保数据的保密性和安全性；
                    <br>（二）访问控制：对相关访问进行授权，只有通过授权的访问才能正常使用；
                    <br>（三）恶意代码防范：源代码采取加固混淆处理，防止数据遭到恶意攻击； 
                    <br>（四）安全审计：定期组织开展数据安全专项检查等安全防护与检测措施，并对员工进行数据安全的意识培养和安全能力的培训，加强员工对于保护个人信息重要性的认识。
                    <br>尽管我们保护您的个人数据，但您有责任妥善保管您的个人数据，包括但不限账户、密码等。如果发现您的账号或密码被他人非法使用或有使用异常的情况，应及时联系我们。
                    <br>3．请您理解：互联网环境并非百分之百安全，我们将尽力确保或担保您发送给我们的任何信息的安全性，但由于技术的限制及可能存在的各种恶意手段，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百安全。
                    <br>4．在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。
                    <br><b>七、您的权利和义务</b>
                    <br>（一）查询和更正您的个人信息
                    <br>1．您可以随时使用个人账户登录集信通平台运营管理门户web端，在“模板管理”中审核短信模板、查看短信模板审核日志、审核彩信模板、查看彩信模板审核日志；在“短信管理”中审核短信内容、查看短信发送明细、查看短信收件箱；在“彩信管理”中审核彩信内容、查看彩信发送任务、查看彩信发送明细；在“企业管理”中查看企业信息（包括查询、添加、修改、删除）、查看企业接入（包括查询、添加、修改、删除）、审核客户注册信息、审核客户经理注册信息；在“统计报表”中查看短信发送量报表、彩信发送量报表；在“系统管理”中查看网关信息（包括查询、添加、修改、删除）、查看黑白名单用户（包括查询、添加、修改、删除）、查看关键字（查询、添加、修改、删除）、查看用户（查询、添加、修改、删除）、查看企业门户操作日志和管理门户操作日志。
                    <br>2．在您通过用户身份验证，且更正不影响信息的客观性和准确性的情况下，您有权对错误或不完整的信息做出更正或更新。您可以自行进行更正，或通过意见反馈或联系客服等将更正申请提交给我们。
                    <br>（二）删除个人信息
                    <br>1．如果我们处理个人信息的行为违反法律法规；
                    <br>2．如果我们收集、使用您的个人信息，却未征得您的同意；
                    <br>3．如果我们处理个人信息的行为违反了与您的约定；
                    <br>4．如果您不再使用我们的产品或服务，或您注销了账号；
                    <br>5．如果我们不再为您提供产品或服务。
                    <br>当您从我们的服务中删除信息后，我们可能不会立即从备份系统中删除相应的信息，但会在备份更新时删除这些信息。
                    <br>（三）注销账号
                    <br>如您希望注销账号，您可以联系集信通平台售后服务支撑负责人（姓名：吴坤全，电话：15186997171）申请注销账户。您注销账号之后，我们将停止为您提供产品或服务，并依据您的要求，在15个工作日内完成删除您的个人信息，法律法规另有规定的除外。
                    <br>（四）您使用我们的服务时，您有义务提供真实、合法性的信息，不限于姓名、电话号码等，信息如有变更，应及时更新。
                    <br>（五）您应妥善保管账号，您获得由本公司提供的账号及密码后进行的一切活动均视为是您本人的行为和意愿，您要负全部责任。
                    <br>（六）您在使用我们提供的服务时，同意且接受我们向您提供的各类信息服务。
                    <br>（七）您在使用我们提供的服务时，您已直接或间接接触到敏感信息，您有保密的责任和义务，不得向其他任何第三方泄露。
                    <br><b>八、我们如何处理未成年人的个人信息</b>
                    <br>（一）我们非常重视对未成年人个人信息的保护。若您是14周岁以下的未成年人，在使用我们的服务前，建议您请您的监护人仔细阅读本隐私协议，并事先取得您家长或法定监护人的同意。
                    <br>（二）对于经父母或法定监护人同意而收集未成年人个人信息的情况，我们只会在受到法律允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用或公开披露此信息。
                    <br>（三）如果我们发现自己在未事先获得可证实的父母或法定监护人同意的情况下收集了未成年人的个人信息，则会设法尽快删除相关数据。
                    <br>（四）为更好的保护未成年人个人信息，我们会指定专人负责相关保护事宜，如有问题可按本隐私协议第九条所附联系方式与我们联系。
                    <br><b>九、您的个人信息如何在全球范围转移</b>
                    <br>原则上，我们在中华人民共和国境内收集和产生的个人信息，将存储在中华人民共和国境内。
                    <br><b>十、本协议如何更新</b>
                    <br>（一）我们的个人信息保护协议可能变更。原则上，我们不会削减您按照本个人信息保护协议所应享有的权利。
                    <br>（二）我们会通过集信通平台运营管理门户web端首页通告/公告的形式发布对本协议所做的任何变更。请您仔细阅读变更后的隐私保护指引内容，在该种情况下，若您继续使用我们的服务，即表示您同意接受修订后的隐私协议约束。
                    <br><b>十一、如何联系我们</b>
                    <br>如果您对本个人信息保护协议有任何疑问、意见或建议，可以随时通过拨打以下客服电话、登录集信通平台运营管理门户web端等方式与我们联系，我们会积极进行查证、处理并尽快答复。一般情况下，我们将在15天内回复
                    <br>公司名称：中国移动通信集团贵州有限公司
                    <br>通信地址：贵州省贵阳市观山湖区金诚街1号
                    <br>个人信息保护相关负责人联系方式：zhangjinxiang@gz.chinamobile.com
                    <br>联系电话：15186997171（产品支撑）/0851-82205039（技术支撑）
                    <br>温馨提醒广大用户自觉远离网络有害信息，不上传、不分享、不下载淫秽色情信息。如有发现不良信息可通过如下方式举报：电话号码10086、短信平台号码10086999、电子邮箱10086666@chinamobile.com、中央网信办-违法和不良信息举报中心。
                    感谢您了解我们的用户隐私协议！

                </p>

            </div>
        </el-dialog>
        <vsd-ico-dialog title="找回密码" icon="02" :visible.sync="findVisible" width="600px">
            <el-form ref="formFind" class="page-login--form" label-position="top" :rules="rules" :model="formFind" size="default">
                <el-form-item prop="corpId" label="集团编号">
                    <el-input type="text" v-model.trim="formFind.corpId" maxlength="20" placeholder="请输入集团编号">
                        <div class="cross_ico" slot="prefix">
                            <img slot="prefix" src="@/assets/imgs/lo_01.png" />
                        </div>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="imageCode">
                    <div flex>
                        <el-input v-model.trim="formFind.imageCode" maxlength="4" placeholder="验证码" class="input-solt" flex-box="1" oninput="value=value.replace(/[^\d]/g,'')">
                            <div class="cross_ico" slot="prefix">
                                <img slot="prefix" src="@/assets/imgs/lo_03.png" />
                            </div>
                        </el-input>
                        <img flex-box="0" :src="formFind.identifyCode" @click="getFindSmsValid" class="rt_code">
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitFindHandle" type="primary" size="small">提交</el-button>
            </div>
        </vsd-ico-dialog>
        <vsd-ico-dialog title="选择业务" icon="01" :visible.sync="choiceVisible" width="600px">
            <div flex style="text-align:center">
                <div flex-box="1">
                    <div style="height:120px" flex="cross:center main:center"><img src="@/assets/imgs/lo_04.png" /></div>
                    <el-button type="primary" @click="loginToSms()">发送短彩信</el-button>
                </div>
                <div flex-box="1">
                    <div style="height:120px" flex="cross:center main:center"><img src="@/assets/imgs/lo_05.png" /></div>
                    <el-button type="primary" @click="loginTo5G()">发送5G消息</el-button>
                </div>
            </div>
        </vsd-ico-dialog>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapActions } from "vuex";
export default {
    data() {
        return {
            resMobile:'',
            showErVisible:false,
            choiceVisible:false,
            findVisible:false,
            saftDialogVisible:false,
            checkedSaft:false,
            timeText:'获取短信验证码',
            timeFlag:false,
            activeName: 1,
            // 表单
            formCompany: {
                identifyCode:'',
                /* corpId: "85158343072",
                password: "DHJXT_idc@7171", */
                corpId: "",
                password: "",
                imageCode:''
            },
            formSms: {
                mobile:'',
                imageCode:'',
                identifyCode:'',
                smsCode:'',
            },
            formFind:{
                corpId:'',
                identifyCode:'',
                imageCode:'',
            },
            imgSrc:process.env.VUE_APP_API+'/getSmsValid',
            // 表单校验
            rules: {
                corpId: [
                    { required: true, message: "请输入集团编号", trigger: "blur",},
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur"},
                ],
                imageCode: [
	            	{ required: true, message: '验证码不能为空', trigger: 'blur' },
	          	],
                smsCode: [
	            	{ required: true, message: '短信验证码不能为空', trigger: 'blur' },
	          	],
                mobile: [
	            	{ required: true, message: '请输入手机号码', trigger: 'blur' },
	          	],
            },
            pageInfo:{
                info:'',
                ip:'',
                ipType:'',
            },
        };
    },
    
    async created() {
        await this.queryInfo();
        await this.getSmsValid();
    },
    methods: {
        ...mapActions("allstore/account", ["login","loginMobile"]),
        queryInfo(){
            return this.$api.getLoginInfo().then(res=>{
                this.pageInfo = res
            }).catch(res=>{})
        },
        tabChange(index){
            this.activeName = index
            this.getSmsValid()
        },
        submitFindHandle(){
            console.log(this.formFind,'this.formFind')
            this.$refs.formFind.validate((valid) => {
                if (valid) {
                    this.$api.resetPassword({
                        corpId: this.Encrypt(this.formFind.corpId),
                        imageCode: this.Encrypt(this.formFind.imageCode),
                    }).then(res=>{
                        this.findVisible = false
                        this.$message.success('提交成功')
                    }).catch(res=>{
                        this.getFindSmsValid()
                    })
                }
            })
        },
        findPsdHandle(){
            this.findVisible = true
            this.getFindSmsValid()
        },
        Encrypt(code){
            var key = CryptoJS.enc.Utf8.parse(this.pageInfo.info); 
            var iv  = CryptoJS.enc.Utf8.parse(this.pageInfo.info);
            var srcs = CryptoJS.enc.Utf8.parse(code);  
            var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
            return encrypted.toString();
        },
        Decrypt(word) {
            var key = CryptoJS.enc.Utf8.parse(this.pageInfo.info); 
            var iv  = CryptoJS.enc.Utf8.parse(this.pageInfo.info);
            let decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        },
        getMobileValid(){
            if(this.timeFlag) return
            if(this.formSms.mobile==='')return this.$message.warning('请输入手机号')
            if(this.formSms.imageCode==='')return this.$message.warning('请输入验证码')
            let num = 60
            this.timeText = num
            let timer = setInterval(() => {
                if(num>0){
                    num--
                    this.timeText = num
                    this.timeFlag = true
                }else{
                    clearInterval(timer)
                    this.timeText = '获取短信验证码'
                    this.timeFlag = false
                }
            }, 1000);
            this.$api.sendValidSms({
                mobile: this.Encrypt(this.formSms.mobile),
                imageCode: this.Encrypt(this.formSms.imageCode),
            }).then(res=>{}).catch(res=>{})
        },
        getSmsValid(){
            if(this.activeName === 1){
                this.formCompany.identifyCode = process.env.VUE_APP_APR+'/getImageValid?'+Date.now();
            }else{
                this.formSms.identifyCode = process.env.VUE_APP_APR+'/getImageValid?'+Date.now();
            }
        },
        getFindSmsValid(){
            this.formFind.identifyCode = process.env.VUE_APP_APR+'/getImageValid?'+Date.now();
        },
        loginToSms(){
            if(this.activeName === 1){
                this.loginTo()
            }else{
                this.loginToMobile()
            }
        },
        loginTo(){
            const sendData = {
                    corpId: this.Encrypt(this.formCompany.corpId),
                    password: this.Encrypt(this.formCompany.password),
                    imageCode: this.Encrypt(this.formCompany.imageCode),
                }
            this.login(sendData).then(res => {
                if(res.code==200){
                    this.$router.replace("/home");
                }else{
                    this.queryInfo();
                    this.$message.error(res.msg)
                }
            }).catch(err=>{
                this.getSmsValid()
                this.queryInfo();
            });
        },
        loginToMobile(){
            const sendData = {
                mobile: this.Encrypt(this.formSms.mobile),
                imageCode: this.Encrypt(this.formSms.imageCode),
                smsCode: this.Encrypt(this.formSms.smsCode),
            }
            this.loginMobile(sendData).then(res => {
                if(res.code==200){
                    this.$router.replace("/home");
                }else{
                    this.queryInfo();
                    this.$message.error(res.msg)
                }
            }).catch(err=>{
                this.getSmsValid()
                this.queryInfo();
            });
        },
        loginTo5G(){
            this.$api.ssoTo5g({mobile:this.activeName === 1 ? this.Encrypt(this.resMobile) : this.Encrypt(this.formSms.mobile)}).then(res=>{
                window.location.href = res.info
            }).catch(err=>{})
        },
        submit() {
            if(!this.checkedSaft){
                return this.$message.warning('请阅读隐私协议')
            }
            
            const formName = this.activeName === 1 ? 'formCompany' : 'formSms'
            
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.activeName === 1){
                        this.$api.checkPlatByCorpId({
                            corpId: this.Encrypt(this.formCompany.corpId),
                            password: this.Encrypt(this.formCompany.password),
                            imageCode: this.Encrypt(this.formCompany.imageCode),
                        }).then(res => {
                            this.resMobile = res.mobile || ''
                            //开通集信通，未开通5G，直接登录
                            if(res.jxt === '1' && (!res.g5 || res.g5 === '0')){
                                this.loginTo()
                            }
                            //未开通集信通，开通5G，跳转5G
                            if(res.g5 === '1' && (!res.jxt || res.jxt === '0')){
                                this.loginTo5G()
                            }
                            //开通集信通，开通5G，弹框选择
                            if(res.jxt === '1' && res.g5 === '1'){
                                this.choiceVisible = true
                            }
                        }).catch(err=>{
                            this.getSmsValid()
                            this.queryInfo();
                        });
                    }
                    if(this.activeName === 2){
                        this.$api.checkPlatByMobile({
                            mobile: this.Encrypt(this.formSms.mobile),
                            imageCode: this.Encrypt(this.formSms.imageCode),
                            smsCode: this.Encrypt(this.formSms.smsCode),
                        }).then(res => {
                            this.resMobile = res.mobile || ''
                            //开通集信通，未开通5G，直接登录
                            if(res.jxt === '1' && (!res.g5 || res.g5 === '0')){
                                this.loginToMobile()
                            }
                            //未开通集信通，开通5G，跳转5G
                            if(res.g5 === '1' && (!res.jxt || res.jxt === '0')){
                                this.loginTo5G()
                            }
                            //开通集信通，开通5G，弹框选择
                            if(res.jxt === '1' && res.g5 === '1'){
                                this.choiceVisible = true
                            }
                        }).catch(err=>{
                            this.getSmsValid()
                            this.queryInfo();
                        });
                        
                    }
                } else {
                    // 登录表单校验失败
                    return false;
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.page-login--layer{
    @extend %unable-select;
    $backgroundColor: #fff;
    background-color: $backgroundColor;
    background: url(../../../assets/imgs/login_bg.png);
    background-position:center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;
    .page-login--logo{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: #fff;
        height: 100px;
        object-fit: cover;
        overflow: hidden;
    }
    .page-login-sub{
        width: 460px;
        background: #fff;
        border: 1px solid #E1E1E1;
        padding: 20px 40px 30px;
        box-sizing: border-box;
        text-align: center;
        position: absolute;
        border-radius: 20px;
        top: 50%;
        right: 260px;
        transform: translateY(-50%);
        &:before{
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            padding: 25px;
            left: -25px;
            top: -25px;
            border-radius: 20px;
            box-shadow: 0 0 10px rgba($color: #ffffff, $alpha: 0.6);
            z-index: -1;
            overflow: hidden;
        }
        .login_er{
            position: absolute;
            right: 0;
            top: 0;
            width: 41px;
            height: 41px;
            border-radius: 0 20px 0 0;
            overflow: hidden;
            cursor: pointer;
            z-index: 5;
        }
        .login_er_box{
            position: absolute;
            display: flex;
            z-index: 4;
            left: 40px;
            top: 20px;
            bottom: 20px;
            right: 40px;
            background: #fff;
            justify-content: space-between;
            align-items: center;
        }
    }
    .button-login{
        width: 100%;
    }
    .login-tip{
        color: #999;
        font-size: 16px;
        margin-bottom: 30px;
    }
    .login-title{
        color: #4396ca;
        font-size: 28px;
        padding: 10px 0 20px 0;
    }
    .page-login--options{
        color: #0070C0;
        cursor: pointer;
    }
    .input-solt{
        .el-input-group__append{
            padding: 0;
            canvas{
                vertical-align: top;
            }
        }
    }
}
.param_texts{
    b{
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 10px;
        display: inline-block;
        text-indent: 0;
    }
}
::v-deep.page-login--form{
    .el-input__inner{
        padding-left: 40px;
    }
    .el-input__prefix{
        left: 8px;
    }
}
.cross_ico{
    height: 100%;
    display: flex;
    position: relative;
    align-items: center;
    &:after{
        height: 20px;
        width: 1px;
        background: #dcdcdc;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -8px;
        content: '';
    }
}
.rt_code{
    height:38px;
    width:100px;
    display:block;
    margin-left:20px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    overflow: hidden;
}
.rt_val_bt{
    color: #4194e1;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 20px;
    width: 100px;
    &.disabled{
        cursor: not-allowed;
    }
}
.login_tab{
    display: flex;
    border-bottom: 1px solid #a3a3a3;
    line-height: 40px;
    margin-bottom: 30px;
    span{
        font-size: 20px;
        color: #6f6f6f;
        position: relative;
        cursor: pointer;
        &.active{
            &:before{
                content: "";
                position: absolute;
                bottom: -1px;
                left: 0;
                height: 2px;
                width: 100%;
            }
        }
    }
}
@media screen and (max-width: 1000px) {
    .page-login--layer .page-login-sub{
        margin-right: -230px;
        right: 50%;
    }
}
</style>
