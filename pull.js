/*globals chrome*/

/**
 * When in the PR view, record if we see a :+1: from my user
 */

(function () {

  // ["/teambox/Teambox-hosted/pull/1155", "teambox", "Teambox-hosted", "1155"]
  var matches = location.pathname.match(/\/(.*?)\/(.*?)\/pull\/(\d+)/)
    , pr_key = location.pathname;

  // Not a PR URL? GTFO
  if (!matches) {
    return;
  }

  // Count votes by others
  function usersWhoVoted() {
    var voted_by = [];

    $(".comment-header-author").each(function () {
      if ($(this).parents(".discussion-bubble-inner").find("img[title=':+1:']").length) {
        voted_by.push($(this).text());
      }
    });

    return _(voted_by).uniq();
  }

  // Persist the array of users who voted (only if different, to avoid quota limits)
  function saveVotesCount() {
    var hash = {};
    hash[pr_key] = usersWhoVoted();
    chrome.storage.sync.get(pr_key, function (stored) {
      console.log(hash[pr_key], stored[pr_key], hash[pr_key] !== stored[pr_key]);
      if (hash[pr_key] !== stored[pr_key]) {
        chrome.storage.sync.set(hash);
      }
    });
  }

  $(function () {
    saveVotesCount();

    // Dirty, but it works: update after submitting a comment
    $("form").submit(function () {
      setTimeout(function () {
        saveVotesCount();
      }, 2000);
    });

    // Save when closing window
    $(window).unload(function () {
      saveVotesCount();
    });
  });

}());

