import { useState } from 'react';
import 'antd/dist/antd.css';
import tags from '../tags.json';
import { SelectProps } from 'antd/es/select';
import {
    Button, Input, AutoComplete,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Tag from '../Tag'

interface Props {
    onSelect: (s: string) => void
}

function filterBy(target: string): any[] {
    /* Don't overwhelm the typeahead box for a short search. */
    if (!target || target.length <= 2) {
        return []
    }
    console.log(target)
    /* XXX: Clearly, smarter things to do here than a linear probe */
    return tags
        .filter((s) => s.name.includes(target))
        .filter((s) => s.type === "numeric" || s.type === "bool")
        .map((s) => { return { value: s.name } }) /* XXX */
}

function renderItem(t: Tag) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            <span>
                {t.name}
            </span>
            <span>
                <Button className="add-btn" size="small" type="primary">
                    <PlusOutlined />
                </Button>
            </span>
        </div>)
}

const TagTypeahead = (props: Props) => {
    const [, setValue] = useState('');
    const [options, setOptions] = useState<SelectProps<object>['options']>([]); //useState<{ value: string, label: JSX.Element }[]>([]);

    const onChange = (searchText: string) => {
        setValue(searchText);
    };

    const onSearch = (searchText: string) => {
        setOptions(filterBy(searchText));
    };

    return (
        <div className="tag-search-wrapper">
            <AutoComplete
                className="tag-search"
                options={options}
                style={{ width: '100%' }}
                onChange={onChange}
                onSelect={props.onSelect}
                onSearch={onSearch}
                placeholder="Tag search"
            >
                <Input
                    suffix={(
                        <Button className="search-btn" size="large" type="primary">
                            <SearchOutlined />
                        </Button>
                    )}
                />
            </AutoComplete>
        </div>
    );
};

export default TagTypeahead;