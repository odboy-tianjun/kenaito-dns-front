export default ({ service, request, faker, tools }) => ({
  /**
   * @description 分页查询RR记录
   * @param {Object} data
   */
  CORE_QUERY_PAGE (data = {}) {
    return request({
      url: '/queryPage',
      method: 'post',
      data
    })
  },
  /**
   * @description 分页查询RR记录
   * @param {Object} data
   */
  CORE_TEST_HOSTNAME (data = {}) {
    return request({
      url: '/test',
      method: 'post',
      data
    })
  },
  /**
   * @description 新增解析记录
   * @param {Object} data
   */
  CORE_CREATE (data = {}) {
    return request({
      url: '/create',
      method: 'post',
      data
    })
  },
  /**
   * @description 新增解析记录
   * @param {Object} data
   */
  CORE_MODIFY (data = {}) {
    return request({
      url: '/modify',
      method: 'post',
      data
    })
  },
  /**
   * @description 启/停用解析记录
   * @param {Object} data
   */
  CORE_SWITCH (data = {}) {
    return request({
      url: '/switch',
      method: 'post',
      data
    })
  },
  /**
   * @description 删除解析记录
   * @param {Object} data
   */
  CORE_DELETE (data = {}) {
    return request({
      url: '/remove',
      method: 'post',
      data
    })
  },
  /**
   * @description 分页查询变更历史记录
   * @param {Object} data
   */
  CORE_QUERY_VERSION_PAGE (data = {}) {
    return request({
      url: '/queryVersionPage',
      method: 'post',
      data
    })
  }
})
