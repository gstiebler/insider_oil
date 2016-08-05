import * as React from 'react';
import { getP } from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import { IInsight } from '../../common/Interfaces';
import { Link } from 'react-router';
import { dateFormatInsight } from './lib/DateUtils';

interface IAppProps {
}

interface IAppState {
	insights: ni.Insights.res;
}

export class Insights extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
			insights: null
        };
    }

    private componentDidMount() {
		this.getInsights();
		this.initFlexSlider();
    }    

	private componentDidUpdate() {
		this.initFlexSlider();
	}

	private initFlexSlider() {
		var flexSliderElement:any = $('.flexslider');
        //const flexSliderElement:any = this.refs['flexSliderRef'];
		flexSliderElement.flexslider({ animation: "fade" });
	}

	private componentWillReceiveProps(nextProps: IAppProps) {
		this.getInsights();
    }

	private getInsights() {
		getP('/insights', {})
			.then(this.onInsights.bind(this))
			.catch(showError.show);
	}

	private onInsights(res:ni.Insights.res) {
		this.state.insights = res;
		this.setState(this.state);
	}

    private getOtherPosts(postsData: IInsight[]): React.ReactElement<any> {
        const otherPostsItems:React.ReactElement<any>[] = postsData.map((item, index) => {
            return (                
                <li key={'op' + index}>
                    <a href="#"><img src={item.imgUrl} alt=""/></a>
                    <h3 className="post-title"><Link to={"/app/view_new?id=" + item.id}>{item.title}</Link></h3>
                    <span className="date"><a href="#">{dateFormatInsight(item.date)}</a></span>
                </li>
            );
        });

        return (
            <div className="other-posts">
                <ul className="no-bullet">
                    { otherPostsItems }
                </ul>
            </div>
        );
    }

	private getMiniCarroussel(title: string, postsData: IInsight[]): React.ReactElement<any> {

        const carrousselPostItems:React.ReactElement<any>[] = postsData.map((item, index) => {
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


	private getArticle(category: string, postData: IInsight, otherPostsData: IInsight[]): React.ReactElement<any> {
        const otherPosts = this.getOtherPosts(otherPostsData);

		return (
			<article className="six column">
				<h4 className="cat-title"><a href="#">{category}</a></h4>
				<div className="post-image">
					<a href="#"><img src={postData.imgUrl} alt=""/></a>
				</div>

				<div className="post-container">
					<h2 className="post-title">
						<Link to={"/app/view_new?id=" + postData.id}>{postData.title}</Link>
					</h2>
					<div className="post-content">
							<p dangerouslySetInnerHTML={ {__html: postData.content } } />
					</div>
				</div>

				<div className="post-meta">
					<span className="author"><a href="#">{postData.author}</a></span>
					<span className="date"><a href="#">{dateFormatInsight(postData.date)}</a></span>
				</div>

				{ otherPosts }
			</article>
        );
	}

	private getTab(id:string, tabPostsData: IInsight[]): React.ReactElement<any> {
		const tabItems = tabPostsData.map((item, index) => {
			return (				
				<li key={'tab' + index}>
					<a href="#"><img alt="" src={item.imgUrl}/></a>
					<h3><Link to={"/app/view_new?id=" + item.id}>{item.title}</Link></h3>
					<div className="post-date">{dateFormatInsight(item.date)}</div>
				</li>
			);
		});

 		return (
			<div id={id}>
				<ul>
					{tabItems}
				</ul>
			</div>
        );
	}

	private getFlexSlider(flexSliderPostsData: IInsight[]): React.ReactElement<any> {
		const fsItems = flexSliderPostsData.map((item, index) => {
			return (
				<li key={'fs' + index}>
					<a href="#"><img alt="" src={item.imgUrl}/></a>
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

    public render(): React.ReactElement<any> {
		const { insights } = this.state;
		if(!insights) {
			return <div></div>;
		}

        /*const tagCloud = (
            <div className="tagcloud">
                <a href="#" title="3 topics" style="font-size: 22pt;">business</a>
                <a href="#" title="1 topic" style="font-size: 8pt;">Computers</a>
                <a href="#" title="2 topics" style="font-size: 16.4pt;">css</a>
                <a href="#" title="2 topics" style="font-size: 16.4pt;">design</a>
                <a href="#" title="2 topics" style="font-size: 16.4pt;">graphics</a>
                <a href="#" title="1 topic" style="font-size: 8pt;">html</a>
                <a href="#" title="2 topics" style="font-size: 16.4pt;">jQuery</a>
                <a href="#" title="2 topics" style="font-size: 16.4pt;">themes</a>
                <a href="#" title="2 topics" style="font-size: 16.4pt;">Video</a>
                <a href="#" title="1 topic" style="font-size: 8pt;">video</a>
                <a href="#" title="1 topic" style="font-size: 8pt;">website</a>
            </div>
        );*/

        const tagCloud = null;

        const miniCarroussel = this.getMiniCarroussel('Business', insights.carroussel); 

		const businessArticle = this.getArticle('Business', insights.section1Articles[0], insights.section1Articles);
		const technologyArticle = this.getArticle('Technology', insights.section2Articles[0], insights.section2Articles);

		const popularTab = this.getTab('popular-tab', insights.popular);
		const recentTab = this.getTab('recent-tab', insights.recent);
		const commentsTab = this.getTab('comments-tab', insights.recent);

		const flexSlider = this.getFlexSlider(insights.flexSlider);

        const sideBar = (
			<aside id="sidebar" className="four column pull-right">
				<ul className="no-bullet">
					<li className="widget tabs-widget clearfix">
		        		<ul className="tab-links no-bullet clearfix">
		        			<li className="active"><a href="#popular-tab">Popular</a></li>
		        			<li><a href="#recent-tab">Recent</a></li>
		        			<li><a href="#comments-tab">Comments</a></li>
		        		</ul>
		        		{ popularTab }
                        { recentTab }
		        		{ commentsTab }
					</li>
					<li className="widget widget_tag_cloud clearfix">
						<h3 className="widget-title">Tags</h3>
                        { tagCloud }
					</li>
				</ul>
			</aside>
        );

        return (
			<div className="orbit" >
				<section className="container row clearfix">
					<section className="inner-container clearfix">
						<section id="content" className="eight column row pull-left">
							{ flexSlider }
							<section className="row">
								{ businessArticle }
								{ technologyArticle }
							</section>
							{ miniCarroussel }
							<section className="row">
								{ businessArticle }
								{ technologyArticle }
							</section>
						</section>
						{ sideBar }
					</section>
				</section>
			</div>
        );
    }
}