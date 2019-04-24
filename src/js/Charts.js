import DepthChart from './SetDepthChart';
import { depthOption, mobileDepthOption } from './DepthOption';
import { timeSharingOption, mobileTimeSharingOption} from './TimeSharingOption';
import { volumeOption, volumeMoobileOption } from './VolumeChartOption';
import TimeSharingChart from './SetTimeSharingChart';
import VolumeChart from './SetVolumeChart.js';
import { macdOption, macdMobileOption } from './MACDOption';
import MACDChart from './SetMACDChart.js';

class ChartController {
    constructor(chartsConfig) {
        var merge = require('lodash.merge');
        if (chartsConfig.chartType === 'depth') {
            if (chartsConfig.platform === 'pc') {
                merge(depthOption, chartsConfig);
                this.setDepthChart = new DepthChart(depthOption);
            } else {
                merge(mobileDepthOption, chartsConfig);
                this.setDepthChart = new DepthChart(mobileDepthOption);
            }
        } else if (chartsConfig.chartType === 'timeSharing') {
            if (chartsConfig.platform === 'pc') {
                merge(timeSharingOption, chartsConfig);
                this.setTimeSharing = new TimeSharingChart(timeSharingOption);
            } else {
                merge(mobileTimeSharingOption, chartsConfig);
                this.setTimeSharing = new TimeSharingChart(mobileTimeSharingOption);
            }
        } else if (chartsConfig.chartType === 'volume') {
            if (chartsConfig.platform === 'pc') {
                merge(volumeOption, chartsConfig);
                this.setVolumeChart = new VolumeChart(volumeOption);
            } else {
                merge(volumeMoobileOption, chartsConfig);
                this.setVolumeChart = new VolumeChart(volumeMoobileOption);
            }
        } else if (chartsConfig.chartType === 'MACD') {
            if (chartsConfig.platform === 'mobile') {
                merge(macdMobileOption, chartsConfig);
                this.setMACDChart = new MACDChart(macdMobileOption);
            } else {
                merge(macdOption, chartsConfig);
                this.setMACDChart = new MACDChart(macdOption);
            }
        }
    }
    /* 绘制深度图 */
    initDepth(DOM, clear) {
        this.setDepthChart.initDepthECharts(DOM, clear);
    }

    resizeDepthChart(DOM, isFullScreen, size) {
        this.setDepthChart.resizeECharts(DOM, isFullScreen, size);
    }

    setDepthOption(data) {
        this.setDepthChart.setDepthOption(data);
    }

    updateDepthOption(data) {
        this.setDepthChart.updateDepthOption(data);
    }

    getMobileTipsData() {
        return this.setDepthChart.getMobileTipsData();
    }

    disposeDepthEChart() {
        this.setDepthChart.disposeDepthEChart();
    }

    /* 绘制分时图 */

    initTimeSharingChart(DOM, clear) {
        this.setTimeSharing.initTimeSharingECharts(DOM, clear);
    }

    resizeTimeSharingChart(DOM, isFullScreen, size) {
        this.setTimeSharing.resizeECharts(DOM, isFullScreen, size);
    }

    setTimeSharingOption(divisionData) {
        return this.setTimeSharing.setTimeSharingOption(divisionData);
    }

    updateTimeSharingOption(divisionData) {
        this.setTimeSharing.updateTimeSharingOption(divisionData);
    }

    getTimeSharingTipIndex() {
        return this.setTimeSharing.getTimeSharingTipIndex();
    }

    disposeTimeSharingEChart() {
        this.setTimeSharing.disposeTimeSharingEChart();
    }

    /* 绘制交易量柱状图 */

    initVolumeChart(DOM, clear, type) {
        this.setVolumeChart.initVolumeECharts(DOM, clear, type);
    }

    resizeVolumeChart(DOM, isFullScreen, isCloseIndicator, size) {
        this.setVolumeChart.resizeECharts(DOM, isFullScreen, isCloseIndicator, size);
    }

    setVolumeOption(data, cycle) {
        this.setVolumeChart.setVolumeOption(data, cycle);
    }

    getToolTipIndex() {
        return this.setVolumeChart.getToolTipIndex();
    }

    updateVolumeOption(data, cycle) {
        this.setVolumeChart.updateVolumeOption(data, cycle);
    }

    disposeVolumeEcharts() {
        this.setVolumeChart.disposeVolumeEChart();
    }

    changeDataZoom(type) {
        this.setVolumeChart.changeDataZoom(type);
    }

    /* 绘制MACD指标 */
    initMACDECharts(DOM, clear, type) {
        this.setMACDChart.initMACD(DOM, clear, type);
    }

    resizeMACDChart(DOM, isFullScreen, size) {
        this.setMACDChart.resizeECharts(DOM, isFullScreen, size);
    }

    setMACDOption(data) {
        this.setMACDChart.setMACDOption(data);
    }

    updateMACDOption(data) {
        this.setMACDChart.updateMACDOption(data);
    }

    disposeMACDEChart() {
        this.setMACDChart.disposeMACDEChart();
    }

    getMacdTipData() {
        return this.setMACDChart.getToolTipData();
    }

    changeMacdDataZoom(type) {
        this.setMACDChart.changeDataZoom(type);
    }

}

export default ChartController;
