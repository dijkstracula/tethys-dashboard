import tags from '../tags.json';

/* TODO: this should be richer data, but for now, just use the typeahead file. */
function toTagLine(blob: any) {
    console.log(JSON.stringify(blob, undefined, 2))
    return (
        <tr>
            <td>{blob}</td>
            <td></td>
            <td></td>
        </tr>
    )
}

const TagTable = () => {
    return (<div>
        <table>
            <tr>
                <th>Name</th>
                <th>Comment</th>
                <th>Type</th>
            </tr>
            {tags.map(toTagLine)}
        </table>
    </div>);
}

export default TagTable;