import * as React from 'react';
import { getP, paths } from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ni from '../../../common/NetworkInterfaces';
import { IInsight } from '../../../common/Interfaces';
import { Link } from 'react-router';
import { dateFormatInsight } from '../lib/DateUtils';
import { FlexSlider } from './FlexSlider';

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
			const imgUrl = paths.baseImg + item.imgUrl;
            return (                
                <li key={'op' + index}>
                    <a href="#"><img src={imgUrl} alt=""/></a>
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

	private getArticle(category: string, posts: IInsight[]): React.ReactElement<any> {
        const otherPosts = this.getOtherPosts(posts.slice(1, posts.length));
		const firstPost = posts[0];

		const imgUrl = paths.baseImg + firstPost.imgUrl;
		return (
			<article className="six column">
				<h4 className="cat-title"><a href="#">{category}</a></h4>
				<div className="post-image">
					<a href="#"><img src={imgUrl} alt=""/></a>
				</div>

				<div className="post-container">
					<h2 className="post-title">
						<Link to={"/app/view_new?id=" + firstPost.id}>{firstPost.title}</Link>
					</h2>
					<div className="post-content">
							<p dangerouslySetInnerHTML={ {__html: firstPost.content } } />
					</div>
				</div>

				<div className="post-meta">
					<span className="author"><a href="#">{firstPost.author}</a></span>
					<span className="date"><a href="#">{dateFormatInsight(firstPost.date)}</a></span>
				</div>

				{ otherPosts }
			</article>
        );
	}

	private getTab(id:string, tabPostsData: IInsight[]): React.ReactElement<any> {
		const tabItems = tabPostsData.map((item, index) => {
			const imgUrl = paths.baseImg + item.imgUrl;
			return (				
				<li key={'tab' + index}>
					<a href="#"><img alt="" src={imgUrl}/></a>
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
        );
		
		const tags = (
			<li className="widget widget_tag_cloud clearfix">
				<h3 className="widget-title">Tags</h3>
				{ tagCloud }
			</li>
		);
		*/

        const tags = null;

		const explorationArticles = this.getArticle('Exploração', insights.section1Articles);
		const productionArticles = this.getArticle('Produção', insights.section2Articles);
		const marketArticles = this.getArticle('Mercado', insights.section3Articles);
		const strategyArticles = this.getArticle('Estratégia', insights.section4Articles);

		const popularTab = this.getTab('popular-tab', insights.popular);
		const recentTab = this.getTab('recent-tab', insights.recent);
		const commentsTab = this.getTab('comments-tab', insights.recent);

        const sideBar = (
			<aside id="sidebar" className="four column pull-right">
				<ul className="no-bullet">
					<li className="widget tabs-widget clearfix">
		        		<ul className="tab-links no-bullet clearfix">
		        			<li className="active"><a href="#recent-tab">Recentes</a></li>
		        			<li><a href="#popular-tab">Populares</a></li>
		        		</ul>
		        		{ popularTab }
                        { recentTab }
		        		{ commentsTab }
					</li>
					{ tags }
				</ul>
			</aside>
        );

        return (
			<div className="orbit" >
				<section className="container row clearfix">
					<section className="inner-container clearfix">
						<section id="content" className="eight column row pull-left">
							<FlexSlider data={insights.flexSlider} />
							<section className="row">
								{ explorationArticles }
								{ productionArticles }
							</section>
							<section className="row">
								{ marketArticles }
								{ strategyArticles }
							</section>
						</section>
						{ sideBar }
					</section>
				</section>
			</div>
        );
    }
}