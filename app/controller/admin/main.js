'use strict'

const Contoller = require('egg').Controller

class MainContoller extends Contoller {
  async index() {
    this.ctx.body = 'hi API'
  }
  async checkLogin() {
    let userName = this.ctx.request.body.userName
    let password = this.ctx.request.body.password
    const sql =
      "SELECT userName FROM admin_user WHERE userName = '" +
      userName +
      "' AND password ='" +
      password +
      "'"
    const res = await this.app.mysql.query(sql)
    if (res.length > 0) {
      let openId = new Date().getTime()
      this.ctx.session.openId = { openId: openId }
      this.ctx.body = { data: '登录成功', openId: openId }
    } else {
      this.ctx.body = { data: '登录失败' }
    }
  }
  async getTypeInfo() {
    const resType = await this.app.mysql.select('type')
    this.ctx.body = { data: resType }
  }

  async addArticle() {
    let tmpArticle = this.ctx.request.body
    const result = await this.app.mysql.insert('article', tmpArticle)
    const insertSuccess = result.affectedRows == 1
    const insertId = result.insertId

    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId: insertId,
    }
  }

  async updateArticle() {
    let tmpArticle = this.ctx.request.body
    const res = await this.app.mysql.update('article', tmpArticle)
    const updateSuccess = res.affectedRows == 1
    this.ctx.body = {
      isScuccess: updateSuccess,
    }
  }

  async getArticleList() {
    let sql =
      'SELECT article.id as id ,' +
      'article.title as title ,' +
      'article.introduce as introduce ,' +
      'article.addTime as addTime ,' +
      'article.view_count as view_count ,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
      'ORDER BY article.id DESC'
    const resList = await this.app.mysql.query(sql)
    this.ctx.body = { list: resList }
  }

  async delArticle() {
    let id = this.ctx.params.id
    const res = await this.app.mysql.delete('article', { id: id })
    this.ctx.body = { data: res }
  }

  async getArticleById() {
    let id = this.ctx.params.id
    let sql =
      'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      'article.article_content as article_content,' +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
      'article.view_count as view_count ,' +
      'type.typeName as typeName ,' +
      'type.id as typeId ' +
      'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
      'WHERE article.id=' +
      id
    const result = await this.app.mysql.query(sql)
    this.ctx.body = { data: result }
  }
}

module.exports = MainContoller
