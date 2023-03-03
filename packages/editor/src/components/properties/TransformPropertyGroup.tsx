import React from 'react'
import { useTranslation } from 'react-i18next'
import { Euler } from 'three'

import { Entity } from '@etherealengine/engine/src/ecs/classes/Entity'
import {
  getComponent,
  hasComponent,
  useComponent,
  useOptionalComponent
} from '@etherealengine/engine/src/ecs/functions/ComponentFunctions'
import { getEntityNodeArrayFromEntities } from '@etherealengine/engine/src/ecs/functions/EntityTree'
import { SceneDynamicLoadTagComponent } from '@etherealengine/engine/src/scene/components/SceneDynamicLoadTagComponent'
import { TransformSpace } from '@etherealengine/engine/src/scene/constants/transformConstants'
import { LocalTransformComponent } from '@etherealengine/engine/src/transform/components/TransformComponent'
import { TransformComponent } from '@etherealengine/engine/src/transform/components/TransformComponent'
import { dispatchAction, getState } from '@etherealengine/hyperflux'

import { EditorControlFunctions } from '../../functions/EditorControlFunctions'
import { EditorHistoryAction } from '../../services/EditorHistory'
import { EditorAction } from '../../services/EditorServices'
import { SelectionState } from '../../services/SelectionServices'
import BooleanInput from '../inputs/BooleanInput'
import CompoundNumericInput from '../inputs/CompoundNumericInput'
import EulerInput from '../inputs/EulerInput'
import InputGroup from '../inputs/InputGroup'
import Vector3Input from '../inputs/Vector3Input'
import NodeEditor from './NodeEditor'
import { EditorComponentType, updateProperty } from './Util'

/**
 * TransformPropertyGroup component is used to render editor view to customize properties.
 *
 * @type {class component}
 */
export const TransformPropertyGroup: EditorComponentType = (props) => {
  const { t } = useTranslation()

  useOptionalComponent(props.entity, SceneDynamicLoadTagComponent)
  const transformComponent = useComponent(props.entity, TransformComponent)
  const localTransformComponent = useOptionalComponent(props.entity, LocalTransformComponent)

  const onRelease = () => {
    dispatchAction(EditorAction.sceneModified({ modified: true }))
    dispatchAction(EditorHistoryAction.createSnapshot({ modify: true }))
  }

  const onChangeDynamicLoad = (value) => {
    const nodes = getEntityNodeArrayFromEntities(getState(SelectionState).selectedEntities.value).filter(
      (n) => typeof n !== 'string'
    ) as Entity[]
    EditorControlFunctions.addOrRemoveComponent(nodes, SceneDynamicLoadTagComponent, value)
  }

  //function to handle the position properties
  const onChangePosition = (value) => {
    const nodes = getEntityNodeArrayFromEntities(getState(SelectionState).selectedEntities.value)
    EditorControlFunctions.positionObject(nodes, [value])
  }

  //function to handle changes rotation properties
  const onChangeRotation = (value: Euler) => {
    const nodes = getEntityNodeArrayFromEntities(getState(SelectionState).selectedEntities.value)
    EditorControlFunctions.rotateObject(nodes, [value])
  }

  //function to handle changes in scale properties
  const onChangeScale = (value) => {
    const nodes = getEntityNodeArrayFromEntities(getState(SelectionState).selectedEntities.value)
    EditorControlFunctions.scaleObject(nodes, [value], TransformSpace.Local, true)
  }

  //rendering editor view for Transform properties
  const transform = localTransformComponent ?? transformComponent!

  return (
    <NodeEditor component={TransformComponent} {...props} name={t('editor:properties.transform.title')}>
      <InputGroup name="Dynamically Load Children" label={t('editor:properties.lbl-dynamicLoad')}>
        <BooleanInput value={hasComponent(props.entity, SceneDynamicLoadTagComponent)} onChange={onChangeDynamicLoad} />
        {hasComponent(props.entity, SceneDynamicLoadTagComponent) && (
          <CompoundNumericInput
            style={{ paddingLeft: `12px`, paddingRight: `3px` }}
            min={1}
            max={100}
            step={1}
            value={getComponent(props.entity, SceneDynamicLoadTagComponent).distance}
            onChange={updateProperty(SceneDynamicLoadTagComponent, 'distance')}
          />
        )}
      </InputGroup>
      <InputGroup name="Position" label={t('editor:properties.transform.lbl-postition')}>
        <Vector3Input
          value={transform.position.value}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          onChange={onChangePosition}
          onRelease={onRelease}
        />
      </InputGroup>
      <InputGroup name="Rotation" label={t('editor:properties.transform.lbl-rotation')}>
        <EulerInput quaternion={transform.rotation.value} onChange={onChangeRotation} unit="°" onRelease={onRelease} />
      </InputGroup>
      <InputGroup name="Scale" label={t('editor:properties.transform.lbl-scale')}>
        <Vector3Input
          uniformScaling
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={transform.scale.value}
          onChange={onChangeScale}
          onRelease={onRelease}
        />
      </InputGroup>
    </NodeEditor>
  )
}

export default TransformPropertyGroup
