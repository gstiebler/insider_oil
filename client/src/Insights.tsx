import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
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

        return (
	<section className="container row clearfix">
		{/* Inner Container */}
		<section className="inner-container clearfix">
			{/* <!-- Content */}
			<section id="content" className="eight column row pull-left">
				<div className="flexslider mb25">
					<ul className="slides no-bullet inline-list m0">
						<li>
				     		<a href="#"><img alt="" src="http://placehold.it/620x350"/></a>
				     		<div className="flex-caption">
				                <div className="desc">
				                	<h1><a href="#">Maecenas mattis, tortor ut posuere aliquam.</a></h1>
				                	<p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor</p>
				                </div>
				            </div>
						</li>
						<li>
							<a href="#"><img alt="" src="http://placehold.it/620x350"/></a>
				     		<div className="flex-caption">
				                <div className="desc">
				                	<h1><a href="#">Maecenas mattis</a></h1>
				                	<p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor</p>
				                </div>
				            </div>
				   		</li>
				   		<li>
				     		<a href="#"><img alt="" src="http://placehold.it/620x350"/></a>
				     		<div className="flex-caption">
				                <div className="desc">
				                	<h1><a href="#">Maecenas mattis, tortor ut posuere aliquam, tortor ut posuere aliquam, tortor ut posuere aliquam</a></h1>
				                	<p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor</p>
				                </div>
				            </div>
						</li>
						<li>
							<a href="#"><img alt="" src="http://placehold.it/620x350"/></a>
				     		<div className="flex-caption">
				                <div className="desc">
				                	<h1><a href="#">Maecenas mattis, tortor ut posuere aliquam, tortor ut posuere aliquam, tortor ut posuere aliquam</a></h1>
				                	<p>This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor</p>
				                </div>
				            </div>
				   		</li>
					</ul>
				</div>

				<section className="row">
					<article className="six column">
						<h4 className="cat-title"><a href="#">Business</a></h4>
						<div className="post-image">
							<a href="#"><img src="http://placehold.it/300x220" alt=""/></a>
						</div>

						<div className="post-container">
							<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
							<div className="post-content">
								<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
							</div>
						</div>

						<div className="post-meta">
							<span className="comments"><a href="#">24</a></span>
							<span className="author"><a href="#">nextwpthemes</a></span>
							<span className="date"><a href="#">13 Jan 2013</a></span>
						</div>

						<div className="other-posts">
							<ul className="no-bullet">
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">Check Out the New Recommended Resources on Webdesigntuts+</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">15 Great Last-Minute Gifts for Web Designers</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">How to Create an SEO-Friendly URL Structure</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
							</ul>
						</div>
					</article>
                    
					<article className="six column">
						<h4 className="cat-title"><a href="#">Techology</a></h4>
						<div className="post-image">
							<a href="#"><img src="http://placehold.it/300x220" alt=""/></a>
						</div>

						<div className="post-container">
							<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
							<div className="post-content">
								<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
							</div>
						</div>

						<div className="post-meta">
							<span className="comments"><a href="#">24</a></span>
							<span className="author"><a href="#">nextwpthemes</a></span>
							<span className="date"><a href="#">13 Jan 2013</a></span>
						</div>

						<div className="other-posts">
							<ul className="no-bullet">
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">Check Out the New Recommended Resources on Webdesigntuts+</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">15 Great Last-Minute Gifts for Web Designers</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">How to Create an SEO-Friendly URL Structure</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
							</ul>
						</div>
					</article>
				</section>

				<div className="clearfix mb10 oh">
					<h4 className="cat-title">Business</h4>
					<div className="carousel-container">
						<div className="carousel-navigation">
							<a className="carousel-prev"></a>
							<a className="carousel-next"></a>
						</div>
						<div className="carousel-item-holder row" data-index="0">
							<div className="four column carousel-item">
								<a href="#"><img src="http://placehold.it/300x250" alt=""/></a>

								<div className="post-container">
									<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
									<div className="post-content">
										<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
									</div>
								</div>

								<div className="post-meta">
									<span className="comments"><a href="#">24</a></span>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</div>
							</div>
							<div className="four column carousel-item">
								<a href="#"><img src="http://placehold.it/300x250" alt=""/></a>

								<div className="post-container">
									<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
									<div className="post-content">
										<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
									</div>
								</div>

								<div className="post-meta">
									<span className="comments"><a href="#">24</a></span>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</div>
							</div>
							<div className="four column carousel-item">
								<a href="#"><img src="http://placehold.it/300x250" alt=""/></a>

								<div className="post-container">
									<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
									<div className="post-content">
										<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
									</div>
								</div>

								<div className="post-meta">
									<span className="comments"><a href="#">24</a></span>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</div>
							</div>
							<div className="four column carousel-item">
								<a href="#"><img src="http://placehold.it/300x250" alt=""/></a>

								<div className="post-container">
									<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
									<div className="post-content">
										<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
									</div>
								</div>

								<div className="post-meta">
									<span className="comments"><a href="#">24</a></span>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</div>
							</div>
							<div className="four column carousel-item">
								<a href="#"><img src="http://placehold.it/300x250" alt=""/></a>

								<div className="post-container">
									<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
									<div className="post-content">
										<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
									</div>
								</div>

								<div className="post-meta">
									<span className="comments"><a href="#">24</a></span>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<section className="row">
					<article className="six column">
						<h4 className="cat-title"><a href="#">Business</a></h4>
						<div className="post-image">
							<a href="#"><img src="http://placehold.it/300x220" alt=""/></a>
						</div>

						<div className="post-container">
							<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
							<div className="post-content">
								<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
							</div>
						</div>

						<div className="post-meta">
							<span className="comments"><a href="#">24</a></span>
							<span className="author"><a href="#">nextwpthemes</a></span>
							<span className="date"><a href="#">13 Jan 2013</a></span>
						</div>

						<div className="other-posts">
							<ul className="no-bullet">
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">Check Out the New Recommended Resources on Webdesigntuts+</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">15 Great Last-Minute Gifts for Web Designers</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">How to Create an SEO-Friendly URL Structure</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
							</ul>
						</div>
					</article>
                    
					<article className="six column">
						<h4 className="cat-title"><a href="#">Techology</a></h4>
						<div className="post-image">
							<a href="#"><img src="http://placehold.it/300x220" alt=""/></a>
						</div>

						<div className="post-container">
							<h2 className="post-title">Create a Flexible Folded Paper Effect Using CSS3 Features</h2>
							<div className="post-content">
								<p>Venenatis volutpat orci, ut sodales augue tempor nec. Integer tempus ullamcorper felis eget dipiscing. Maecenas orci justo, mollis at tempus ac, gravida non</p>
							</div>
						</div>

						<div className="post-meta">
							<span className="comments"><a href="#">24</a></span>
							<span className="author"><a href="#">nextwpthemes</a></span>
							<span className="date"><a href="#">13 Jan 2013</a></span>
						</div>

						<div className="other-posts">
							<ul className="no-bullet">
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">Check Out the New Recommended Resources on Webdesigntuts+</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">15 Great Last-Minute Gifts for Web Designers</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
								<li>
									<a href="#"><img src="http://placehold.it/50x50" alt=""/></a>
									<h3 className="post-title"><a href="#">How to Create an SEO-Friendly URL Structure</a></h3>
									<span className="date"><a href="#">13 Jan 2013</a></span>
								</li>
							</ul>
						</div>
					</article>
				</section>
			</section>
            
			<aside id="sidebar" className="four column pull-right">
				<ul className="no-bullet">
					<li className="widget tabs-widget clearfix">
		        		<ul className="tab-links no-bullet clearfix">
		        			<li className="active"><a href="#popular-tab">Popular</a></li>
		        			<li><a href="#recent-tab">Recent</a></li>
		        			<li><a href="#comments-tab">Comments</a></li>
		        		</ul>

		        		<div id="popular-tab">
		        			<ul>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 25, 2012</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 22, 2012</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 05, 2012</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 05, 2012</div>
		        				</li>
		        			</ul>
		        		</div>

		        		<div id="recent-tab">
		        			<ul>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 25, 2012</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 22, 2012</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 05, 2012</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">Dictum ipsum vel laoreet. Sed convallis quam ut elit</a></h3>
		        					<div className="post-date">March 05, 2012</div>
		        				</li>
		        			</ul>
		        		</div>

		       			<div id="comments-tab">
		       				<ul>
		       					<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">admin says:</a></h3>
		        					<div className="author-comment">Nice theme, indeed :)</div>
		        				</li>
		        				<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
	        						<h3><a href="#">faton says:</a></h3>
		       						<div className="author-comment">very nice post!</div>
		       					</li>
		       					<li>
		       						<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		       						<h3><a href="#">sami says:</a></h3>
		       						<div className="author-comment">Nice theme I’m gonna use it on my next site. I loved the layout and ...</div>
		       					</li>
		       					<li>
		        					<a href="#"><img alt="" src="http://placehold.it/60x60"/></a>
		        					<h3><a href="#">sami says:</a></h3>
		        					<div className="author-comment">Nice theme I’m gonna use it on my next site. I loved the layout and ...</div>
		        				</li>
		        			</ul>
		        		</div>
					</li>
					<li className="widget widget_tag_cloud clearfix">
						<h3 className="widget-title">Tags</h3>
                        { tagCloud }
					</li>
				</ul>
			</aside>
		</section>
	</section>
        );
    }
}