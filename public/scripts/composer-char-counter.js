$(document).ready(() => {

  $('#tweet-text').on('input', function() {

    const textArea = $(this);

    const length = textArea.val().length;
    const remaining = 140 - length;
    const form = textArea.closest('form');
    const counter = form.find('.counter');
    counter.text(remaining);
    if (remaining < 0) {
      counter.addClass('warning');
    } else {
      counter.removeClass('warning');
    }
  });

});
