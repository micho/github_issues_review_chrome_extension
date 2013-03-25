/**
 * When in the PR view, record if we see a :+1: from my user
 */

$(function () {

  // ["/teambox/Teambox-hosted/pull/1155", "teambox", "Teambox-hosted", "1155"]
  var matches = location.pathname.match(/\/(.*?)\/(.*?)\/pull\/(\d+)/)
    , pr_key = location.pathname;

  // Not a PR URL? GTFO
  if (!matches) {
    return;
  }

  // Count votes by others
  function usersWhoVoted() {
    var voted_by = []
      , my_username = $("#user-links a.name").text().trim();

    $(".comment-header-author").each(function () {
      if ($(this).parents(".discussion-bubble-inner").find("img[title=':+1:']").length) {
        voted_by.push($(this).text());
      }
    });

    return _(voted_by).uniq();
  }

  // Persist the array of users who voted
  function saveVotesCount() {
    var hash = {};
    hash[pr_key] = usersWhoVoted();
    chrome.storage.sync.set(hash);
  }

  saveVotesCount();
  // Dirty, but it works: update after submitting a comment
  $("form").submit(function () {
    setTimeout(function () {
      saveVotesCount();
    }, 2000);
  });

});

