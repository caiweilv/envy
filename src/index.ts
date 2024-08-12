import { Context, Schema } from 'koishi'

export const name = 'envy'

export interface Config {
  WeatherKey: string;
  Caiyunapp: string;
  WeatherPushSwitch: boolean;
  WeatherPushTime: string;
  WeatherPushGroup: {
    GroupList: {
      ID: string;
      P: {
        ID: string;
        Name:string;
        X: number;
        Y: number;
      }[];
      Switch: boolean;
      }[];
    };
}

export const Config: Schema<Config> = Schema.object({
  WeatherKey : Schema.string().description('天气key'),
  CaiyunApp : Schema.string().required().description('彩云天气key'),
  WeatherPushSwitch : Schema.boolean().required().description('天气推送开关'),
  WeatherPushTime : Schema.string().description('天气推送时间'),
  WeatherPushGroup : Schema.object({
    GroupList : Schema.array((Schema.object({
      ID : Schema.string().required().description('群号'),
      P : Schema.array(Schema.object({
        ID : Schema.string().required().description('ID'),
        Name : Schema.string().required().description('人名'),
        X : Schema.number().min(-180).max(180).required().description('经度'),
        Y : Schema.number().min(-180).max(180).required().description('维度')
      })),
      Switch : Schema.boolean().required().description('群组开关'),
    }))),
  }).description('天气推送群组'),
})

export function apply(ctx: Context) {
  ctx.middleware((session, next) => {
    if (session.content.includes('天王盖地虎')) {
      return '宝塔镇河妖'
    } else {
      return next()
    }
  })
}
