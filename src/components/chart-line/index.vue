<template>
    <v-chart :options="options" ref="mychart" :autoresize="true" style="width:100%;height:100%;"/>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
    props:{
        barData:{
            type:Object,
            default:()=>({}),
        }, 
        
    },
	data(){
		return {
            options:{
                legend: {
                    top:10,
                    right:10
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f0f0f0'
                        }
                    },
                    axisLabel:{
                        color:'#333',
                    },
                    axisLine:{
                        lineStyle:{
                            color:'f0f0f0'
                        }
                    }
                },
                grid: {
                    left: 50,
                    right: 50,
                    top:60,
                    bottom:20,
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f0f0f0'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'f0f0f0'
                        }
                    }
                },
                tooltip:{
                    trigger: 'axis',
                    axisPointer:{
                        lineStyle:{
                            width:2,
                            color:'#bcebe4'
                        }
                    }
                    
                },
                color:['#0bdec0','#2589ee'],
                series: [{
                    name:'短信发送数',
                    data: [],
                    type: 'line',
                    symbolSize: 8,
                    lineStyle:{
                        width:1,
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#a7f7f2' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                },{
                    name:'彩信发送数',
                    data: [],
                    type: 'line',
                    symbolSize: 8,
                    lineStyle:{
                        width:1,
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#b5dbff' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }]
            },
		}
    },
    computed: {
        
    },
    components:{
    },
    filters:{
    },
  	watch: {
        barData:{
            handler(val){
               /*  this.options.xAxis[0].data = ['2022']
                this.options.series[0].data = [11]
                this.options.series[1].data = [22] */
                this.options.xAxis.data = this.barData.x
                this.options.series[0].data = this.barData.y1
                this.options.series[1].data = this.barData.y2
                this.$refs.mychart?.refresh()
            },
            deep:true,
            immediate:true
        }
    },
    created(){
        
    },
	mounted(){},
	methods:{
	}
}
</script>