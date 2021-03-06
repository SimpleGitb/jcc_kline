import { calculateMA } from './processData';

// KDJ（随机指标）数据计算
export const getKDJData = (dayCount, data) => {
    if (!data) { return; }
    var RSV = [];
    var KData = [];
    var DData = [];
    var JData = [];
    for (var i = 0; i < data.length; i++) {
        if (i < dayCount - 1) {
            RSV.push('-');
            KData.push('-');
            DData.push('-');
            JData.push('-');
        } else {
            var dayCountData = data.slice(i - dayCount + 1, i + 1);
            var lowestPriceData = [];
            var highestPriceData = [];
            for (var countData of dayCountData) {
                lowestPriceData.push(countData[2]);
                highestPriceData.push(countData[3]);
            }
            let smallToBigLowestPriceData = JSON.parse(JSON.stringify(lowestPriceData));
            smallToBigLowestPriceData = smallToBigLowestPriceData.sort(function (a, b) {
                return a - b;
            });
            let lowestPrice = smallToBigLowestPriceData[0];
            let bigToSmallHighestPriceData = JSON.parse(JSON.stringify(lowestPriceData));
            bigToSmallHighestPriceData = bigToSmallHighestPriceData.sort(function (a, b) {
                return b - a;
            });
            let highestPrice = bigToSmallHighestPriceData[0];
            let RSVData = (data[i][1] - lowestPrice) / (highestPrice - lowestPrice) * 100;
            if (isNaN(RSVData) || RSVData == Infinity) {
                RSVData = 0;
            }
            RSV.push(RSVData);
            let KBeforeData;
            if (!isNaN(KData[i - 1])) {
                KBeforeData = KData[i - 1];
            } else {
                KBeforeData = 50;
            }
            let DBeforeData;
            if (!isNaN(DData[i - 1])) {
                DBeforeData = KData[i - 1];
            } else {
                DBeforeData = 50;
            }
            KData.push(2 / 3 * KBeforeData + 1 / 3 * RSV[i]);
            DData.push(2 / 3 * DBeforeData + 1 / 3 * KData[i]);
            JData.push(3 * KData[i] - 2 * DData[i]);
        }
    }
    return {
        RSV: RSV,
        K: KData,
        D: DData,
        J: JData
    };
};

// OBV（能量潮）数据计算
export const getOBVData = (data) => {
    if (!data) { return; }
    var OBV = [];
    var OnBalanceVolume;
    for (var i = 0; i < data.length; i++) {
        if (i === 0) {
            OBV.push('-');
            OnBalanceVolume = 0;
        } else {
            let oldValues = JSON.parse(JSON.stringify(data[i - 1]));
            let values = JSON.parse(JSON.stringify(data[i]));
            if (values[2] > oldValues[2]) {
                OnBalanceVolume = OnBalanceVolume + values[6];
            } else if (values[2] < oldValues[2]) {
                OnBalanceVolume = OnBalanceVolume - values[6];
            }
            OBV.push(OnBalanceVolume);
        }
    }
    return { OBV: OBV };
};

// DMI（动向指标）数据计算
export const getDMIData = (data) => {
    if (!data) { return; }
    let datas = JSON.parse(JSON.stringify(data));
    var PDM = []; //上升动向
    var MDM = []; //下降动向
    var TR = []; //真实波动
    for (let i = 0; i < datas.length; i++) {
        let TRa;
        let TRb;
        let TRc;
        if (i === 0) {
            PDM.push(0);
            MDM.push(0);
            TRb = 0;
            TRc = 0;
        } else {
            PDM.push(datas[i][3] - datas[i - 1][3] <= 0 ? 0 : datas[i][3] - datas[i - 1][3]);
            MDM.push(datas[i - 1][2] - datas[i][2] <= 0 ? 0 : datas[i - 1][2] - datas[i][2]);
            TRb = datas[i][3] - datas[i - 1][1];
            TRc = datas[i][2] - datas[i - 1][1];
        }
        TRa = datas[i][3] - datas[i][2];
        TR.push(Math.max(Math.abs(TRa), Math.abs(TRb), Math.abs(TRc)));
    }

    var PDI = []; //上升方向指标线
    var MDI = []; //下降方向指标线
    var PDM14 = getMADataByDetailData(14, JSON.parse(JSON.stringify(PDM)));
    var MDM14 = getMADataByDetailData(14, JSON.parse(JSON.stringify(MDM)));
    var TR14 = getMADataByDetailData(14, JSON.parse(JSON.stringify(TR)));
    for (let j = 0; j < PDM.length; j++) {
        if (isNaN(PDM14[j]) || isNaN(TR14[j])) {
            PDI.push('-');
        } else {
            PDI.push((PDM14[j] / TR14[j]) * 100);
        }
        if (isNaN(MDM14[j]) || isNaN(TR14[j])) {
            MDI.push('-');
        } else {
            MDI.push((MDM14[j] / TR14[j]) * 100);
        }
    }

    var DX = []; //动向指数
    var ADX = []; //动向平均数
    for (let i = 0; i < PDI.length; i++) {
        if (isNaN(PDI[i]) || isNaN(MDI[i])) {
            DX.push('-');
        } else {
            DX.push((Math.abs(MDI[i] - PDI[i]) / (MDI[i] + PDI[i])) * 100);
        }
    }
    ADX = getMADataByDetailData(13 + 6, DX);

    var ADXR = []; //评估数值 ADXR=（当日的ADX+前6日的ADX）÷2
    for (let i = 0; i < ADX.length; i++) {
        if (i < 5 || isNaN(ADX[i]) || isNaN(ADX[i - 5])) {
            ADXR.push('-');
        } else {
            ADXR.push((ADX[i] + ADX[i - 5]) / 2);
        }
    }
    return {
        PDI: PDI,
        MDI: MDI,
        ADX: ADX,
        ADXR: ADXR
    };
};

// TRIX（三重指数平滑平均线）数据计算
export const getTRIXData = (datas) => {
    if (!datas) { return; }
    var TR = [];
    let TRa = calculateEMAByCandleData(datas, 12);
    let TRb = getEMAData(TRa, 12);
    TR = getEMAData(TRb, 12);
    var TRIX = [];
    for (let i = 0; i < TR.length; i++) {
        if (i === 0) {
            TRIX.push('-');
        } else {
            TRIX.push((TR[i] - TR[i - 1]) / TR[i - 1] * 100);
        }
    }
    var MATRIX = getMADataByDetailData(20, TRIX);
    return {
        TRIX: TRIX,
        MATRIX: MATRIX
    };
};

// RSI（相对强弱指标）数据计算
export const getRSIData = (datas, periodic) => {
    if (!datas) { return; }
    let RSI = [];
    let upsAndDowns = [];
    for (let i = 0; i < datas.length; i++) {
        if (i === 0) {
            upsAndDowns.push(0);
        } else {
            upsAndDowns.push((datas[i][1] - datas[i - 1][1]) / datas[i - 1][1]);
        }
    }
    // N日RSI =N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100

    for (let i = 0; i < upsAndDowns.length; i++) {
        if (i < periodic - 1) {
            RSI.push('-');
        } else {
            let gains = 0; //涨幅
            let gainsNumber = 0; //涨幅天数 
            let drop = 0; //跌幅
            let dropNumber = 0; //跌幅天数
            for (let j = i - periodic + 1; j < i + 1; j++) {
                if (upsAndDowns[j] >= 0) {
                    gains = gains + upsAndDowns[j];
                    gainsNumber = gainsNumber + 1;
                } else {
                    drop = drop + upsAndDowns[j];
                    dropNumber = dropNumber + 1;
                }
            }
            let gainsAverage = gains / gainsNumber;
            let dropAverage = drop / dropNumber;
            let RSIValue = (gainsAverage / (gainsAverage + Math.abs(dropAverage))) * 100;
            if (isNaN(RSIValue)) {
                RSI.push(0);
            } else {
                RSI.push(RSIValue);
            }
        }
    }
    return RSI;
};

// Boll（布林线）数据计算
export const getBollData = (datas, periodic) => {
    if (!datas) return;
    let UB = []; //上轨线
    let MB = []; //中轨线
    let LB = []; //下轨线
    let MD = []; //标准差
    let MAData = calculateMA(periodic, datas);
    MB = JSON.parse(JSON.stringify(MAData));
    for (let i = 0; i < MAData.length; i++) {
        if (isNaN(MAData[i])) {
            UB.push('-');
            LB.push('-');
            MD.push('-');
        } else {
            let MDValues = 0;
            for (let j = i - periodic + 1; j < i; j++) {
                if (isNaN(MAData[i])) {
                    MDValues = MDValues + Math.pow(datas.values[j][1], 2);
                } else {
                    MDValues = MDValues + Math.pow(datas.values[j][1] - MAData[i], 2);
                }
            }
            MD.push(Math.sqrt(MDValues / periodic));
            UB.push(MB[i] + 2 * MD[i]);
            LB.push(MB[i] - 2 * MD[i]);
        }
    }
    return {
        UB: UB,
        MB: MB,
        LB: LB
    };
};

// MTM（动量指标）数据计算
export const getMTMData = (data) => {
    if (!data) {
        return;
    }
    var MTM = [];
    var MTMTmp = '';
    for (var i = 0; i < data.length; i++) {
        if (i < 6) {
            MTM.push('-');
        } else {
            MTMTmp = data[i][1] - data[i - 6][1];
            MTM.push(MTMTmp);
        }
    }
    var MAMTM = getMADataByDetailData(10, MTM);
    return {
        MTM: MTM,
        MAMTM: MAMTM
    };
};

export const getBRARData = (data, periodic) => {
    if (!data) { return; }
    var BR = [];
    var AR = [];
    var HighMinusOpen = []; // 当日最高价 - 当日开盘价
    var OpenMinusLow = []; // 当日开盘价 - 当日最低价
    var HighMinusCY = []; // 当日最高价 - 前一日收盘价
    var CYMinusLow = []; // 前一日收盘价 - 当日最低价
    for (let i = 0; i < data.length; i++) {
        HighMinusOpen.push(data[i][3] - data[i][0]);
        OpenMinusLow.push(data[i][0] - data[i][2]);
        if (i === 0) {
            HighMinusCY.push(0);
            CYMinusLow.push(0);
        } else {
            HighMinusCY.push(data[i][3] - data[i - 1][1]);
            CYMinusLow.push(data[i - 1][1] - data[i][2]);
        }
        if (i < periodic) {
            BR.push('-');
            AR.push('-');
        } else {
            let HighMinusOpenSum = 0;
            let OpenMinusLowSum = 0;
            let HighMinusCYSum = 0;
            let CYMinusLowSum = 0;
            for (let j = i - periodic; j < i; j++) {
                HighMinusOpenSum = HighMinusOpenSum + HighMinusOpen[j];
                OpenMinusLowSum = OpenMinusLowSum + OpenMinusLow[j];
                HighMinusCYSum = HighMinusCYSum + HighMinusCY[j];
                CYMinusLowSum = CYMinusLowSum + CYMinusLow[j];
            }
            if (OpenMinusLowSum === 0) {
                AR.push(0);
            } else {
                AR.push(HighMinusOpenSum / OpenMinusLowSum * 100);
            }
            if (CYMinusLowSum === 0) {
                BR.push(0);
            } else {
                BR.push(HighMinusCYSum / CYMinusLowSum * 100);
            }
        }
    }
    return {
        AR: AR,
        BR: BR
    };
};

// EMA（指数移动平均值）数据计算
export const getEMAData = (data, periodic) => {
    var EMA = [];
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            EMA.push(data[i]);
        } else {
            EMA.push((2 * data[i] + (periodic - 1) * EMA[i - 1]) / (periodic + 1));
        }
    }
    return EMA;
};

export const getMADataByDetailData = (periodic, data) => {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
        if (i < periodic - 1) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < periodic - 1; j++) {
            let item = parseFloat(data[i - j]);
            if (isNaN(item)) {
                sum += 0;
            } else {
                sum += item;
            }
        }
        result.push((sum / periodic));
    }
    return result;
};

export const calculateEMAByCandleData = (data, periodic) => {
    var EMA = [];
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            EMA.push(data[i][1]);
        } else {
            let value = (2 * data[i][1] + (periodic - 1) * EMA[i - 1]) / (periodic + 1);
            EMA.push(value);
        }
    }
    return EMA;
};

export const getPSYData = (data) => {
    if (!data) {
        return;
    }
    var PSY = [];
    for (var i = 0; i < data.length; i++) {
        var riseDay = 0;
        if (i < 11) {
            PSY.push('-');
        } else {
            for (var j = i - 11; j <= i; j++) {
                if (data[j][2] - data[j][1] > 0) {
                    riseDay++;
                }
            }
            PSY.push(riseDay / 12 * 100);
        }
    }
    return PSY;
};

export const getROCData = (data) => {
    if (!data) {
        return;
    }
    var ROC = [];
    for (var i = 0; i < data.length; i++) {
        if (i < 12) {
            ROC.push('-');
        } else {
            var ROCTmp = (data[i][2] - data[i - 12][2]) / data[i - 12][2] * 100;
            ROC.push(ROCTmp);
        }
    }
    return ROC;
};

export const getWRData = (data) => {
    if (!data) {
        return;
    }
    var WR1 = []; // 
    var WR2 = []; // 
    for (var i = 0; i < data.length; i++) {
        if (i < 9) {
            WR1[i] = '-';
        } else {
            var HIGH1 = data[i][4];
            var LOW1 = data[i][3];
            for (var j = i; j > i - 10; j--) {
                HIGH1 = data[j][4] > HIGH1 ? data[j][4] : HIGH1;
                LOW1 = data[j][3] > LOW1 ? LOW1 : data[j][3];
            }
            WR1[i] = 100 * [HIGH1 - data[i][2]] / [HIGH1 - LOW1];
        }
        if (i < 5) {
            WR2[i] = '-';
        } else {
            var HIGH2 = data[i][4];
            var LOW2 = data[i][3];
            for (var k = i; k > i - 6; k--) {
                HIGH2 = data[k][4] > HIGH2 ? data[k][4] : HIGH2;
                LOW2 = data[k][3] > LOW2 ? LOW2 : data[k][3];
            }
            WR2[i] = 100 * [HIGH2 - data[i][2]] / [HIGH2 - LOW2];
        }
    }
    return {
        WR1: WR1,
        WR2: WR2
    };
};

export const getVRData = (data) => {
    if (!data) {
        return;
    }
    var VR = [];
    for (var i = 0; i < data.length; i++) {
        var UVS = 0;
        var DVS = 0;
        var PVS = 0;
        var temp;
        if (i < 11) {
            VR.push('-');
        } else {
            for (var j = i; j > i - 12; j--) {
                if (j === 0) {
                    temp = data[0][2] - data[0][1];
                    // up
                    if (temp > 0) {
                        UVS = UVS + data[0][6];
                    } else if (temp < 0) {
                        DVS = DVS + data[0][6];
                    } else if (temp === 0) {
                        PVS = PVS + data[0][6];
                    }
                } else {
                    temp = data[j][2] - data[j - 1][2];
                    if (temp > 0) {
                        UVS = UVS + data[j][6];
                    } else if (temp < 0) {
                        DVS = DVS + data[j][6];
                    } else if (temp === 0) {
                        PVS = PVS + data[j][6];
                    }
                }
            }
            var VRTmp = (UVS + 0.5 * PVS) / (DVS + 0.5 * PVS);
            VR.push(VRTmp);
        }
    }
    var MAVR = getMADataByDetailData(10, VR);
    return {
        VR: VR,
        MAVR: MAVR
    };
};

export const getSARData = (data) => {
    if (!data) {
        return;
    }
    let SARData = [];
    let cycle = 4; // 时间周期
    let beforeSAR = 0; // SAR(n-1) 前一周期的SAR
    let beforeTrend = 0; // 前一周期的趋势
    let AF = 0.02; // 加速因子
    let EPMax = 0; // 最大值
    let EPMin = 0; // 最小值
    let value = data.values;
    let volume = data.volumes;
    let len = value.length;
    for (let i = 0; i < len; i++) {
        let minPrice = value[i][2];
        let maxPrice = value[i][3];
        let condition1 = i + cycle > len - 1 ? len - 1 : i + cycle;
        for (let j = i; j < condition1; j++) {
            if (parseFloat(value[j][2]) < parseFloat(minPrice)) {
                minPrice = value[j][2];
            }
            if (parseFloat(value[j][3]) > parseFloat(maxPrice)) {
                maxPrice = value[j][3];
            }
        }
        if (i == 0) {
            let trend = 0;
            let condition2 = i + cycle > len - 1 ? len - 1 : i + cycle;
            for (let k = i + 1; k <= condition2; k++) {
                trend = trend + volume[k][2];
            }
            if (trend == 0) {
                if (value[i + 1][1]) {
                    if (parseFloat(value[i + 1][1]) > parseFloat(value[condition2][1])) {
                        trend = trend + 1;
                    } else {
                        trend = trend - 1;
                    }
                }
            }
            if (trend > 0) {
                //下跌趋势
                SARData.push(maxPrice);
                beforeSAR = maxPrice;
            } else {
                SARData.push(minPrice);
                beforeSAR = minPrice;
            }
            let condition3 = i + cycle > len - 1 ? len - 1 : i + cycle;
            for (let k = i; k < condition3; k++) {
                beforeTrend = beforeTrend + volume[k][2];
            }
            if (beforeTrend == 0) {
                if (parseFloat(value[i][1]) > parseFloat(value[condition3 - 1][1])) {
                    beforeTrend = beforeTrend + 1;
                } else {
                    beforeTrend = beforeTrend - 1;
                }
            }
        } else {
            // SAR(Tn)=SAR(Tn-1)+AF(Tn)*[EP(Tn-1)-SAR(Tn-1)]
            let trend = 0;
            let SAR = 0;
            let condition4 = i + cycle > len - 1 ? len - 1 : i + cycle;
            for (let k = i; k < condition4; k++) {
                trend = trend + volume[k][2];
            }
            if (trend == 0) {
                if (parseFloat(value[i][1]) > parseFloat(value[condition4 - 1][1])) {
                    trend = trend + 1;
                } else {
                    trend = trend - 1;
                }
            }
            if (trend > 0) {
                //下跌趋势
                if (beforeTrend > 0) {
                    AF = AF + 0.02;
                } else if (beforeTrend < 0 || AF > 0.2) {
                    AF = 0.02;
                }
                SAR = parseFloat(beforeSAR) + AF * (parseFloat(EPMax) - parseFloat(beforeSAR));
                if (SAR < maxPrice || SAR < EPMax) {
                    SAR = maxPrice > EPMax ? maxPrice : EPMax;
                }
            } else {
                if (beforeTrend < 0) {
                    AF = AF + 0.02;
                } else if (beforeTrend > 0 || AF > 0.2) {
                    AF = 0.02;
                }
                SAR = parseFloat(beforeSAR) + AF * (parseFloat(EPMin) - parseFloat(beforeSAR));
                if (SAR > minPrice || SAR > EPMin) {
                    SAR = EPMin > minPrice ? minPrice : EPMin;
                }
            }
            SARData.push(SAR);
            beforeSAR = SAR;
            beforeTrend = trend;
        }
        EPMin = minPrice;
        EPMax = maxPrice;
    }
    return SARData;
};

export const getDMAData = (data) => {
    if (!data) {
        return;
    }
    let MA10 = calculateMA(10, data);
    let MA50 = calculateMA(50, data);
    let DMAData = [];
    for (var i = 0; i < MA50.length; i++) {
        if (isNaN(MA50[i])) {
            DMAData.push('-');
        } else {
            DMAData.push(MA10[i] - MA50[i]);
        }
    }
    let AMAData = getMAByDMAData(10, DMAData);
    return {
        DMA: DMAData,
        AMA: AMAData
    };
};

export const getMAByDMAData = (periodic, data) => {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
        if (i < periodic - 1 || isNaN(data[i])) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < periodic - 1; j++) {
            let item = parseFloat(data[i - j]);
            if (isNaN(item)) {
                sum += 0;
            } else {
                sum += item;
            }
        }
        result.push(sum / periodic);
    }
    return result;
};
