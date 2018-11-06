/*
 * huangzongzhe
 * 2018.11.05
 * echarts demo
 */

// Type: line
// Offical online editor: http://echarts.baidu.com/examples/editor.html?c=area-basic
option = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        lineStyle: {
            color: 'rgba(0, 0, 0, 0)'
        },
        itemStyle: {
            color: 'rgba(0, 0, 0, 0)'
        },
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                    offset: 0,
                    color: '#D24CFF' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: '#33B1FF' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        }
    }, {
        smooth: true,
        data: [1020, 132, 901, 1934, 290, 1530, 1620],
        type: 'line',
        lineStyle: {
            color: 'rgba(0, 0, 0, 0)'
        },
        itemStyle: {
            color: 'rgba(0, 0, 0, 0)'
        },
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                    offset: 0,
                    color: 'rgba(153, 0, 204, 0.5)' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: 'rgba(0, 89, 179, 0.5)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        }
    }]
};
