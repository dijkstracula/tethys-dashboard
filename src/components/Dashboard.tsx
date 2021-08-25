import React from 'react';
import BooleanChartCard from './cards/BooleanChartCard';
import NumericalChartCard from './cards/NumericalChartCard';

import tags from "../tags.json"
import Tag from "../Tag";

import TagTypeahead from './TagTypeahead';
interface State {
    cards: Map<string, JSX.Element>, /* TODO: make Card a class?  We might want other "card"-like elements though..*/
};

interface Props {
    tags: Tag[]
}


class Dashboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    addCard(name: string) {
        const onClose = ((s: string) => this.removeCard(s))

        /* XXX: Obviously, we can do better than a linear search. */
        const tag = tags.find((t) => t.name === name)
        if (!tag) {
            console.log("???")
        } else {
            let cards = new Map(this.state.cards)
            switch (tag.type) {
                case "numeric":
                    cards.set(tag.name, <NumericalChartCard title={tag.name} onClose={onClose} />)
                    break
                case "bool":
                    cards.set(tag.name, <BooleanChartCard title={tag.name} onClose={onClose} />)
                    break;
                default:
                    console.log("??????")
            }
            this.setState({
                cards: cards
            })
        }
    }

    removeCard(tag: string) {
        let cards = new Map(this.state.cards)
        cards.delete(tag)

        this.setState({
            cards: cards
        })
    }

    componentDidMount() {
        const onClose = ((s: string) => this.removeCard(s))

        /* Some initial cards.  Not real tags but for the moment who cares*/
        /* XXX: This is janky: if you remove anything but the bottommost tag all the
        * ones above it will reset their graph. */
        const cards = new Map<string, JSX.Element>();
        //  cards.set("num", <NumericalChartCard title="num" onClose={onClose} />);
        // cards.set("bool", <BooleanChartCard title="bool" onClose={onClose} />);

        this.setState({
            cards: cards
        })
    }
    render() {
        const onSelect = (s: string) => this.addCard(s)
        return (
            <div>
                <div>Dashboard Page</div>
                <div><TagTypeahead onSelect={onSelect} /></div>
                <div>
                    {this.state?.cards}
                </div>
            </div>
        );
    }
}

export default Dashboard;