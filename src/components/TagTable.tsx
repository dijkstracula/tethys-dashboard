import tags from '../tags.json';
import { Table } from 'antd';

/* TODO: doing somethign interesting with the tag column might be good, but
 * just print it out for the moment. */
export const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <a href="#top">{text}</a>,
    },
    {
        title: 'Description',
        dataIndex: 'comment',
        key: 'comment',
    },
    {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
    }
];


const DEFAULT_PAGE_SIZE = 15;

const TagTable = () => {
    const table = (
        <Table
            dataSource={tags}
            columns={columns}
            rowKey={(t) => t.name}
            pagination={{
                pageSize: DEFAULT_PAGE_SIZE,
                total: tags.length,
                showTotal: (total, range) => {
                    return `${range[0]}-${range[1]} of ${total} tags`;
                },
            }}
        />
    )

    return table
}

export default TagTable;