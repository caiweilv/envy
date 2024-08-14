import { Context, Schema,h} from 'koishi'
import { } from 'koishi-plugin-puppeteer'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { config } from 'process'
import { QQBot}  from "@satorijs/adapter-qq"

export const name = 'envy'

export interface Config {
  WeatherKey: string;
  CaiyunApp: string;
  WeatherPushSwitch: boolean;
  WeatherPushTime: string;
  WeatherPushGroup: {
      ID: string;
      P: {
        ID: string;
        Name:string;
        X: number;
        Y: number;
      }[];
      Switch: boolean;
    }[];
}

export const Config: Schema<Config> = Schema.object({
  WeatherKey : Schema.string().description('天气key'),
  CaiyunApp : Schema.string().required().description('彩云天气key'),
  WeatherPushSwitch : Schema.boolean().required().description('天气推送开关'),
  WeatherPushTime : Schema.string().description('天气推送时间'),
  WeatherPushGroup :  Schema.array((Schema.object({
      ID : Schema.string().required().description('群号'),
      P : Schema.array(Schema.object({
        ID : Schema.string().required().description('ID'),
        Name : Schema.string().required().description('人名'),
        X : Schema.number().min(-180).max(180).required().description('经度'),
        Y : Schema.number().min(-180).max(180).required().description('维度')
      })),
      Switch : Schema.boolean().required().description('群组开关'),
    })).description('天气推送群组'))
})

export function apply(ctx: Context,config:Config) {

  ctx.command('天气').option('all','-a')
    .action(async ({ options, session }, input, targetUser) => {
      if(options?.all) {


        for (let i = 0; i < config.WeatherPushGroup.length; i++) {
          if (session.channelId == config.WeatherPushGroup[i].ID) {
            if (config.WeatherPushGroup[i].Switch == true) {
              const dirname =
                __dirname?.length > 0 ? __dirname : fileURLToPath(import.meta.url)
              //   let templateHtml = readFileSync(`${dirname}/resources/precipitation.html`).toString();





            /*  let msgarr = []
              // 横轴时间
              let xarr = []
              // 图例
              let legend = []
              // 下雨
              let series = []
              // 气温
              let series2 = []
              // 空气质量
              let series3 = []
              // 风力
              let series4 = []

              for (let j = 0; j < config.WeatherPushGroup[i].P.length; j++) {
                let weather = await getWeatherList(config.WeatherPushGroup[i].P[j].X + ',' + config.WeatherPushGroup[i].P[j].Y, config.CaiyunApp, config.WeatherPushGroup[i].P[j].ID)
                let Member = session.bot.getGuildMember(config.WeatherPushGroup[i].ID,config.WeatherPushGroup[i].P[j].ID)

                let skycon = '?'

                switch (weather.result.realtime.skycon) {
                  case 'CLEAR_DAY':
                    skycon = '晴（白天）'
                    break
                  case 'CLEAR_NIGHT':
                    skycon = '晴（夜间）'
                    break
                  case 'PARTLY_CLOUDY_DAY':
                    skycon = '多云（白天）'
                    break
                  case 'PARTLY_CLOUDY_NIGHT':
                    skycon = '多云（夜间）'
                    break
                  case 'CLOUDY':
                    skycon = '阴'
                    break
                  case 'LIGHT_HAZE':
                    skycon = '轻度雾霾'
                    break
                  case 'MODERATE_HAZE':
                    skycon = '中度雾霾'
                    break
                  case 'HEAVY_HAZE':
                    skycon = '重度雾霾'
                    break
                  case 'LIGHT_RAIN':
                    skycon = '小雨'
                    break
                  case 'MODERATE_RAIN':
                    skycon = '中雨'
                    break
                  case 'HEAVY_RAIN':
                    skycon = '大雨'
                    break
                  case 'STORM_RAIN':
                    skycon = '暴雨'
                    break
                  case 'FOG':
                    skycon = '雾'
                    break
                  case 'LIGHT_SNOW':
                    skycon = '小雪'
                    break
                  case 'MODERATE_SNOW':
                    skycon = '中雪'
                    break
                  case 'HEAVY_SNOW':
                    skycon = '大雪'
                    break
                  case 'STORM_SNOW':
                    skycon = '暴雪'
                    break
                  case 'DUST':
                    skycon = '浮尘'
                    break
                  case 'SAND':
                    skycon = '沙尘'
                    break
                  case 'WIND':
                    skycon = '大风'
                    break

                  default :
                    break
                }

                let msg = '当前天气:' + skycon + '\n[' + weather.result.forecast_keypoint + ']\n' +
                  '数值温度:' + weather.result.realtime.temperature + '\n' +
                  '体感温度:' + weather.result.realtime.apparent_temperature + '\n' +
                  '相对湿度:' + Math.round(weather.result.realtime.humidity * 100) + '%\n' +
                  '云层覆盖率:' + Math.round(weather.result.realtime.cloudrate * 100) + '%\n' +
                  '降水强度:' + weather.result.realtime.precipitation.local.intensity + '\n' +
                  '能见度:' + weather.result.realtime.visibility + '\n' +
                  '向下短波辐射通量:' + weather.result.realtime.dswrf + '\n' +
                  '风速:' + weather.result.realtime.wind.speed + '\n' +
                  `空气质量:${weather.result.realtime.air_quality.aqi.usa}(${weather.result.realtime.air_quality.description.usa})\n` +
                  `紫外线强度:${weather.result.realtime.life_index.ultraviolet.index}(${weather.result.realtime.life_index.ultraviolet.desc})\n` +
                  `舒适度指数:${weather.result.realtime.life_index.comfort.index}(${weather.result.realtime.life_index.comfort.desc})\n`

                if(weather.result.alert.content.length > 0)
                {
                  for(let con of weather.result.alert.content)
                  {
                    msg = msg.concat(`${con.description})\n`)
                    if(con.code.endsWith('01'))
                    {

                    } else  if(con.code.endsWith('02'))
                    {

                    } else  if(con.code.endsWith('03'))
                    {
                      msg = msg.concat('芜湖起飞芜湖 φ(>ω<*) \n')
                    } else if (con.code.endsWith('04')) {
                      msg = msg.concat('哈哈要④咯 (*>∀<)ﾉ))★ \n')
                    }
                  }
                }
                msgarr.push(
                  {
                    apparent_temperature: weather.result.realtime.apparent_temperature,
                    message: msg,
                    nickname: this.Config.WeatherPushgroup[i].person[j].name,
                    user_id: simpleinfo.user_id
                  })

                xarr = weather.result.hourly.precipitation.map(temp => temp.datetime.substring(11, 13))

                // 下雨
                let probability = weather.result.hourly.precipitation.map(temp => temp.probability)
                series.push({
                  name: this.Config.WeatherPushgroup[i].person[j].name,
                  type: 'line',
                  data: weather.result.hourly.precipitation.map(temp => temp.value),
                  probability,
                  label: {
                    show: true, // 显示标签
                    position: 'inside', // 标签位置
                    distance: 1,
                    formatter: params => {
                      return probability[params.dataIndex]
                    },
                    fontSize: 12,
                    color: '#d3bc8e'
                  },
                  markLine: {
                    silent: true,
                    lineStyle: {
                      color: 'rgba(255,255,255,1)'
                    },
                    data: [
                      {
                        yAxis: 0.06
                      },
                      {
                        yAxis: 0.90
                      },
                      {
                        yAxis: 2.87
                      },
                      {
                        yAxis: 12.86
                      }
                    ],
                    label: {
                      formatter: params => {
                        if (params.value == 12.86) { return '暴雨／雪' }
                        if (params.value == 2.87) { return '大雨／雪' }
                        if (params.value == 0.90) { return '中雨／雪' }
                        if (params.value == 0.06) { return '小雨／雪' }
                      }
                    }
                  }
                })

                // 温度
                let temperature = weather.result.hourly.temperature.map(temp => temp.value)
                series2.push({
                  name: this.Config.WeatherPushgroup[i].person[j].name,
                  type: 'line',
                  data: weather.result.hourly.apparent_temperature.map(temp => temp.value),
                  temperature,
                  label: {
                    show: true, // 显示标签
                    position: 'insideTop', // 标签位置
                    distance: 1,
                    formatter: params => {
                      return temperature[params.dataIndex]
                    },
                    fontSize: 12,
                    color: 'rgba(255,255,255,1)'
                  }
                })

                // 空气质量与能见度
                let vis = weather.result.hourly.humidity.map(temp => temp.value)
                series3.push({
                  name: this.Config.WeatherPushgroup[i].person[j].name,
                  type: 'line',
                  data: weather.result.hourly.air_quality.aqi.map(temp => temp.value.usa),
                  vis,
                  label: {
                    show: true, // 显示标签
                    position: 'insideTop', // 标签位置
                    distance: 1,
                    formatter: params => {
                      return vis[params.dataIndex]
                    },
                    fontSize: 12,
                    color: 'rgba(255,255,255,1)'
                  },
                  markLine: {
                    silent: true,
                    lineStyle: {
                      color: 'rgba(255,255,255,1)'
                    },
                    data: [
                      {
                        yAxis: 12
                      },
                      {
                        yAxis: 35
                      },
                      {
                        yAxis: 55
                      },
                      {
                        yAxis: 150
                      },
                      {
                        yAxis: 250
                      },
                      {
                        yAxis: 550
                      }
                    ],
                    label: {
                      formatter: params => {
                        if (params.value == 12) { return '优' }
                        if (params.value == 35) { return '良' }
                        if (params.value == 55) { return '轻度污染' }
                        if (params.value == 150) { return '中度污染' }
                        if (params.value == 250) { return '重度污染' }
                        if (params.value == 500) { return '吸入它' }
                      }
                    }
                  }
                })

                // 风力与气压
                let pressure = weather.result.hourly.pressure.map(temp => Math.round(temp.value / 100) / 1000)
                series4.push({
                  name: this.Config.WeatherPushgroup[i].person[j].name,
                  type: 'line',
                  data: weather.result.hourly.wind.map(temp => temp.speed),
                  pressure,
                  label: {
                    show: true, // 显示标签
                    position: 'insideTop', // 标签位置
                    distance: 1,
                    formatter: params => {
                      return pressure[params.dataIndex]
                    },
                    fontSize: 12,
                    color: 'rgba(255,255,255,1)'
                  },
                  markLine: {
                    silent: true,
                    lineStyle: {
                      color: 'rgba(255,255,255,1)'
                    },
                    data: [
                      {
                        yAxis: 11
                      },
                      {
                        yAxis: 49
                      },
                      {
                        yAxis: 88
                      },
                      {
                        yAxis: 133
                      },
                      {
                        yAxis: 183
                      },
                      {
                        yAxis: 220
                      }
                    ],
                    label: {
                      formatter: params => {
                        if (params.value == 11) { return '清风' }
                        if (params.value == 49) { return '风力强' }
                        if (params.value == 88) { return '狂风' }
                        if (params.value == 133) { return '飓风' }
                        if (params.value == 183) { return '强台风' }
                        if (params.value == 220) { return '超强台风' }
                      }
                    }
                  }
                })
              }
              msgarr.sort(
                (a, b) => {
                  return b.apparent_temperature - a.apparent_temperature
                }
              )
              legend = msgarr.map(temp => temp.nickname)
              let e = this.e

              // 下雨
              let render = await Common.render('envyWeather/precipitation', {
                elem: '火',
                series: JSON.stringify(series),
                x: JSON.stringify(xarr),
                title: this.e.group_name + '48H降水强度与概率',
                legend: JSON.stringify(legend)
              }, { e, scale: 1.6, retType: 'base64' })
              msgarr.push({
                message: render,
                nickname: Bot.nickname,
                user_id: Bot.uin
              })

              // 体感温度与标数温度
              render = await Common.render('envyWeather/temperature', {
                elem: '火',
                series: JSON.stringify(series2),
                x: JSON.stringify(xarr),
                title: this.e.group_name + '48H体感(℃)与标数温度(℃)',
                legend: JSON.stringify(legend)
              }, { e, scale: 1.6, retType: 'base64' })
              msgarr.push({
                message: render,
                nickname: Bot.nickname,
                user_id: Bot.uin
              })

              // 空气污染与可见度
              render = await Common.render('envyWeather/aqi', {
                elem: '火',
                series: JSON.stringify(series3),
                x: JSON.stringify(xarr),
                title: this.e.group_name + '48H空气污染(AQI、μg/m³)与湿度',
                legend: JSON.stringify(legend)
              }, { e, scale: 1.6, retType: 'base64' })
              msgarr.push({
                message: render,
                nickname: Bot.nickname,
                user_id: Bot.uin
              })

              // 风力与气压
              render = await Common.render('envyWeather/wind', {
                elem: '火',
                series: JSON.stringify(series4),
                x: JSON.stringify(xarr),
                title: this.e.group_name + '48H风力(m/s)与气压(PA)',
                legend: JSON.stringify(legend)
              }, { e, scale: 1.6, retType: 'base64' })
              msgarr.push({
                message: render,
                nickname: Bot.nickname,
                user_id: Bot.uin
              })










              let templateHtml =generateWeatherHtml(dirname)

              return await ctx.puppeteer.render( templateHtml )*/
            }
            break;
          }
        }


    }
      else
      {
        //个人天气
        for (let i = 0; i < config.WeatherPushGroup.length; i++) {
          if (session.channelId == config.WeatherPushGroup[i].ID) {
            if (config.WeatherPushGroup[i].Switch == true) {
              for (let j = 0; j < config.WeatherPushGroup[i].P.length; j++) {
                if (session.userId == config.WeatherPushGroup[i].P[j].ID) {

                  let weather = await getWeatherList(config.WeatherPushGroup[i].P[j].X + ',' + config.WeatherPushGroup[i].P[j].Y, config.CaiyunApp, config.WeatherPushGroup[i].P[j].ID,ctx)

                  let skycon = '?'

                  switch (weather.result.realtime.skycon) {
                    case 'CLEAR_DAY':
                      skycon = '晴（白天）'
                      break
                    case 'CLEAR_NIGHT':
                      skycon = '晴（夜间）'
                      break
                    case 'PARTLY_CLOUDY_DAY':
                      skycon = '多云（白天）'
                      break
                    case 'PARTLY_CLOUDY_NIGHT':
                      skycon = '多云（夜间）'
                      break
                    case 'CLOUDY':
                      skycon = '阴'
                      break
                    case 'LIGHT_HAZE':
                      skycon = '轻度雾霾'
                      break
                    case 'MODERATE_HAZE':
                      skycon = '中度雾霾'
                      break
                    case 'HEAVY_HAZE':
                      skycon = '重度雾霾'
                      break
                    case 'LIGHT_RAIN':
                      skycon = '小雨'
                      break
                    case 'MODERATE_RAIN':
                      skycon = '中雨'
                      break
                    case 'HEAVY_RAIN':
                      skycon = '大雨'
                      break
                    case 'STORM_RAIN':
                      skycon = '暴雨'
                      break
                    case 'FOG':
                      skycon = '雾'
                      break
                    case 'LIGHT_SNOW':
                      skycon = '小雪'
                      break
                    case 'MODERATE_SNOW':
                      skycon = '中雪'
                      break
                    case 'HEAVY_SNOW':
                      skycon = '大雪'
                      break
                    case 'STORM_SNOW':
                      skycon = '暴雪'
                      break
                    case 'DUST':
                      skycon = '浮尘'
                      break
                    case 'SAND':
                      skycon = '沙尘'
                      break
                    case 'WIND':
                      skycon = '大风'
                      break

                    default :
                      break
                  }

                  let msg = config.WeatherPushGroup[i].P[j].Name+'\n当前天气:' + skycon + '\n[' + weather.result.forecast_keypoint + ']\n' +
                    '数值温度:' + weather.result.realtime.temperature + '\n' +
                    '体感温度:' + weather.result.realtime.apparent_temperature + '\n' +
                    '相对湿度:' + Math.round(weather.result.realtime.humidity * 100) + '%\n' +
                    '云层覆盖率:' + Math.round(weather.result.realtime.cloudrate * 100) + '%\n' +
                    '降水强度:' + weather.result.realtime.precipitation.local.intensity + '\n' +
                    '能见度:' + weather.result.realtime.visibility + '\n' +
                    '向下短波辐射通量:' + weather.result.realtime.dswrf + '\n' +
                    '风速:' + weather.result.realtime.wind.speed + '\n' +
                    `空气质量:${weather.result.realtime.air_quality.aqi.usa}(${weather.result.realtime.air_quality.description.usa})\n` +
                    `紫外线强度:${weather.result.realtime.life_index.ultraviolet.index}(${weather.result.realtime.life_index.ultraviolet.desc})\n` +
                    `舒适度指数:${weather.result.realtime.life_index.comfort.index}(${weather.result.realtime.life_index.comfort.desc})\n`

                  if(weather.result.alert.content.length > 0)
                  {
                    for(let con of weather.result.alert.content)
                    {
                      msg = msg.concat(`${con.description})\n`)
                      if(con.code.endsWith('01'))
                      {

                      } else  if(con.code.endsWith('02'))
                      {

                      } else  if(con.code.endsWith('03'))
                      {
                        msg = msg.concat('芜湖起飞芜湖 φ(>ω<*) \n')
                      } else if (con.code.endsWith('04')) {
                        msg = msg.concat('哈哈要④咯 (*>∀<)ﾉ))★ \n')
                      }
                    }
                  }
                        return msg
                }
              }
            }
            break;
          }
        }
         }
    }
      )
}

function generateWeatherHtml(dirname: string, legend: string, x: string, series: string, title: string): string {
  return `
<html>
        <head>
         <link rel="stylesheet" type="text/css" href="${dirname}/resources/temperature.css"/>
        </head>
        <body>
         <div id="container" class="profile-cont"></div>
        </body>
        <script type="text/javascript" src="${dirname}/resources/echarts.min.js"></script>
<script type="text/javascript" src="${dirname}/resources/chalk.js"></script>
<script type="text/javascript">
  var dom = document.getElementById('container');
  var myChart = echarts.init(dom, 'chalk', {
    renderer: 'canvas',
    useDirtyRect: false
  });
  var app = {};

  var option;


  option = {
    title: {
      text: ${title}
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      width: "70%",
      data: JSON.parse(${legend}),
      show:true,
      right:0,
      textStyle:
        {
          color:'rgba(255,255,255,1)'
        }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: JSON.parse(${x})
    },
    yAxis: {
      type: 'value'
    },
    series: JSON.parse(${series})
  };

  if (option && typeof option === 'object') {
    for(let ser of option.series)
    {
      ser.label.formatter=params => {
        if(ser.probability[params.dataIndex] == '0')
        {
          return ''
        }
        return ser.probability[params.dataIndex]+'%'
      }

      ser.markLine.label.formatter=params =>{
        if (params.value == 12.86) { return '暴雨／雪' }
        if (params.value == 2.87) { return '大雨／雪' }
        if (params.value == 0.90) { return '中雨／雪' }
        if (params.value == 0.06) { return '小雨／雪' }
      }
    }
    myChart.setOption(option);
  }

  window.addEventListener('resize', myChart.resize);
</script>

        </html>`;
}


async function getWeatherList(location, caiyunapp, qq, ctx: Context) {
  // const forecast = `https://devapi.qweather.com/v7/minutely/5m?location=${location}&lang=zh&key=${WeatherKey}`
  const forecast = `https://api.caiyunapp.com/v2.6/${caiyunapp}/${location}/weather?dailysteps=3&hourlysteps=48&alert=true`
  const forecastresponse = await ctx.http.get(forecast)
  return forecastresponse
}
