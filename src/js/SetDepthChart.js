import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/legend';
import { getClientWidth, getLanguage, getClientHeight } from './utils';

var klineSize = {
    width: 0,
    height: 0
};

var oldDepthData;

class DepthChart {
    constructor(configs) {
        this.klineConfig = configs;
    }

    resizeECharts(DOM, isFullScreen) {
        if (this.klineConfig.platform === 'pc') {
            if (!isFullScreen) {
                let size = getClientWidth();
                let resizeContainer = () => {
                    let width;
                    let height;
                    if (DOM) {
                        if (size <= 1024) {
                            width = 1000 * 0.7;
                            height = 1000 * 0.44 * 0.8;
                        } else if (size <= 1280) {
                            width = 1203 * 0.7;
                            height = 1203 * 0.37 * 0.8;
                        } else if (size <= 1366) {
                            width = 1284 * 0.7;
                            height = 1284 * 0.44 * 0.8;
                        } else if (size <= 1440) {
                            width = 1354 * 0.7;
                            height = 1354 * 0.4 * 0.8;
                        } else if (size <= 1680) {
                            width = 1504 * 0.7;
                            height = 1504 * 0.36 * 0.8;
                        } else if (size <= 1920) {
                            width = 1804 * 0.7;
                            height = 1804 * 0.37 * 0.8;
                        } else if (size <= 2180) {
                            width = 2048 * 0.7;
                            height = 2048 * 0.37 * 0.8;
                        }
                        DOM.style.height = height + 'px';
                        DOM.style.width = width + 'px';
                        klineSize.width = width;
                        klineSize.height = height;
                    }
                };
                resizeContainer(this);
                this.depth.resize();
            } else {
                let resizeContainer = () => {
                    DOM.style.height = getClientHeight() + 'px';
                    DOM.style.width = getClientWidth() + 'px';
                    klineSize.width = getClientWidth();
                    klineSize.height = getClientHeight();
                };
                resizeContainer(this);
                this.depth.resize();
            }
            if (oldDepthData) {
                this.updateDepthOption(oldDepthData);
            }
        }
    }

    initDepthECharts(DOM) {
        this.depth = echarts.init(DOM);
        this.showLoading();
    }

    showLoading() {
        let message = getLanguage();
        this.depth.showLoading(
            {
                text: message.loading,
                color: '#fff',
                textColor: '#fff',
                maskColor: 'rgba(22, 27, 33, 0.5)',
                zlevel: 1
            }
        );
    }

    clearDepthEcharts() {
        this.depth.clear();
    }

    disposeDepthEChart() {
        if (this.depth) {
            this.depth.dispose();
        }
    }

    /* 绘制marketDepth开始 */
    setDepthOption(data) {
        oldDepthData = data;
        if (data) {
            let message = getLanguage();
            let buy = message.buy;
            let sell = message.sell;
            this.depth.hideLoading();
            let depthOption = {
                backgroundColor: '#161b21',
                animation: true,
                color: [
                    '#ee4b4b',
                    '#09e988'
                ],
                legend: [
                    {
                        show: true,
                        top: 60,
                        itemGap: 20,
                        itemWidth: 14,
                        itemHeight: 14,
                        'data': [{
                            name: buy,
                            icon: 'rect',
                            textStyle: {
                                color: '#ee4b4b',
                                fontSize: 14,
                                fontFamily: 'Microsoft YaHei'
                            }

                        }, {
                            name: sell,
                            icon: 'rect',
                            textStyle: {
                                color: '#09e988',
                                fontSize: 14,
                                fontFamily: 'Microsoft YaHei'

                            }
                        }
                        ]
                    }
                ],
                grid: this.getDepthGrid(data),
                xAxis: this.getDepthXAxis(data),
                yAxis: this.getDepthYAxis(data),
                tooltip: this.getDepthToolTip(data),
                series: this.getDepthSeries(data)
            };
            this.depth.setOption(depthOption, true);
        }
    }

    updateDepthOption(data) {
        let message = getLanguage();
        let buy = message.buy;
        let sell = message.sell;
        oldDepthData = data;
        if (this.depth.getOption()) {
            let depthOption = {
                backgroundColor: '#161b21',
                animation: true,
                color: [
                    '#ee4b4b',
                    '#09e988'
                ],
                legend: [
                    {
                        show: true,
                        top: 60,
                        itemGap: 20,
                        itemWidth: 14,
                        itemHeight: 14,
                        'data': [{
                            name: buy,
                            icon: 'rect',
                            textStyle: {
                                color: '#ee4b4b',
                                fontSize: 14,
                                fontFamily: 'Microsoft YaHei'
                            }

                        }, {
                            name: sell,
                            icon: 'rect',
                            textStyle: {
                                color: '#09e988',
                                fontSize: 14,
                                fontFamily: 'Microsoft YaHei'

                            }
                        }
                        ]
                    }
                ],
                grid: this.getDepthGrid(data),
                tooltip: this.getDepthToolTip(data),
                xAxis: this.getDepthXAxis(data),
                yAxis: this.getDepthYAxis(data),
                series: this.getDepthSeries(data)
            };
            this.depth.setOption(depthOption);
        }
    }

    getDepthGrid() {
        return [{
            top: 60,
            left: 10,
            right: 10,
            bottom: 20,
            containLabel: true
        }];
    }

    getDepthXAxis() {
        return [
            {
                type: 'category',
                gridIndex: 0,
                scale: true,
                boundaryGap: true,
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#37404b'
                    }
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisPointer: {
                    show: true
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                axisLabel: {
                    show: true,
                    color: '#b9cadd',
                    fontSize: 10
                }
            }
        ];
    }

    getDepthYAxis() {
        return [
            {
                type: 'value',
                gridIndex: 0,
                position: 'right',
                splitNumber: 6,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    onZero: false,
                    margin: 0,
                    color: '#9aa4ac',
                    fontSize: 12,
                },
                splitArea: {
                    show: false
                },
                axisPointer: {
                    show: true,
                    lineStyle: {
                        type: 'dotted'
                    }
                }
            }
        ];
    }

    getDepthToolTip() {
        let message = getLanguage();
        return {
            formatter: function (param) {
                param = param[0];
                if (param) {
                    if (param.seriesName === 'sell') {
                        return [
                            '<div style="text-align:left;">',
                            '<div style="width:6px;height:6px;background:#28b869;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
                            message.sellPrice +
                            param.data[0] +
                            '<br/>',
                            '<div style="width:6px;height:6px;background:#28b869;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
                            message.sellTotal +
                            param.data[1] +
                            '<br/>',
                            '</div>'
                        ].join('');
                    } else if (param.seriesName === 'buy') {
                        return [
                            '<div style="text-align:left;">',
                            '<div style="width:6px;height:6px;background:#ee4b4b;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
                            message.buyPrice +
                            param.data[0] +
                            '<br/>',
                            '<div style="width:6px;height:6px;background:#ee4b4b;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
                            message.buyTotal +
                            param.data[1] +
                            '<br/>',
                            '</div>'
                        ].join('');
                    }
                }
            }
        };
    }

    getDepthSeries(data) {
        let message = getLanguage();
        let buy = message.buy;
        let sell = message.sell;
        return [
            {
                name: buy,
                type: 'line',
                data: data.buyData,
                showSymbol: false,
                lineStyle: {
                    color: '#ee4b4b',
                    width: 2
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(238,75,75,0.3)'
                    }
                }
            },
            {
                name: sell,
                type: 'line',
                data: data.sellData,
                showSymbol: false,
                lineStyle: {
                    color: '#09e988',
                    width: 2
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(9,233,136,0.3)'
                    }
                }
            }
        ];
    }
}

export default DepthChart;
