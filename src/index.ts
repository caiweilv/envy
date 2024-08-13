import { Context, Schema } from 'koishi'
import { } from 'koishi-plugin-puppeteer'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { config } from 'process'

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
    .action(async ({ options, session }, input) => {
      if(options?.all) {
      for (let i = 0; i < config.WeatherPushGroup.length; i++) {
        if (session.channelId == config.WeatherPushGroup[i].ID) {
          if (config.WeatherPushGroup[i].Switch == true) {
            for (let j = 0; j < config.WeatherPushGroup[i].P.length; j++) {
              if (session.userId == config.WeatherPushGroup[i].P[j].ID) {
                session.send(`你被${config.WeatherPushGroup[i].P[j].Name}发现了`)
              }
            }
          }
          break;
        }
      }


      const dirname =
        __dirname?.length > 0 ? __dirname : fileURLToPath(import.meta.url)
        let templateHtml = readFileSync(`${dirname}/resources/precipitation.html`).toString();

        let templateHtml2 = eval('`'+templateHtml+'`');

      return ctx.puppeteer.render(
        templateHtml2
      )

    }
      else
      {
        //个人天气

         }
    }
      )
}


