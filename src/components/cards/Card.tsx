import React from 'react';
import { Card as AntdCard } from 'antd';

export interface Props {
    title: string
    child: JSX.Element
};

function Card(props: Props) {
    return (
        <AntdCard loading={false} bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <div className="card">
                <div className="cardHeader">
                    <span className="cardTitle">{props.title}</span>
                </div>
                <div>
                    {props.child}
                </div>
            </div>
        </AntdCard>
    )
}

export default Card;