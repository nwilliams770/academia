import React from 'react';
import Photo from './Photo';
import Comments from './Comments';


const Single = React.createClass({
    render() {
    const { postId } = this.props.params;
        // we want to find the index of the post who's code is in the url!
        // it's avail via params as our wildcard, postId!
    const i = this.props.posts.findIndex((post) => post.code === postId);
    const post = this.props.posts[i];
    // if null, we want an array to push new comments into
    const postComments = this.props.comments[post.code] || [];
        return (
            <div className="single-photo">
                <Photo i={i} post={post} {...this.props} />
                <Comments postComments={postComments} {...this.props} />
            </div>
        )
    }
});

export default Single;