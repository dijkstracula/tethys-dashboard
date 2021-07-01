import Widget from '../components/Widget'

export type TagName = string;

class Demuxer {
    // All the widgets to take when an update for a given tag comes in.
    private subscribers: Map<TagName, Widget[]> = new Map<TagName, Widget[]>()

    constructor() {

    }

    subscribeToTag(w: Widget, tag: TagName) {
        let ws = this.subscribers.get(tag)
        if (ws === undefined) {
            ws = []
        }
        ws.push(w)
        this.subscribers.set(tag, ws)
    }

    unsubscribeFrom(w: Widget, tag: TagName) {
        let ws = this.subscribers.get(tag)
        if (ws !== undefined) {
            ws = ws.filter((v) => w != v)
            if (ws.length == 0) {
                this.subscribers.delete(tag)
            } else {
                this.subscribers.set(tag, ws)
            }
        }
    }

    unsubscribeAll(w: Widget) {
        this.subscribers.forEach((_, tag) => {
            this.unsubscribeFrom(w, tag)
        });
    }

    private fireUpdate(tagName: TagName, ts: Number, val: Number) {
        let ws = this.subscribers.get(tagName)
        if (ws !== undefined) {
            ws.forEach((w) => w.onUpdate(tagName, ts, val))
        }

    }
}

export default Demuxer;