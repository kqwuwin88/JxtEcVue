// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

const routes = [
    {
        path: '/menu1',
        meta:{ ...meta, title: '模板管理', isMenu:true, icon: '02' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/smstemplete',
                meta:{ ...meta, title: '短信模板', isMenu:true,right:"1001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/templete/smstemplete/list.vue'), meta: { ...meta, title: '短信模板' } },
                    { path: 'add', name: `${pre}add`, component: _import('pages/templete/smstemplete/edit.vue'), meta: { ...meta, title: '新增短信模板' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/templete/smstemplete/edit.vue'), meta: { ...meta, title: '修改短信模板' } },
                ])('pages-smstemplete-')
            },
            {
                path: '/mmstemplete',
                meta:{ ...meta, title: '彩信模板', isMenu:true,right:"1003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/templete/mmstemplete/list.vue'), meta: { ...meta, title: '彩信模板' } },
                    { path: 'add', name: `${pre}add`, component: _import('pages/templete/mmstemplete/edit.vue'), meta: { ...meta, title: '新增彩信模板' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/templete/mmstemplete/edit.vue'), meta: { ...meta, title: '修改彩信模板' } },
                ])('pages-mmstemplete-')
            },
            {
                path: '/classes',
                meta:{ ...meta, title: '模板类别管理', isMenu:true,right:"1003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/templete/classes/list.vue'), meta: { ...meta, title: '模板类别管理' } },
                ])('pages-classes-')
            },
        ]
    },
    {
        path: '/menu2',
        meta:{ ...meta, title: '短信管理', isMenu:true, icon: '03' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/normalSms',
                meta:{ ...meta, title: '发送普通短信', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/normalSms/index.vue'), meta: { ...meta, title: '发送普通短信' } },
                ])('pages-normalSms-')
            },
            {
                path: '/tempeteSend',
                meta:{ ...meta, title: '发送模板短信', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/tempeteSend/index.vue'), meta: { ...meta, title: '发送模板短信' } },
                ])('pages-tempeteSend-')
            },
           /*  {
                path: '/positionSms',
                meta:{ ...meta, title: '发送位置短信', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/positionSms/index.vue'), meta: { ...meta, title: '发送位置短信' } },
                ])('pages-positionSms-')
            }, */
            {
                path: '/smsNosend',
                meta:{ ...meta, title: '待发送短信任务查询', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsNosend/list.vue'), meta: { ...meta, title: '待发送短信任务查询' } },
                ])('pages-smsNosend-')
            },
            {
                path: '/smsSendOver',
                meta:{ ...meta, title: '已发送短信任务查询', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsSendOver/list.vue'), meta: { ...meta, title: '已发送短信任务查询' } },
                ])('pages-smsSendOver-')
            },
            {
                path: '/smsPositionTsk',
                meta:{ ...meta, title: '位置短信任务查询', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsPositionTsk/list.vue'), meta: { ...meta, title: '位置短信任务查询' } },
                ])('pages-smsPositionTsk-')
            },
            {
                path: '/smsSendedDetail',
                meta:{ ...meta, title: '已发送短信明细', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsSendedDetail/list.vue'), meta: { ...meta, title: '已发送短信明细' } },
                ])('pages-smsSendedDetail-')
            },
            {
                path: '/smsRecieveBox',
                meta:{ ...meta, title: '短信收件箱', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsRecieveBox/list.vue'), meta: { ...meta, title: '短信收件箱' } },
                ])('pages-smsRecieveBox-')
            },
            {
                path: '/smsQuestionnaire',
                meta:{ ...meta, title: '短信问卷', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsQuestionnaire/list.vue'), meta: { ...meta, title: '短信问卷' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/sms/smsQuestionnaire/edit.vue'), meta: { ...meta, title: '创建问卷' } },
                    { path: 'view', name: `${pre}view`, component: _import('pages/sms/smsQuestionnaire/view.vue'), meta: { ...meta, title: '查看问卷' } },
                ])('pages-smsQuestionnaire-')
            },
            {
                path: '/smsSchedule',
                meta:{ ...meta, title: '日程提醒', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/sms/smsSchedule/list.vue'), meta: { ...meta, title: '日程提醒' } },
                    { path: 'add', name: `${pre}add`, component: _import('pages/sms/smsSchedule/edit.vue'), meta: { ...meta, title: '创建日程提醒' } },
                { path: 'edit', name: `${pre}edit`, component: _import('pages/sms/smsSchedule/edit.vue'), meta: { ...meta, title: '修改日程提醒' } },
                ])('pages-smsSchedule-')
            },
        ]
    },
    {
        path: '/menu3',
        meta:{ ...meta, title: '彩信管理', isMenu:true, icon: '04' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/mmsSendOver',
                meta:{ ...meta, title: '发送彩信', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}index`, component: _import('pages/mms/mmsSendOver/index.vue'), meta: { ...meta, title: '发送彩信' } },
                ])('pages-mmsSendOver-')
            },
            {
                path: '/mmsNoSend',
                meta:{ ...meta, title: '待发送彩信查询', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/mms/mmsNoSend/list.vue'), meta: { ...meta, title: '待发送彩信查询' } },
                ])('pages-mmsNoSend-')
            },
            {
                path: '/mmsSendOrder',
                meta:{ ...meta, title: '彩信发送明细', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/mms/mmsSendOrder/list.vue'), meta: { ...meta, title: '彩信发送明细' } },
                ])('pages-mmsSendOrder-')
            },
            {
                path: '/mmsDraft',
                meta:{ ...meta, title: '彩信草稿箱', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/mms/mmsDraft/list.vue'), meta: { ...meta, title: '彩信草稿箱' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/mms/mmsDraft/edit.vue'), meta: { ...meta, title: '修改彩信草稿箱' } },
                ])('pages-mmsDraft-')
            },
        ]
    },
    {
        path: '/menu4',
        meta:{ ...meta, title: '企业管理', isMenu:true, icon: '05' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/mail',
                meta:{ ...meta, title: '企业联系人', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/enterprise/mail/list.vue'), meta: { ...meta, title: '企业联系人' } },
                ])('pages-mail-')
            },
            {
                path: '/info',
                meta:{ ...meta, title: '企业信息', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/enterprise/info/index.vue'), meta: { ...meta, title: '企业信息' } },
                ])('pages-info-')
            },
            {
                path: '/account',
                meta:{ ...meta, title: '企业用户', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/enterprise/account/list.vue'), meta: { ...meta, title: '企业用户' } },
                ])('pages-account-')
            },
            {
                path: '/accountSub',
                meta:{ ...meta, title: '子账号管理', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/enterprise/accountSub/list.vue'), meta: { ...meta, title: '子账号管理' } },
                ])('pages-accountSub-')
            },
            {
                path: '/subRegiest',
                meta:{ ...meta, title: '子账号申请', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/enterprise/subRegiest/list.vue'), meta: { ...meta, title: '子账号申请' } },
                    { path: 'add', name: `${pre}add`, component: _import('pages/enterprise/subRegiest/edit.vue'), meta: { ...meta, title: '申请子账号' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/enterprise/subRegiest/edit.vue'), meta: { ...meta, title: '修改子账号' } },
                ])('pages-subRegiest-')
            },
        ]
    },
    {
        path: '/menu5',
        meta:{ ...meta, title: '报表管理', isMenu:true, icon: '06' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/statday',
                meta:{ ...meta, title: '短信发送量统计【按日期】', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/statday/list.vue'), meta: { ...meta, title: '短信发送量统计【按日期】' } },
                ])('pages-statday-')
            },
            {
                path: '/stattemplate',
                meta:{ ...meta, title: '短信发送量统计【按模板】', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/stattemplate/list.vue'), meta: { ...meta, title: '短信发送量统计【按模板】' } },
                ])('pages-stattemplate-')
            },
            {
                path: '/statrange',
                meta:{ ...meta, title: '短信发送量统计【按时段】', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/statrange/list.vue'), meta: { ...meta, title: '短信发送量统计【按时段】' } },
                ])('pages-statrange-')
            },
            {
                path: '/statpos',
                meta:{ ...meta, title: '位置短信发送量统计', isMenu:true},
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statpos/list.vue'), meta: { ...meta, title: '位置短信发送量统计' } },
                ])('pages-statpos-')
            },
            {
                path: '/statmms',
                meta:{ ...meta, title: '彩信发送量统计', isMenu:true },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/statmms/list.vue'), meta: { ...meta, title: '彩信发送量统计' } },
                ])('pages-statmms-')
            },
        ]
    },
    {
        path: '/menu7',
        meta:{ ...meta, title: '系统设置', isMenu:true, icon: '06' },
        component: { render: h => h('router-view') },
        children: [
            
            {
                path: '/adminlog',
                meta:{ ...meta, title: '操作日志', isMenu:true,right:"7010" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/adminlog/list.vue'), meta: { ...meta, title: '操作日志' } },
                ])('pages-adminlog-')
            },
        ]
    },
]

export default routes
