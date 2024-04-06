/**
 * Inspired in EcctrlAnimation, this module gets current animation from Playroom player state and uses the same logic
 * of EcctrlAnimation to display character (other than local) animations.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePlayerState } from 'playroomkit'
import { animationSet, useRPMAnimations } from '../../hooks/useRPMAnimations'

export function AnimationRemotePlayer(props) {

  const group = useRef()

  const actions = useRPMAnimations(group)

  return (
    <group ref={group} dispose={null} userData={{ camExcludeCollision: true }}>
      <Animator player={props.player} actions={actions} />
      {props.children}
    </group>
  )
}

const Animator = ({ player, actions }) => {

  const [curAnimation] = usePlayerState(player, 'curAnimation')

  useEffect(() => {

    const action = actions[curAnimation ? curAnimation : animationSet.idle]

    if (
      curAnimation === animationSet.idle ||
      curAnimation === animationSet.jump ||
      curAnimation === animationSet.jumpLand ||
      curAnimation === animationSet.action1 ||
      curAnimation === animationSet.action2 ||
      curAnimation === animationSet.action3
    ) {
      action && action.reset().fadeIn(0.23).setLoop(THREE.LoopOnce, undefined).play()
      action && (action.clampWhenFinished = true)
    } else {
      action && action.reset().fadeIn(0.23).play()
    }

    return () => {
      if (action) {
        action.fadeOut(0.3)
        action._mixer._listeners = []
      }
    }
  }, [curAnimation, actions])

  return <></>
}
