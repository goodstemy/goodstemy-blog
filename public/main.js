function like(postId) {
  if (!postId) {
    return;
  }
  var likes = document.getElementById('likes-' + postId);
  likes.innerHTML = +likes.innerHTML + 1;
  var likeButton = document.getElementById('like-button');
  likeButton.style.transform = 'scale(1.3)';

  fetch('/like/' + postId).then(() => {
    setTimeout(() => {
      likeButton.style.transform = 'scale(1)';
    }, 100);
  }).catch(console.error);
}

function back() {
  location = location.protocol + '//' + location.host
}

function redirectCreatePost() {
  location = location.protocol + '//' + location.host + '/post/create'
}

function comment(postId) {
  if (!postId) {
    return;
  }

  var sender = document.getElementById('nameField').value;
  var text = document.getElementById('commentField').value;

  console.log(text);
  if (!text) {
    return;
  }

  fetch('/comment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({sender: sender || 'Anonymous', text, postId})
  }).then(() => location.reload()).catch(console.error);
}

function addPost() {
  var title = document.getElementById('postTitle').value,
      description = document.getElementById('postDesc').value,
      body = document.getElementById('postBody').value;

  if (!title || !body) {
    alert('Oops! You should write an post title and body firstly');
    return;
  }

  fetch('/post/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title, description: description || '', body})
  }).then((res) => {
    if (res.status === 200) {
      back()
    }
  }).catch(console.error);
}

function openModal() {
  var modalWindow = document.getElementById('modal');

  modalWindow.style.display = 'block';
}

function closeModal() {
  var modalWindow = document.getElementById('modal');

  modalWindow.style.display = 'none';
}
