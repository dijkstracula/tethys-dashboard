import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import { DataSourceItemType } from 'antd/lib/auto-complete';
import Option from 'antd/lib/auto-complete';
import tags from '../tags.json';

import {
    Button, Input, AutoComplete,
} from 'antd';

import { SearchOutlined } from '@ant-design/icons'

function filterBy(target: string): any[] {
    /* Don't overwhelm the typeahead box for a short search. */
    if (!target || target.length <= 2) {
        return []
    }
    console.log(target)
    /* XXX: Clearly, smarter things to do here than a linear probe */
    return tags
        .filter((s) => s.includes(target))
        .map((s) => { return { value: s } })
}

function renderItem(s: string) {
    return (
        <Option key={s}>
            <a href={`https://todo/search?q=${s}`}> {s} </a>
        </Option>)
}

const TagTypeahead = () => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const onChange = (searchText: string) => {
        setValue(searchText);
    };

    const onSearch = (searchText: string) => {
        setOptions(filterBy(searchText));
    };

    const onSelect = (data: string) => {
        console.log('onSelect', data);
    };

    return (
        <div className="tag-search-wrapper">
            <AutoComplete
                className="tag-search"
                options={options}
                style={{ width: '100%' }}
                onChange={onChange}
                onSelect={onSelect}
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