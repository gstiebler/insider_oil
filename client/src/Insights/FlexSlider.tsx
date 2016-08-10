import * as React from 'react';
import { IInsight } from '../../../common/Interfaces';
import { paths } from '../lib/Server';
import { Link } from 'react-router';

interface IAppProps {
    data: IInsight[];
}

interface IAppState {
}

export class FlexSlider extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private componentDidMount() {
		this.initFlexSlider();
    }    

	private componentDidUpdate() {
		this.initFlexSlider();
	}

	private initFlexSlider() {
		var flexSliderElement:any = $('.flexslider');
		flexSliderElement.flexslider({ animation: "fade" });
	}

    public render(): React.ReactElement<any> {		
        const fsItems = this.props.data.map((item, index) => {
			const imgUrl = paths.baseImg + item.imgUrl;
			return (
				<li key={'fs' + index}>
					<a href="#"><img alt="" src={imgUrl}/></a>
					<div className="flex-caption">
						<div className="desc">
							<h1><Link to={"/app/view_new?id=" + item.id}>{item.title}</Link></h1>
							<p dangerouslySetInnerHTML={ {__html: item.content } } />
						</div>
					</div>
				</li>
			);
		});

		return (
			<div className="flexslider mb25">
				<ul className="slides no-bullet inline-list m0">
					{ fsItems }
				</ul>
			</div>   
		);
    }
}