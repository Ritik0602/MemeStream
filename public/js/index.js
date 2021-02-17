
$(document).ready(() => {

    $(".post-meme").click(() => {
        $(".submit-meme").slideToggle();
    });

    for(var i = 1; i <= 3; i++) {
        $(".container section:nth-child(" + i + ")").addClass("first-three-memes");
    }
});
