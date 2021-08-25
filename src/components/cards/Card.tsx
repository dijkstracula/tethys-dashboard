import React from 'react';
import { Button, Card as AntdCard } from 'antd';

import { CloseOutlined } from '@ant-design/icons'
export interface Props {
    title: string
    child: JSX.Element
    onClose: (title: string) => void
};

function Card(props: Props) {
    return (
        <AntdCard loading={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <div className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <div className="cardHeader">
                    <span className="cardTitle">{props.title}</span>
                    <span>
                        <Button className="add-btn" size="small" type="primary" danger
                            onClick={() => props.onClose(props.title)}>
                            <CloseOutlined />
                        </Button>
                    </span>
                </div>
                <div>
                    {props.child}
                </div>
            </div>
        </AntdCard>
    )
}

export default Card;