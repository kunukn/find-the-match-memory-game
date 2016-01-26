;

(() => {

    /**
     * Randomize array element order in-place.
     * Durstenfeld shuffle algorithm.   
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    let
        selected1,
        selected2;

    // http://unicode.org/emoji/charts/full-emoji-list.html
    const iconAnimals = [
        '\uD83D\uDC35',
        '\uD83D\uDC36',
        '\uD83D\uDC3A',
        '\uD83D\uDC31',
        '\uD83D\uDC2F',
        '\uD83D\uDC34',
        '\uD83D\uDC2E',
        '\uD83D\uDC37',
        '\uD83D\uDC17',
        '\uD83D\uDC2D',
        '\uD83D\uDC39',
        '\uD83D\uDC30',
        '\uD83D\uDC3B',
        '\uD83D\uDC28',
        '\uD83D\uDC3C',
        '\uD83D\uDC14',
        '\uD83D\uDC24',
        '\uD83D\uDC26',
        '\uD83D\uDC27',
        '\uD83D\uDC38'
    ];
    const iconFruits = [
        '\uD83C\uDF47',
        '\uD83C\uDF48',
        '\uD83C\uDF49',
        '\uD83C\uDF4A',
        '\uD83C\uDF4B',
        '\uD83C\uDF4C',
        '\uD83C\uDF4D',
        '\uD83C\uDF4E',
        '\uD83C\uDF4F',
        '\uD83C\uDF51',
        '\uD83C\uDF52',
        '\uD83C\uDF53'
    ];
    let icons = iconAnimals;

    let app = angular
        // Using ngTouch to remove the 300ms click delay on mobile devices
        .module('app', ['ngRoute', 'ngAnimate', 'ngTouch'])
        .controller('appController', function($scope, $timeout, $animate) {

            // This is a prototype, everything is in this controller.
            // For cleaner code you probably would refactor stuff out from here.

            $timeout(() => {
                // Angular DOM has finished rendering
                $scope.appReady = true;
            });

            function showAllCards() {
                $scope.list.forEach((card) => {
                    $("#card-" + card.id).flip(true);
                });
            }

            function startNewGame() {

                shuffleArray(icons); // randomize displayed icons        
                $animate.enabled(false); // disable remove animation

                let list = [],
                    cardCount = 16;
                for (var i = 1; i <= cardCount; i++) {
                    let type = (i % (cardCount / 2)) + 1;
                    list.push({
                        id: i,
                        type: type,
                        icon: icons[type - 1],
                        theme: 'theme' + type,
                        isKnown: false
                    });
                }

                shuffleArray(list); // randomize card on the board

                // Update state
                selected1 = selected2 = null;
                $scope.clickCount = 0;
                $scope.list = list;
                $scope.cardsLeft = list.length;
                $scope.gameCompleted = false;
                $scope.titleAction = () => {                 
                    $scope.changeIcons();
                };
                $scope.changeIcons = () => {
                    icons = icons === iconFruits ? iconAnimals : iconFruits;
                };

                $timeout(() => {
                    // Angular DOM has finished rendering

                    // Apply flip to the cards in the DOM
                    let $card = $(".app__cards-container__card");
                    $card.flip({
                        axis: 'y',
                        trigger: 'manual',
                        reverse: true
                    }, () => {
                        //callback
                    });

                    //showAllCards(); // debug
                    $animate.enabled(true); // re-enable animation                    
                });
            }

            $scope.clickCount = 0;
            $scope.cardsLeft = 0;
            $scope.gameCompleted = false;
            $scope.restart = () => {
                startNewGame();
            };

            $scope.click = function(card, index) {

                if (card.flipped) return; // dont allow to flip already flipped cards

                $scope.clickCount++;

                // Update state
                card.flipped = true;
                selected2 = selected1;
                selected1 = card;

                // Update UI
                $("#card-" + card.id).flip(true); // use flip api

                if (selected1 && selected2 && selected1.type === selected2.type) {
                    // We found a match

                    $scope.list.splice($scope.list.indexOf(selected1), 1);
                    $scope.list.splice($scope.list.indexOf(selected2), 1);
                    selected1 = selected2 = null;

                    $scope.cardsLeft = $scope.list.length;

                    if ($scope.list.length === 0) {
                        // We have finished the game
                        $scope.gameCompleted = true;
                    }

                    return;
                }

                if (selected2) {

                    // Flip back the 2nd shown card

                    let id = selected2.id;
                    ((id) => {
                        $timeout(() => {
                            $scope.list.forEach((card) => {
                                if (card.id === id) {
                                    // Update state
                                    card.flipped = false;
                                    card.isKnown = true;
                                }
                            });

                            $("#card-" + id).flip(false); // use flip api

                        }, 800);
                    })(id);
                }
            }

            startNewGame();
        });

})();