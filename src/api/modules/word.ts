import service from '@/api/http';

export interface Module {
  id?: number;
  moduleName: string;
  moduleCode: string;
  moduleVersion: string;
  moduleType: number; //1:代表word报表，2:代表Excel报表，3:代表pdf报表
  pageContent: string;
  pageTitle: string;
  pageDate: string;
  status: number; //默认是0，0代表新建状态，1表示已发布状态，2表示已作废
  remark: string;
}

export interface SourceConfig {
  id?: number;
  dsDesc: string;
  dsType: string;
  dsDriver: string;
  dsUrl: string;
  dsUser: string;
  dsAuth: string;
  status?: boolean;
  remark: string;
}
interface PageParams {
  current: number;
  size: number;
  data: any;
}
export interface DataConnect {
  aliasEn: string; //数据源英文(自己用)
  aliasZh: string; //数据源别名(使用者看)
  dbSql: string; //动态数据源接口的查询SQL
  dsId: number; //	关联的数据源配置id		false
  indexClassifyDesc: string; //指标分类描述		false
  interHeader: string; //接口头参数		false
  interParam: string; //	接口body参数		false
  interType: boolean | number; //	接口类型，1:代表本地接口，2:代表外部rest接口，3:数据库配置接口		false
  paramUrl: string; //	参数接口地址		false
  primaryIndexDesc: string; //	一级指标描述		false
  remark: string; //	备注说明，简单描述该模板用来干啥		false
  secondaryIndexDesc: string; //	二级指标描述		false
  sqlParam: string; //	动态数据源接口的查询SQL参数		false
  status: boolean; //	模板状态，默认是0，0代表新建状态，1表示已发布状态，2表示已作废		false
  threeLevelIndexDesc: string; //	三级指标描述		false
}
//转为可选
export type PartialDataConnect = Partial<DataConnect>;

const reportApi = {
  // 分页查询
  pageData(params: { current: number; size: number }) {
    return service.post(`/reportWeb/pass/module/pageModule`, params);
  },
  // 新增
  insertModule(params: Module) {
    return service.post(`/reportWeb/pass/module/insertModule`, params);
  },
  // 修改
  updateModule: (params: Module) => service.post('/reportWeb/pass/module/updateModule', params),

  //删除
  deleteModule: (id: Number) => service.post(`/reportWeb/pass/module/deleteModule`, { id: id }),
  //新增模板样式
  insertModuleStyle: (params: { nodeInfo: string; nodeList: any[]; moduleId: number }) =>
    service.post(`/reportWeb/pass/module/style/insertModuleStyle`, params),
  // 获取模板样式
  findModuleStyle: (id: Number) => service.post(`/reportWeb/pass/module/style/findModuleStyle`, { moduleId: id }),
  // 修改模板样式
  updateModuleStyle: (params: { nodeInfo: string; nodeList: any[]; moduleId: number }) =>
    service.post(`/reportWeb/pass/module/style/updateModuleStyle`, params),

  // dataSourceConfig
  // 新增数据源配置
  insertDataSource: (params: SourceConfig) => service.post(`/reportWeb/pass/dataSource/insertDataSource`, params),
  // 修改数据源配置
  updateDataSource: (params: SourceConfig) => service.post(`/reportWeb/pass/database/updateDataSource`, params),
  //分页查询数据源配置
  pageDataSource: (params: PageParams) => service.post(`/reportWeb/pass/database/pageDataSource`, params),
  //删除数据源配置
  deleteDataSource: (id: Number) => service.post(`/reportWeb/pass/database/deleteDataSource`, { id: id }),

  //dataParamsConfig
  // 新增数据参数
  insertDataConnect: (params: PartialDataConnect) =>
    service.post(`/reportWeb/pass/dataConnect/insertDataConnect`, params),
};

export default reportApi;
