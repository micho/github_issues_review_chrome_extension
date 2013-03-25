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
    $(".js-issues-list").find("a.js-navigation-open").each(function () {
      var $a = $(this)
        , href = $a.attr('href');

      // Don't process twice
      if ($a.hasClass('already-annotated')) {
        return;
      }
      $a.addClass('already-annotated');

      // Get data from chrome.storage (which is populated by pull.js when viewing a PR)
      chrome.storage.sync.get(href, function (data) {
        var voters = data[href] || []
          , other_voters = _(voters).without(my_username)
          , $p = $('<p style="position: absolute; right: -25px; top: 10px; "><img class="emoji" title=":+1:" alt=":+1:" src="https://a248.e.akamai.net/assets.github.com/images/icons/emoji/+1.png" height="20" width="20" align="absmiddle"></p>');

        // Add my own thumb if I already approved this PR
        if (voters.indexOf(my_username) !== -1) {
          $a.parents('.info-wrapper').append($p);
          $p.find('img').attr({ title: voters.join(", ") });
        }

        // Show the count of other people's votes
        if (other_voters.length) {
          var $list_item = $a.parents('.list-browser-item')
            , $p = $('<p style="position: absolute; right: -57px; top: 10px; font-size: 18px; cursor: default;">+ ' + other_voters.length + '</p>');

          $p.attr({ title: voters.join(", ") });

          // If more than 2 people voted it, color it green and push it to the bottom
          if (other_voters.length >= 2) {
            $list_item.css({ 'background-color': 'rgba(0, 255, 0, 0.1)' });
            $list_item.parents('tbody').append($list_item);
          }

          // Add number of votes
          $a.parents('.info-wrapper').append($p);
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
