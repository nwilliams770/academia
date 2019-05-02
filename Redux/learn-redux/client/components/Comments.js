import React from 'react';

const Comments = React.createClass({
    renderComment(comment, i) {
        return (
            <div className="comment" key={i}>
                <strong>{comment.user}</strong>
                {comment.text}
                <button className="remove-comment" onClick={this.props.removeComment.bind(null, this.props.params.postId, i)}>&times;</button>
            </div>
        )
    },
// Note that we added refs so that we can extract data from the form
// using this.refs
    handleSubmit(e) {
        e.preventDefault();
        const { postId } = this.props.params,
              author = this.refs.author.value,
              comment = this.refs.comment.value;
        this.props.addComment(postId, author, comment);
        // clear out the comment form
        this.refs.commentForm.reset();

    },
    render() {
        return (
            <div className="comments">
                {this.props.postComments.map(this.renderComment)}
            <form ref="commentForm" className="comment-form" onSubmit={this.handleSubmit}>
                <input type="text" ref="author" placeholder="author"/>
                <input type="text" ref="comment" placeholder="comment"/>
                <input type="submit" hidden />
            </form>
            </div>
        )
    }
})

export default Comments;