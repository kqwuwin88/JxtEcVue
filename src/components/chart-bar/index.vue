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
        title:{
            type:String,
            default:'短信总数',
        }, 
    },
	data(){
		return {
            options:{
                legend: {
                    bottom:10,
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: [{
                    type: 'category',
                    axisLine:{
                        lineStyle:{
                            color:'#d3d3d3'
                        },
                    },
                    axisLabel:{
                        color:'#333',
                    },
                    axisTick:{
                        show:false
                    },
                    data: []
                }],
                yAxis: [
                    {
                        type: 'value',
                        // name: '单位：万',
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'#d3d3d3'
                            },
                        },
                        axisLabel:{
                            color:'#333',
                        },
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            lineStyle:{
                                color:['#ededed']
                            }
                        },
                    }
                ],
                color:['#2589ee', '#0bdec0'],
                series: [
                    {name:this.title,type:'bar',barMaxWidth:80,data:[]},
                    {name:'成功数',type:'bar',barMaxWidth:80,data:[]},
                ]
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
        ['barData.x']:{
            handler(val){
                console.log('change',val)
                this.options.xAxis[0].data = this.barData.x
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