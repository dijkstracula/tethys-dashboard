import React from 'react';
import { Card as AntdCard } from 'antd';
import Card from "./Card";
import { Axis, Chart, Line, Point, Tooltip } from 'bizcharts';

import { Datapoint } from "./common"

const HISTORY = 60;

interface Props {
    onClose: (title: string) => void
    title: string,
}
interface State {
    datapoints: Datapoint<number>[]
};

class ChartCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    componentDidMount() {
        if (!this.state) {
            this.setState({ datapoints: [] })
        }
        setInterval(() => this.update(), 1000)
    }

    update() {
        const nextX = (this.state.datapoints.length === 0
            ? Math.floor(Date.now() / 1000)
            : this.state.datapoints[this.state.datapoints.length - 1].timestamp) + 1
        const nextY = Math.round(Math.random() * 100)

        let newDatapoints = [...this.state.datapoints]
        if (newDatapoints.length === HISTORY) {
            newDatapoints.shift()
        }
        newDatapoints.push({ timestamp: nextX, value: nextY })
        this.setState({ datapoints: newDatapoints })

        console.log(this.state.datapoints)
    }

    render() {
            /* XXX: something to do with the axis label seems to make things reset when other charts are lcosed */        const chart =
            (<Chart
                height={250}
                autoFit
                data={this.state?.datapoints || []}
                interactions={['active-region']}
            >
                <Axis name="timestamp"
                    animate={false}
                />
                <Axis name="value" />

                <Line
                    position="timestamp*value"
                    animate={false}
                />
                <Point position="timestamp*value"
                    animate={false}
                />
                <Tooltip showCrosshairs lock />
            </Chart>)

        return (
            <Card title={this.props.title} child={chart} onClose={this.props.onClose} />
        )
    }
}

export default ChartCard;