import './styles/style.css';

async function loadData() {
    const res = await fetch('/data.json');
    const data = await res.json();
    const user = data.currentUser;

    const commentForm = document.querySelector('.new-comment__data');
    const avatar = createProfilePic(user);
    commentForm.prepend(avatar);
    return data
}

function renderComment(comments, user) {
    comments.forEach(comment => {
        const commentSection = document.querySelector('.comment__section');
        const commentElement = createCommentElement(comment, user);
        const commentForm = document.querySelector('.new-comment');
        commentSection.insertBefore(commentElement, commentForm);
    })
}

function createProfilePic(user) {
    const avatarImg = document.createElement('img');
    avatarImg.alt = `Avatar of ${user.username}`;
    avatarImg.src = user.image.png;
    avatarImg.classList.add('new-comment__avatar');
    return avatarImg;
}

function createCommentElement(comment, user) {
    const article = document.createElement('article');
    article.classList.add('comment');

    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment__user')

    const commentWrapper = document.createElement('div');
    commentWrapper.classList.add('comment__wrapper');

    const userDataDiv = document.createElement('div');
    userDataDiv.classList.add('comment__user-data');

    const userAvatar = document.createElement('img');
    userAvatar.src = comment.user.image.png;
    userAvatar.alt = `Avatar of ${comment.user.username}`;
    userAvatar.classList.add('comment__data-avatar');
    userDataDiv.appendChild(userAvatar);

    const usernameP = document.createElement('p');
    usernameP.textContent = comment.user.username;
    usernameP.classList.add('comment__data-name', 'mx-4');
    userDataDiv.appendChild(usernameP);

    if (comment.user.username === user.username) {
        const youBadge = document.createElement('span');
        youBadge.textContent = 'you';
        youBadge.classList.add('comment__badge');
        userDataDiv.appendChild(youBadge);
    }

    const timeP = document.createElement('p');
    timeP.textContent = comment.createdAt;
    timeP.classList.add('comment__data-time');
    userDataDiv.appendChild(timeP);

    const commentText = document.createElement('p');
    commentText.textContent = comment.content;
    commentText.classList.add('comment__text');
    if (comment.replyingTo) {
        const repliedAdd = document.createElement('span');
        usernameP.classList.add('mr-2');
        repliedAdd.classList.add('comment__text-repliedTo');
        repliedAdd.textContent = `@${comment.replyingTo} `;
        commentText.prepend(repliedAdd);
    }

    const voteDiv = document.createElement('div');
    voteDiv.classList.add('comment__vote');

    const upvoteBtn = document.createElement('button');
    upvoteBtn.classList.add('comment__vote-btn');
    upvoteBtn.setAttribute('aria-label', 'Increase score');
    upvoteBtn.id = 'up';
    upvoteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11" class="w-4 h-4 fill-current transition-colors">
    <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" />
  </svg>`
    voteDiv.appendChild(upvoteBtn);

    const scoreP = document.createElement('p');
    scoreP.textContent = comment.score;
    scoreP.classList.add('comment__vote-value');
    voteDiv.appendChild(scoreP);

    const downvoteBtn = document.createElement('button');
    downvoteBtn.classList.add('comment__vote-btn');
    downvoteBtn.setAttribute('aria-label', 'Decrease score');
    downvoteBtn.id = 'down';
    downvoteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 3" class="w-4 h-1 fill-current transition-colors">
    <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" />
  </svg>`;
    voteDiv.appendChild(downvoteBtn);

    const replyBtn = document.createElement('button');
    replyBtn.classList.add('comment__reply-btn', 'group', 'md:hidden');
    replyBtn.setAttribute('aria-label', 'Reply comment');
    replyBtn.innerHTML = `<svg class="comment__reply-icon" width="14" height="13" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" />
  </svg>`;
    const replyText = document.createElement('p');
    replyText.textContent = 'Reply';
    replyText.classList.add('comment__reply-text');
    replyBtn.appendChild(replyText);

    commentWrapper.appendChild(userDataDiv);
    commentWrapper.appendChild(commentText);

    commentDiv.appendChild(commentWrapper);
    commentDiv.appendChild(voteDiv);

    const replyBtnDesktop = replyBtn.cloneNode(true);
    replyBtnDesktop.classList.add('hidden', 'md:flex', 'absolute', 'right-0');
    replyBtnDesktop.classList.remove('md:hidden')
    if (comment.user.username === user.username) {
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('comment__action', 'md:hidden');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('comment__delete-btn', 'group');
        deleteBtn.setAttribute('aria-label', 'Delete Comment');
        deleteBtn.innerHTML = `<svg class="comment__delete-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="14">
        <path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"/>
      </svg>`;
        const deleteText = document.createElement('p');
        deleteText.textContent = 'Delete';
        deleteText.classList.add('comment__delete-text');
        deleteBtn.appendChild(deleteText);

        const editBtn = document.createElement('button');
        editBtn.classList.add('comment__edit-btn', 'group');
        editBtn.setAttribute('aria-label', 'Edit Comment');
        editBtn.innerHTML = `<svg class="comment__edit-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
        <path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"/>
      </svg>`
        const editText = document.createElement('p');
        editText.textContent = 'Edit';
        editText.classList.add('comment__edit-text');
        editBtn.appendChild(editText);

        actionDiv.appendChild(deleteBtn);
        actionDiv.appendChild(editBtn);
        commentDiv.appendChild(actionDiv);

        const actionDivDesktop = actionDiv.cloneNode(true);
        actionDivDesktop.classList.add('hidden', 'md:flex');
        actionDivDesktop.classList.remove('md:hidden')
        userDataDiv.appendChild(actionDivDesktop);
    } else {
        userDataDiv.appendChild(replyBtnDesktop);
        commentDiv.appendChild(replyBtn);
    }

    article.appendChild(commentDiv);
    if (!comment.replyingTo) {
        const repliesDiv = document.createElement('div');
        repliesDiv.classList.add('comment__replies', 'border-grey-100');
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
                const replyElement = createCommentElement(reply, user);
                repliesDiv.appendChild(replyElement);
            })
        }
        article.appendChild(repliesDiv);
    }

    return article
}

function createReplyForm(repliedUser, user) {
    const replyForm = document.createElement('form');
    replyForm.setAttribute('aria-label', 'Post a new comment');
    replyForm.action = "";
    replyForm.classList.add('new-comment');

    const replyLabel = document.createElement('label');
    replyLabel.setAttribute('for', 'new_comment');
    replyLabel.classList.add('sr-only');
    replyForm.appendChild(replyLabel);

    const replyText = document.createElement('textarea');
    replyText.classList.add('new-comment__input', 'border-grey-100');
    replyText.id = "new_comment";
    replyText.name = "new_comment";
    replyText.placeholder = "Add a comment...";
    replyText.rows = 3;
    replyText.required = true;
    replyText.value = `@${repliedUser} `;
    replyForm.appendChild(replyText);

    const newCommentDiv = document.createElement('div');
    newCommentDiv.classList.add("new-comment__data");

    const replyUserImg = createProfilePic(user);
    newCommentDiv.appendChild(replyUserImg);

    const replyBtn = document.createElement('button');
    replyBtn.type = "submit";
    replyBtn.classList.add('new-comment__btn');
    replyBtn.textContent = "REPLY";
    newCommentDiv.appendChild(replyBtn);

    replyForm.appendChild(newCommentDiv);
    return replyForm;
}

function setupReplyListener(user) {
    const commentSection = document.querySelector('.comment__section');
    commentSection.addEventListener('click', (event) => {
        if (event.target.closest('.comment__reply-btn')) {
            const commentArticle = event.target.closest('article.comment');
            const username = commentArticle.querySelector('.comment__data-name').textContent;

            const existingForm = commentArticle.querySelector('.new-comment');
            if (existingForm) existingForm.remove();

            const replyForm = createReplyForm(username, user);
            commentArticle.appendChild(replyForm);

            const textArea = replyForm.querySelector('textarea');
            textArea.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                if (textArea) textArea.focus();
            }, 500)

        }
    })
}

function setupEditListener() {
    const commentSection = document.querySelector('.comment__section');
    commentSection.addEventListener('click', (event) => {
        if (event.target.closest('.comment__edit-btn')) {
            const commentArticle = event.target.closest('article.comment');
            if (commentArticle.querySelector('textarea')) return;

            const contentP = commentArticle.querySelector('.comment__text');
            const currentContent = contentP.textContent.trim();

            const editFrom = document.createElement('form');
            editFrom.setAttribute('aria-label', "Edit your comment");
            editFrom.classList.add('edit-comment', 'w-full');

            const textArea = document.createElement('textarea');
            textArea.classList.add('new-comment__input');
            textArea.required = true;
            textArea.value = currentContent;

            contentP.replaceWith(editFrom);
            textArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                if (textArea) textArea.focus();
                textArea.style.height = textArea.scrollHeight + 'px';
            }, 150);

            textArea.addEventListener('input', () => {
                textArea.style.height = textArea.scrollHeight + 'px';
            })

            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'UPDATE';
            updateBtn.classList.add('new-comment__btn', 'mb-4');

            editFrom.appendChild(textArea);
            editFrom.appendChild(updateBtn);
            /* textArea.after(updateBtn); */

            updateBtn.addEventListener('click', () => {
                const updatedText = textArea.value.trim();

                const match = updatedText.match(/^@(\w+)\s/);
                const newContentP = document.createElement('p');
                newContentP.classList.add('comment__text');

                if (match) {
                    const username = match[1];
                    const restOfMessage = updatedText.replace(`@${username}`, '');

                    const tagSpan = document.createElement('span');
                    tagSpan.classList.add('comment__text-repliedTo');
                    tagSpan.textContent = `@${username}`;
                    newContentP.textContent = restOfMessage;
                    newContentP.prepend(tagSpan);
                } else {
                    newContentP.textContent = updatedText;
                }

                textArea.replaceWith(newContentP);
                updateBtn.remove();
            })
        }
    })
}

function setDeleteListener() {
    const commentSection = document.querySelector('.comment__section');
    const deleteModal = document.getElementById('deleteModal');
    const cancelBtn = document.querySelector('.delete-action__cancel');
    const deleteBtn = document.querySelector('.delete-action__delete');
    let commentArticle = null;

    commentSection.addEventListener('click', (event) => {
        if (event.target.closest('.comment__delete-btn')) {
            commentArticle = event.target.closest('article.comment');

            if (commentArticle) deleteModal.classList.remove('hidden');
        }
    })

    cancelBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    })

    deleteBtn.addEventListener('click', () => {
        if (commentArticle) commentArticle.remove();

        deleteModal.classList.add('hidden');
        commentArticle = null;
    })

}

function setVoteListener() {
    const commentSection = document.querySelector('.comment__section');

    commentSection.addEventListener('click', (event) => {
        const isUp = event.target.closest('#up');
        const isDown = event.target.closest('#down');
        if (isUp || isDown) {
            const voteWrapper = event.target.closest('.comment__vote');
            if (!voteWrapper) return;

            const voteValue = voteWrapper.querySelector('.comment__vote-value');
            if (!voteValue) return;

            let value = +voteValue.textContent.trim();

            if (isUp) {
                value++;
            } else {
                value--;
            }

            voteValue.textContent = value;
        }
    })
}

function setSubmitCommentListener(currentUser, currentId) {
    const commentSection = document.querySelector('.comment__section');
    commentSection.addEventListener('click', (event) => {
        if (event.target.closest('#submit')) {
            const commentForm = event.target.closest('form.new-comment');
            commentForm.addEventListener('submit', (event) => {
                event.preventDefault();
            })

            const commentText = commentForm.querySelector('textarea').value;

            const newComment = {
                id: currentId++,
                content: commentText,
                createdAt: "Just now",
                score: 0,
                user: currentUser,
                replies: []
            }

            const comment = createCommentElement(newComment, currentUser);
            commentSection.insertBefore(comment, commentForm);
        }
    })
}

function textAreaAutoGrow() {
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => {
        const resize = () => {
            textArea.style.height = 'auto';
            textArea.style.height = textArea.scrollHeight + 'px';

        };
        textArea.addEventListener('input', resize);
        resize();
    })
}

async function init() {
    const data = await loadData();
    let currentId = 4;
    renderComment(data.comments, data.currentUser);
    setupReplyListener(data.currentUser);
    setupEditListener();
    setDeleteListener();
    setVoteListener();
    setSubmitCommentListener(data.currentUser, currentId);
    textAreaAutoGrow();
}


init();