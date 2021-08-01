/* XXX: This is needed by the taggen script too.  How best to remove
 * redundency? */
export default interface Tag {
    name: string, /* The fully-qualified tag name. */
    comment?: string,
    type: string, /* This should be linearised into a string by taggen */
}