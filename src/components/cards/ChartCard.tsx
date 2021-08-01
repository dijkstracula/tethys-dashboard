import React from 'react';
import { Card as AntdCard } from 'antd';
import Card from "./Card";
import { Axis, Chart, Line, Point, Tooltip } from 'bizcharts';

const HISTORY = 60;

interface Datapoint {
    timestamp: number,
    value: number
};

interface State {
    datapoints: Datapoint[]
};

interface Props {
    title: string,
}


class ChartCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.setState({ datapoints: [] })
    }

    componentDidMount() {
        this.setState({ datapoints: [] })
        setInterval(() => this.update(), 1000)
    }

    update() {
        const nextX = (this.state.datapoints.length == 0
            ? 1
            : this.state.datapoints[this.state.datapoints.length - 1].timestamp) + 1
        const nextY = Math.round(Math.random() * 100)

        let newDatapoints = [...this.state.datapoints]
        if (newDatapoints.length == HISTORY) {
            newDatapoints.shift()
        }
        newDatapoints.push({ timestamp: nextX, value: nextY })
        this.setState({ datapoints: newDatapoints })

        console.log(this.state.datapoints)
    }

    render() {
        const chart =
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
            <Card title={this.props.title} child={chart} />
        )
    }
}

export default ChartCard;