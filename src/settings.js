module.exports = {
  title: 'AZ Cloud',
  // 获取令牌时，请求头信息(Basic Base64.encode(client_id:client_secret))
  authorizationValue: 'Basic YXo6MTIzNDU2',
  // 社交登录后台地址
  socialLoginUrl: 'http://120.79.191.180:9301/auth/social/login',
  // 请替换为您的实际地址
  pages: {
    // FEBS-Admin 控制台地址
    springBootAdminUrl: 'http://120.79.191.180:9401/login',
    // kibana 控制台地址
    kibanaUrl: 'http://120.79.191.180:5601',
    // nacos 控制台地址
    nacosUrl: 'http://120.79.191.180:9001/nacos',
    // skywalking地址
    skywalkingUrl: 'http://120.79.191.180:8080/',
    // 文档中心
    docUrl: 'http://120.79.191.180:9301/doc.html',
    // Granfana控制台
    grafanaUrl: 'http://120.79.191.180:9404/',
    // tx-manager控制台
    txUrl: 'http://120.79.191.180:9501/admin/index.html#/login'
  }
}
