import PropTypes from 'prop-types'
import React from 'react'
import { handleRef } from './refUtils'

export default function RefFindNode({ innerRef, children }) {
  const node = React.useRef()
  const prevNode = React.useRef()

  React.useLayoutEffect(() => {
    // No changes, skip
    if (prevNode.current === node.current.firstChild) {
      return
    }

    // The previous system worked by calling findDOMNode(this), which would return the first element rendered as a child from this component.
    // Using direct DOM querying from a Ref is as close as we can get to doing this in Concurrent Mode.
    handleRef(innerRef, node.current.firstChild)
    prevNode.current = node.current.firstChild
  }, [innerRef, children])

  // This must only be run on unmount.
  React.useLayoutEffect(() => {
    return () => {
      handleRef(innerRef, null)
    }
  }, [innerRef])

  return (
    <x-ref ref={node} style={{ display: 'contents' }}>
      {children}
    </x-ref>
  )
}

RefFindNode.propTypes = {
  /** Primary content. */
  children: PropTypes.element.isRequired,

  /**
   * Called when a child component will be mounted or updated.
   *
   * @param {HTMLElement} node - Referred node.
   */
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}
