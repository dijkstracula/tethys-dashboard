import React from 'react'
import { TagName } from '../backend/Demuxer'

interface Widget {
    onUpdate: (tagName: TagName, ts: Number, val: Number) => void
}

export default Widget;