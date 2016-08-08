import * as React from 'react';
import { IInsight } from '../../../common/Interfaces';
import { Link } from 'react-router';
import { dateFormatInsight } from '../lib/DateUtils';

interface IAppProps {
    data: IInsight[];
}

interface IAppState {
}

export class Carroussel extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    public render(): React.ReactElement<any> {		
        const carrousselPostItems:React.ReactElement<any>[] = this.props.data.map((item, index) => {
			return (
				<div className="four column carousel-item" key={'cp' + index}>
					<a href="#"><img src={item.imgUrl} alt=""/></a>

					<div className="post-container">
						<h2 className="post-title">
							<Link to={"/app/view_new?id=" + item.id}>{item.title} </Link>
						</h2>
						<div className="post-content">
							<p dangerouslySetInnerHTML={ {__html: item.content } } />
						</div>
					</div>

					<div className="post-meta">
						<span className="date"><a href="#">{dateFormatInsight(item.date)}</a></span>
					</div>
				</div>
			);
		});

		return (
            <div className="clearfix mb10 oh">
				<h4 className="cat-title">title</h4>
				<div className="carousel-container">
					<div className="carousel-navigation">
						<a className="carousel-prev"></a>
						<a className="carousel-next"></a>
					</div>
					<div className="carousel-item-holder row" data-index="0">
						{ carrousselPostItems }
					</div>
				</div>
			</div>
        );
    }
}