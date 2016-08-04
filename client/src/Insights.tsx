import * as React from 'react';
import { getP } from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import { IInsight } from '../../common/Interfaces';
import { Link } from 'react-router';

interface IAppProps {
}

interface IAppState {
}

export class Insights extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private componentDidMount() {
		this.getInsights();
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
		console.log(res);
	}

    private getOtherPosts(postsData: IInsight[]): React.ReactElement<any> {
        const otherPostsItems:React.ReactElement<any>[] = postsData.map((item, index) => {
            return (                
                <li key={'op' + index}>
                    <a href="#"><img src={item.imgUrl} alt=""/></a>
                    <h3 className="post-title"><a href="#">{item.title}</a></h3>
                    <span className="date"><a href="#">{item.date}</a></span>
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
						<h2 className="post-title">{item.title}</h2>
						<div className="post-content">
							<p>{item.content}</p>
						</div>
					</div>

					<div className="post-meta">
						<span className="date"><a href="#">{item.date}</a></span>
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
					<h2 className="post-title">{postData.title}</h2>
					<div className="post-content">
						<p>{postData.content}</p>
					</div>
				</div>

				<div className="post-meta">
					<span className="author"><a href="#">{postData.author}</a></span>
					<span className="date"><a href="#">{postData.date}</a></span>
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
					<h3><a href="#">{item.title}</a></h3>
					<div className="post-date">{item.date}</div>
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
							<h1><a href="#">{item.title}</a></h1>
							<p>{item.content}</p>
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

		const otherPostsData = [
            {
                img: 'http://placehold.it/50x50',
				title: 'Check Out the New Recommended Resources on Webdesigntuts+',
				date: '13 Jan 2013'
            },
            {
                img: 'http://placehold.it/50x50',
				title: '15 Great Last-Minute Gifts for Web Designers',
				date: '13 Jan 2013'
            },
            {
                img: 'http://placehold.it/50x50',
				title: 'How to Create an SEO-Friendly URL Structure',
				date: '13 Jan 2013'
            },
        ];

		const miniCarrousselData = [
            {
                img: 'http://placehold.it/300x250',
				title: 'Create a Flexible Folded Paper Effect Using CSS3 Features 3',
				content: 'Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non',
				date: '13 Jan 2013'
            },
            {
                img: 'http://placehold.it/300x250',
				title: 'Create a Flexible Folded Paper Effect Using CSS3 Features 3',
				content: 'Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non',
				date: '13 Jan 2013'
            },
            {
                img: 'http://placehold.it/300x250',
				title: 'Create a Flexible Folded Paper Effect Using CSS3 Features 3',
				content: 'Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non',
				date: '13 Jan 2013'
            },
            {
                img: 'http://placehold.it/300x250',
				title: 'Create a Flexible Folded Paper Effect Using CSS3 Features 3',
				content: 'Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non',
				date: '13 Jan 2013'
            },
            {
                img: 'http://placehold.it/300x250',
				title: 'Create a Flexible Folded Paper Effect Using CSS3 Features 3',
				content: 'Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non',
				date: '13 Jan 2013'
            },
		];

		const articleData:IInsight = {
			imgUrl: 'http://placehold.it/300x220',
			title: 'Create a Flexible Folded Paper Effect Using CSS3 Features 6',
			content: 'Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non',
			author: 'nextwpthemes',
			date: '13 Jan 2013',
		};

		const tabData:IInsight[] = [
			{
				imgUrl: 'http://placehold.it/60x60',
				title: 'Dictum ipsum vel laoreet. Sed convallis quam ut elit',
				date: 'March 05, 2012'
			},
			{
				imgUrl: 'http://placehold.it/60x60',
				title: 'Dictum ipsum vel laoreet. Sed convallis quam ut elit',
				date: 'March 05, 2012'
			},
			{
				imgUrl: 'http://placehold.it/60x60',
				title: 'Dictum ipsum vel laoreet. Sed convallis quam ut elit',
				date: 'March 05, 2012'
			},
			{
				imgUrl: 'http://placehold.it/60x60',
				title: 'Dictum ipsum vel laoreet. Sed convallis quam ut elit',
				date: 'March 05, 2012'
			},
		];

		const flexSliderData:IInsight[] = [
			{
				imgUrl: 'http://placehold.it/620x350',
				title: 'Maecenas mattis, tortor ut posuere aliquam.',
				content: "This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor",
			},
			{
				imgUrl: 'http://placehold.it/620x350',
				title: 'Maecenas mattis',
				content: "This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor",
			},
			{
				imgUrl: 'http://placehold.it/620x350',
				title: 'Maecenas mattis, tortor ut posuere aliquam, tortor ut posuere aliquam, tortor ut posuere aliquam',
				content: "This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor",
			},
			{
				imgUrl: 'http://placehold.it/620x350',
				title: 'Maecenas mattis, tortor ut posuere aliquam.',
				content: "This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor",
			},
		];

        const miniCarroussel = this.getMiniCarroussel('Business', miniCarrousselData); 

		const businessArticle = this.getArticle('Business', articleData, otherPostsData);
		const technologyArticle = this.getArticle('Technology', articleData, otherPostsData);

		const popularTab = this.getTab('popular-tab', tabData);
		const recentTab = this.getTab('recent-tab', tabData);
		const commentsTab = this.getTab('comments-tab', tabData);

		const flexSlider = this.getFlexSlider(flexSliderData);

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
        );
    }
}