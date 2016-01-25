'use strict';
;
(function () {
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {            
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;        
    }
    var selected1 = undefined, selected2 = undefined;
    var icons = [
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
        '\uD83D\uDC38',
        '\uD83D\uDC32'
    ];
    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ngTouch'
    ]).controller('appController', function ($scope, $timeout, $animate) {
        $timeout(function () {
            $scope.appReady = true;
        });
        function showAllCards() {
            $scope.list.forEach(function (card) {
                $('#card-' + card.id).flip(true);
            });
        }
        function startNewGame() {
            shuffleArray(icons);
            $animate.enabled(false);
            var list = [], cardCount = 16;
            for (var i = 1; i <= cardCount; i++) {                
                var type = i % (cardCount / 2) + 1;
                list.push({
                    id: i,
                    type: type,
                    icon: icons[type - 1],
                    theme: 'theme' + type,
                    isKnown: false
                });
            }            
            shuffleArray(list);
            selected1 = selected2 = null;
            $scope.clickCount = 0;
            $scope.list = list;
            $scope.cardsLeft = list.length;
            $scope.gameCompleted = false;
            $timeout(function () {
                $animate.enabled(true);
                var $card = $('.app__cards-container__card');
                $card.flip({
                    axis: 'y',
                    trigger: 'manual',
                    reverse: true
                }, function () {
                });
            });
        }
        $scope.clickCount = 0;
        $scope.cardsLeft = 0;
        $scope.gameCompleted = false;
        $scope.restart = function () {
            startNewGame();
        };
        $scope.click = function (card, index) {
            if (card.flipped)
                return;
            $scope.clickCount++;
            card.flipped = true;
            selected2 = selected1;
            selected1 = card;
            $('#card-' + card.id).flip(true);
            if (selected1 && selected2 && selected1.type === selected2.type) {
                $scope.list.splice($scope.list.indexOf(selected1), 1);
                $scope.list.splice($scope.list.indexOf(selected2), 1);
                selected1 = selected2 = null;
                $scope.cardsLeft = $scope.list.length;
                if ($scope.list.length === 0) {
                    $scope.gameCompleted = true;
                }
                return;
            }
            if (selected2) {
                var id = selected2.id;
                (function (id) {
                    $timeout(function () {
                        $scope.list.forEach(function (card) {
                            if (card.id === id) {
                                card.flipped = false;
                                card.isKnown = true;
                            }
                        });
                        $('#card-' + id).flip(false);
                    }, 800);
                }(id));
            }
        };
        startNewGame();
    });
}());