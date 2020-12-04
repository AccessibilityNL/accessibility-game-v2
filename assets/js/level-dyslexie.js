/* 

    Dyslexie level script
    for Accessibility Game

*/

var dyslexie = {

    $text: undefined,
    $content: undefined,
    $questions: undefined,

    setup: function() {
        this.$text = $('#text');
        this.$content = $('#content');
        this.$questions = $('#questions');

        this.setupText();
    },


    setupText: function() {
        // change each charater to it's own element
        this.$content.children().each((_, elem) => {
            let charArray = elem.innerHTML.split('');
            elem.innerHTML = '';
            charArray.forEach(c => {
                elem.innerHTML += '<span>' + c + '</span>';
            });

            // save original text in data attribute
            $(elem).children().each((_, e) => {

                $(e).attr('data-original-text', e.innerHTML);

            })

            // randomly add transform
            $(elem).children().each((_, e) => {
                if (Math.random() < 0.2 && e.innerHTML !== ' ') {
                        $(e).addClass('flip')
                }
            });
        });

        // trigger update every x ms
        setInterval(this.updateText, 700);
    },

    updateText: function() {
        const CHANCE = 0.03;
        const CHANCE_FLIP = 0.2;

        // in each element in #content
        dyslexie.$content.children().each((_, elem) => {
            // for each character
            $(elem).children().each((index, c) => {

                // first reset
                const originalText = $(c).attr('data-original-text');
                        $(c).removeClass('flip');
                        if (originalText && c.innerHTML !== originalText) 
                            c.innerHTML = originalText;

                if (c.innerHTML !== ' ') {
                    if (Math.random() < CHANCE) { // change char order

                        if (Math.random() < 0.5) {
                            c.innerHTML = $(elem).children().eq(index+1).html();
                        } else {
                            c.innerHTML = $(elem).children().eq(index-1).html();
                        }

                        if (c.innerHTML == 'undefined') c.innerHTML = originalText;

                    } else if (Math.random() < CHANCE_FLIP) { // add flip class
                        $(c).addClass('flip');
                    }
                }

            });
        })
    },

    changePage: function() {
        console.log('clicked');
        $('#level').toggleClass('on-questions');
    },

    checkQuestions: function() {
        let correct = true;
        // for each input field
        $('#questions input[type=field]').each((_, q) => {

            if (q.value.toLowerCase() !== reverse($(q).attr('data-correct')).toLowerCase()) {  // incorrect

                correct = false;
                $(q).addClass('incorrect');

                // add incorrect class to corresponding label
                $('#questions label[for=' + $(q).attr('id') + ']').addClass('incorrect');

            } else { // correct

                // remove incorrect class
                $(q).removeClass('incorrect');
                // remove incorrect class from corresponding label
                $('#questions label[for=' + $(q).attr('id') + ']').removeClass('incorrect');

            }

        });

        // go to next page if all questions are correct
        if (correct) {
            showScore(200); // TODO: calc score
        }
    }

}

// Delete after level is complete
function unload() {
    delete dyslexie;
    dyslexie.clearInterval(updateText);
}

// GO
dyslexie.setup();