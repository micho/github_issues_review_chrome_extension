/*globals chrome*/

/**
 * Remember PRs I've seen and display them in the issues view
 */

$(function () {

  // ["/teambox/Teambox-hosted/issues", "teambox", "Teambox-hosted"]
  var matches = location.pathname.match(/\/(.*?)\/(.*?)\/issues/)
    , my_username = $("#user-links a.name").text().trim();

  // If this is not the Issues view, GTFO
  if (!matches) {
    return;
  }

  function annotateIssues() {
    // For each issue, add an approval count
    $(".js-issues-list").find("a.js-navigation-open:not(.already-annotated)").each(function () {
      var $a = $(this)
        , href = $a.attr('href');

      $a.addClass('already-annotated');

      // Get data from chrome.storage (which is populated by pull.js when viewing a PR)
      chrome.storage.sync.get(href, function (data) {
        var voters = data[href] || []
          , other_voters = _(voters).without(my_username)
          , $thumbsup = $('<img class="emoji" title=":+1:" alt=":+1:" src="/images/icons/emoji/+1.png" height="16" width="16" align="absmiddle"/>')
          , $list_item = $a.parents('.issue-list-item');

        // Add my own thumb if I already approved this PR
        if (voters.indexOf(my_username) !== -1) {
          $thumbsup.attr({ title: voters.join(", ") });
          $list_item.find('.list-group-item-meta').append($thumbsup);
        }

        // Show the count of other people's votes
        if (other_voters.length) {
          var $p = $('<li>+&nbsp;' + other_voters.length + '</li>');

          $p.attr({ title: voters.join(", ") });

          // If more than 2 people voted it, color it green and push it to the bottom
          if (other_voters.length >= 2) {
            $list_item.css({ 'background-color': 'rgba(0, 255, 0, 0.1)' });
            $list_item.parents('.issue-list-group').append($list_item);
          }

          // Add number of votes
          $list_item.find('.list-group-item-meta').append($p);
        }
      });
    });
  }

  annotateIssues();
  // Dirty, but it works: update when changing Issues filters
  setInterval(function () {
    annotateIssues();
  }, 500);

});
