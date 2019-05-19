function like(postId) {
  if (!postId) {
    return;
  }
  var likes = document.getElementById('likes-' + postId);
  likes.innerHTML = +likes.innerHTML + 1;

  fetch('/like/' + postId).catch(console.error);
}

function back() {
  location = location.protocol + '//' + location.host
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
  }).catch(console.error);
}
