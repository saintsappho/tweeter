/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => { // doc ready starts here

  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////                        on button press                                   ////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  addEventListener('submit', (event) => {
    event.preventDefault();
    const text = $('#tweet-text');
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////                        error handling                                   ////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    if (text.val().length > 140) {
      showError("Your tweet is too long! Please reconsider!");
      return;
    }
    
    if (text.val().length <= 0) {
      showError("Your tweet is missing! Try again!");
      return;
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////                        posting new tweet                                   ////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const data = $("#new-tweet-form").serialize();
    
    $.post('/tweets', data)
    .then(function() {
      $('#tweet-text').val('');
      loadTweets();
    })
    .catch((error) => {
      showError("error fetching tweets.", error);
    });
    return;
    
  });
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////                    calling function, get the ball rolling                              ////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  loadTweets();
  
  function showError(errorMessage) {
    const errorPrinter = $('#error-printer');
    errorPrinter.text(errorMessage);
    errorPrinter.slideDown();
    setTimeout(() => { errorPrinter.slideUp(); }, 5000);
  }
  
}); // doc ready ends here

////////////////////////////////////////////////////////////////////////////////////////////////
////                    Breaking XSS attacks                              ////
////////////////////////////////////////////////////////////////////////////////////////////////
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

////////////////////////////////////////////////////////////////////////////////////////////////
////                    Loading tweets from data                              ////
////////////////////////////////////////////////////////////////////////////////////////////////
const loadTweets = function() {
  $.get('/tweets')
  .then((data) => {
    renderTweets(data);
  })
  .catch((error) => {
    alert("error getting tweets.", error);
  });
  return;
};

////////////////////////////////////////////////////////////////////////////////////////////////
////                    Rendering tweets into HTML                              ////
////////////////////////////////////////////////////////////////////////////////////////////////
const renderTweets = function(tweets) {
  const allTweets = $('.all-tweets');
  $('.counter').val(140);

  allTweets.empty(); // ensure no duplication of prior tweets. 

  tweets.forEach(thistweet => {
    const tweet = createTweetElement(thistweet);
    allTweets.prepend(tweet);
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////
////                    Turning data into HTML tweet                              ////
////////////////////////////////////////////////////////////////////////////////////////////////
const createTweetElement = function(tweet) {
  const ago = timeago.format(tweet.created_at);
  const $tweet = `
  <article class="tweet-box">
    <header>
      <div class="user-profile"><img src="${tweet.user.avatars}" alt="Profile Picture"><span>${tweet.user.name}</span></div>
      <div class="user-tag"><span>${tweet.user.handle}</span></div>
    </header>
    <div class="tweet-content">
      <p>
        ${escapeHtml(tweet.content.text)}
      </p>
    </div>
    <footer>
      <time class="tweet-box-time">${ago}</time>
      <div class="reactions">
        <div class="reaction"><i class="fa-regular fa-flag"></i></div>
        <div class="reaction"><i class="fa-solid fa-retweet"></i></div>
        <div class="reaction"><i class="fa-regular fa-heart"></i></div>
      </div>
    </footer>
  </article>`;

  return $tweet;
};



