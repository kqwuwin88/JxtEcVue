export default ({ post,get,put,del }) => ({
    getLoginInfo: (  ) => post('/toLogin',{}),    //登录
    loginExec: ( queryForm ) => post('/loginExec',queryForm),    //登录
    getMenu: ( queryForm ) => post('/getMenu',queryForm),    //登录
    loginOut: ( queryForm ) => post('/loginOut',queryForm),    //登录
    getSmsValid: ( queryForm ) => post('/getImageValid',queryForm),    //验证码
    sendValidSms: ( queryForm ) => post('/sendValidSms',queryForm),    //验证码
    checkPlatByCorpId: ( queryForm ) => post('/checkPlatByCorpId',queryForm),    //校验接口
    modifyPwd: ( queryForm ) => post('/modifyPwd',queryForm),    //修改密码
    ssoTo5g: ( queryForm ) => post('/ssoTo5g',queryForm),    //
    loginByMobile: ( queryForm ) => post('/loginByMobile',queryForm),    //
    modifyCorpExtendNoticeNum: ( queryForm={} ) => post('/modifyCorpExtendNoticeNum',queryForm),    //
    checkPlatByMobile: ( queryForm={} ) => post('/checkPlatByMobile',queryForm),    //
    resetPassword: ( queryForm={} ) => post('/resetPassword',queryForm),    //
    
    smsTemplateList: ( queryForm ) => post('/smsTemplateList',queryForm),    //
    addSmsTemplate: ( queryForm ) => post('/addSmsTemplate',queryForm),    //
    modifySmsTemplate: ( queryForm ) => post('/modifySmsTemplate',queryForm),    //
    showSmsTemplate: ( queryForm ) => post('/showSmsTemplate',queryForm),    //
    deleteSmsTemplate: ( queryForm ) => post('/deleteSmsTemplate',queryForm),    //
    mmsTemplateList: ( queryForm ) => post('/mmsTemplateList',queryForm),    //
    addMmsTemplate: ( queryForm ) => post('/addMmsTemplate',queryForm),    //
    modifyMmsTemplate: ( queryForm ) => post('/modifyMmsTemplate',queryForm),    //
    toModifyMmsTemplate: ( queryForm ) => post('/toModifyMmsTemplate',queryForm),    //
    mmsClassList: ( queryForm={} ) => post('/mmsClassList',queryForm),    //
    deleteMmsTemplate: ( queryForm ) => post('/deleteMmsTemplate',queryForm),    //
    addMmsClass: ( queryForm ) => post('/addMmsClass',queryForm),    //
    getMmsClass: ( queryForm ) => post('/getMmsClass',queryForm),    //
    modifyMmsClass: ( queryForm ) => post('/modifyMmsClass',queryForm),    //
    deleteMmsClass: ( queryForm ) => post('/deleteMmsClass',queryForm),    //
    getGroupList: ( queryForm ) => post('/getGroupList',queryForm),    //
    addGroup: ( queryForm ) => post('/addGroup',queryForm),    //
    modifyGroup: ( queryForm ) => post('/modifyGroup',queryForm),    //
    delGroup: ( queryForm ) => post('/delGroup',queryForm),    //
    getTxlList: ( queryForm ) => post('/getTxlList',queryForm),    //
    queryTxl: ( queryForm ) => post('/queryTxl',queryForm),    //
    addTxl: ( queryForm ) => post('/addTxl',queryForm),    //
    getTxl: ( queryForm ) => post('/getTxl',queryForm),    //
    modifyTxl: ( queryForm ) => post('/modifyTxl',queryForm),    //
    delTxl: ( queryForm ) => post('/delTxl',queryForm),    //
    getTxlNumByGroupId: ( queryForm ) => post('/getTxlNumByGroupId',queryForm),    //
    importTxl: ( queryForm ) => post('/importTxl',queryForm),    //
    exportTxl: ( queryForm ) => post('/exportTxl',queryForm),    //
    exportTxl: ( queryForm ) => post('/exportTxl',queryForm),    //
    getCorpInfo: ( queryForm ) => post('/getCorpInfo',queryForm),    //
    modifyLogo: ( queryForm ) => post('/modifyLogo',queryForm),    //
    resetLogo: ( queryForm ) => post('/resetLogo',queryForm),    //
    modifyBirthdayNotice: ( queryForm ) => post('/modifyBirthdayNotice',queryForm),    //
    userList: ( queryForm ) => post('/userList',queryForm),    //
    addUser: ( queryForm ) => post('/addUser',queryForm),    //
    getUserInfo: ( queryForm ) => post('/getUserInfo',queryForm),    //
    modifyUser: ( queryForm ) => post('/modifyUser',queryForm),    //
    deleteUser: ( queryForm ) => post('/deleteUser',queryForm),    //
    childCorpList: ( queryForm ) => post('/childCorpList',queryForm),    //
    childCorpRegistList: ( queryForm ) => post('/childCorpRegistList',queryForm),    //
    addCorpRegist: ( queryForm ) => post('/addCorpRegist',queryForm),    //
    uploadChildCorpFile: ( queryForm ) => post('/uploadChildCorpFile',queryForm),    //
    getCorpRegist: ( queryForm ) => post('/getCorpRegist',queryForm),    //
    modifyCorpRegist: ( queryForm ) => post('/modifyCorpRegist',queryForm),    //
    deleteCorpRegist: ( queryForm ) => post('/deleteCorpRegist',queryForm),    //
    statistOfDate: ( queryForm ) => post('/statistOfDate',queryForm),    //
    statistOfTemplate: ( queryForm ) => post('/statistOfTemplate',queryForm),    //
    statistOfHour: ( queryForm ) => post('/statistOfHour',queryForm),    //
    statistMmsOfDate: ( queryForm ) => post('/statistMmsOfDate',queryForm),    //
    statistPlaceOfDate: ( queryForm ) => post('/statistPlaceOfDate',queryForm),    //
    logList: ( queryForm ) => post('/logList',queryForm),    //

    toSendSms: ( queryForm ) => post('/toSendSms',queryForm),    //
    sendSms: ( queryForm ) => post('/sendSms',queryForm),    //
    importMsisdn: ( queryForm ) => post('/importMsisdn',queryForm),    //
    uploadFormatFile: ( queryForm ) => post('/uploadFormatFile',queryForm),    //
    sendSmsFormat: ( queryForm ) => post('/sendSmsFormat',queryForm),    //
    smsCheckList: ( queryForm ) => post('/smsCheckList',queryForm),    //
    deleteSmsJob: ( queryForm ) => post('/deleteSmsJob',queryForm),    //
    smsJobList: ( queryForm ) => post('/smsJobList',queryForm),    //
    placeMsgList: ( queryForm ) => post('/placeMsgList',queryForm),    //
    smsSendList: ( queryForm ) => post('/smsSendList',queryForm),    //
    showErrorCode: ( queryForm ) => post('/showErrorCode',queryForm),    //
    smsSourceList: ( queryForm ) => post('/smsSourceList',queryForm),    //
    smsReceiveList: ( queryForm ) => post('/smsReceiveList',queryForm),    //
    getActiveMsg: ( queryForm ) => post('/getActiveMsg',queryForm),    //
    sendActiveMsg: ( queryForm ) => post('/sendActiveMsg',queryForm),    //

    questionList: ( queryForm ) => post('/questionList',queryForm),    //
    questionRecordList: ( queryForm ) => post('/questionRecordList',queryForm),    //
    toAddQuestion: ( queryForm ) => post('/toAddQuestion',queryForm),    //
    addQuestion: ( queryForm ) => post('/addQuestion',queryForm),    //
    getQuestion: ( queryForm ) => post('/getQuestion',queryForm),    //
    deleteQuestion: ( queryForm ) => post('/deleteQuestion',queryForm),    //
    noticeList: ( queryForm ) => post('/noticeList',queryForm),    //
    addNotice: ( queryForm ) => post('/addNotice',queryForm),    //
    getNotice: ( queryForm ) => post('/getNotice',queryForm),    //
    modifyNotice: ( queryForm ) => post('/modifyNotice',queryForm),    //
    deleteNotice: ( queryForm ) => post('/deleteNotice',queryForm),    //
    toAddNotice: ( queryForm ) => post('/toAddNotice',queryForm),    //
    
    addDraft: ( queryForm ) => post('/addDraft',queryForm),    //
    testMms: ( queryForm ) => post('/testMms',queryForm),    //
    sendMms: ( queryForm ) => post('/sendMms',queryForm),    //
    mmsDraftList: ( queryForm ) => post('/mmsDraftList',queryForm),    //
    getMmsDraft: ( queryForm ) => post('/getMmsDraft',queryForm),    //
    sendMmsDraft: ( queryForm ) => post('/sendMmsDraft',queryForm),    //
    deleteMmsDraft: ( queryForm ) => post('/deleteMmsDraft',queryForm),    //
    mmsCheckList: ( queryForm ) => post('/mmsCheckList',queryForm),    //
    deleteMmsCheck: ( queryForm ) => post('/deleteMmsCheck',queryForm),    //
    mmsSendList: ( queryForm ) => post('/mmsSendList',queryForm),    //
    previewMms: ( queryForm ) => post('/previewMms',queryForm),    //
    indexView: ( queryForm ) => post('/indexView',queryForm),    //
    modifySkin: ( queryForm ) => post('/modifySkin',queryForm),    //
    uploadCorpExtend: ( queryForm ) => post('/uploadCorpExtend',queryForm),    //
    updateCorpExtend: ( queryForm ) => post('/updateCorpExtend',queryForm),    //
    

    addImage: ( queryForm ) => post('/addImage',queryForm),    //
    addVideo: ( queryForm ) => post('/addVideo',queryForm),    //
    addAudio: ( queryForm ) => post('/addAudio',queryForm),    //
    
})
