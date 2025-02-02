// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize'

import { InviteInterface } from '@etherealengine/common/src/dbmodels/Invite'

import { Application } from '../../../declarations'

export default (app: Application) => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const invite = sequelizeClient.define<Model<InviteInterface>>(
    'invite',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: DataTypes.STRING
      },
      identityProviderType: {
        type: DataTypes.STRING
      },
      passcode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      targetObjectId: {
        type: DataTypes.STRING
      },
      deleteOnUse: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      makeAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      spawnType: {
        type: DataTypes.STRING
      },
      spawnDetails: {
        type: DataTypes.JSON
      },
      timed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      startTime: {
        type: DataTypes.DATE
      },
      endTime: {
        type: DataTypes.DATE
      }
    },
    {
      hooks: {
        beforeCount(options: any): void {
          options.raw = true
        }
      }
    }
  )

  // eslint-disable-next-line no-unused-vars
  ;(invite as any).associate = (models: any): void => {
    ;(invite as any).belongsTo(models.user, { as: 'user' })
    ;(invite as any).belongsTo(models.user, { as: 'invitee' })
    ;(invite as any).belongsTo(models.invite_type, { foreignKey: 'inviteType', required: true })
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return invite
}
