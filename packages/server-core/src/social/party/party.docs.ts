/**
 * An object for swagger documentation configuration
 */
export default {
  definitions: {
    party: {
      type: 'object',
      properties: {}
    },
    party_list: {
      type: 'array',
      items: { $ref: '#/definitions/party' }
    }
  },
  securities: ['create', 'update', 'patch', 'remove'],
  operations: {
    find: {
      security: [{ bearer: [] }]
    }
  }
}
