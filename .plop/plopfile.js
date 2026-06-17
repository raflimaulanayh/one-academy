const { component, restapi, workflow } = require('./settings')

module.exports = function (plop) {
  plop.setGenerator('component', component)
  plop.setGenerator('restapi', restapi)
  plop.setGenerator('workflow', workflow)
}
