/*
 * angular-dragon-drop v0.3.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.dragon-drop', []).
  directive('btfDragon', function ($document, $compile, $rootScope) {
    /*
             ^                       ^
             |\   \        /        /|
            /  \  |\__  __/|       /  \
           / /\ \ \ _ \/ _ /      /    \
          / / /\ \ {*}\/{*}      /  / \ \
          | | | \ \( (00) )     /  // |\ \
          | | | |\ \(V""V)\    /  / | || \| 
          | | | | \ |^--^| \  /  / || || || 
         / / /  | |( WWWW__ \/  /| || || ||
        | | | | | |  \______\  / / || || || 
        | | | / | | )|______\ ) | / | || ||
        / / /  / /  /______/   /| \ \ || ||
       / / /  / /  /\_____/  |/ /__\ \ \ \ \
       | | | / /  /\______/    \   \__| \ \ \
       | | | | | |\______ __    \_    \__|_| \
       | | ,___ /\______ _  _     \_       \  |
       | |/    /\_____  /    \      \__     \ |    /\
       |/ |   |\______ |      |        \___  \ |__/  \
       v  |   |\______ |      |            \___/     |
          |   |\______ |      |                    __/
           \   \________\_    _\               ____/
         __/   /\_____ __/   /   )\_,      _____/
        /  ___/  \uuuu/  ___/___)    \______/
        VVV  V        VVV  V 
    */
    // this ASCII dragon is really important, do not remove

    var dragValue,
      dragKey,
      dragOrigin,
      dragOriginElement,
      dragDuplicate = false,
      dragAwaitingMove = false,
      floaty,
      offsetX,
      offsetY;

    var drag = function (ev) {
      if (!floaty) return;
      ev.preventDefault();
      var x = (ev.clientX || ev.originalEvent.touches[0].clientX) - offsetX,
          y = (ev.clientY || ev.originalEvent.touches[0].clientY) - offsetY;

      floaty.css('left', x + 'px');
      floaty.css('top', y + 'px');
    };


   
    var remove = function (collection, index) {
      if (collection instanceof Array) {
        return collection.splice(index, 1);
      } else {
        var temp = collection[index];
        delete collection[index];
        return temp;
      }
    };

    var add = function (collection, item, key) {
      if (collection instanceof Array) {
        collection.push(item);
      } else {
        collection[key] = item;
      }
    };

    var documentBody = angular.element($document[0].body);

    var disableSelect = function () {
      documentBody.css({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
      });
    };

    var enableSelect = function () {
      documentBody.css({
        '-moz-user-select': '',
        '-khtml-user-select': '',
        '-webkit-user-select': '',
        '-ms-user-select': '',
        'user-select': ''
      });
    };

    var killFloaty = function () {
      if (floaty) {
        $document.unbind('touchmove mousemove', drag);
        floaty.remove();
        floaty = null;
      }
    };

    var getElementOffset = function (elt) {

      var box = elt.getBoundingClientRect();
      var body = $document[0].body;

      var xPosition = box.left + body.scrollLeft;
      var yPosition = box.top + body.scrollTop;

      return {
        left: xPosition,
        top: yPosition
      };
    };

    // Get the element at position (`x`, `y`) behind the given element
    var getElementBehindPoint = function (behind, x, y) {
      var originalDisplay = behind.css('display');
      behind.css('display', 'none');

      var element = angular.element($document[0].elementFromPoint(x, y));

      behind.css('display', originalDisplay);

      return element;
    };

    $document.bind('touchend mouseup', function (ev) {
      dragAwaitingMove = false;
      if (!dragValue) {
        return;
      }

      var dropArea = getElementBehindPoint(floaty, (ev.clientX || ev.originalEvent.changedTouches[0].clientX), (ev.clientY || ev.originalEvent.changedTouches[0].clientY));

      var accepts = function () {
        return dropArea.attr('btf-dragon') &&
        ( !dropArea.attr('btf-dragon-accepts') ||
          dropArea.scope().$eval(dropArea.attr('btf-dragon-accepts'))(dragValue) );
      };

      while (dropArea.length > 0 && !accepts()) {
        dropArea = dropArea.parent();
      }

      dragOriginElement.css("display", "");
      dragOriginElement.removeClass("btf-dragon-origin");
      if (dropArea.length > 0) {
        var expression = dropArea.attr('btf-dragon');
        var targetScope = dropArea.scope();
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);

        var targetList = targetScope.$eval(match[2]);

        $rootScope.$apply(function () {
            if (!dragDuplicate) {
              remove(dragOrigin, dragKey || dragOrigin.indexOf(dragValue));
            }          
          add(targetList, dragValue, dragKey);
        });
      } else if (!dragDuplicate) {
        // no dropArea here
        // put item back to origin
        $rootScope.$apply(function () {
            remove(dragOrigin, dragKey || dragOrigin.indexOf(dragValue));
            add(dragOrigin, dragValue, dragKey);
        });
      }

      dragValue = dragOrigin = null;
      killFloaty();
    });

    return {
      restrict: 'A',

      compile: function (container, attr) {

        // get the `thing in things` expression
        var expression = attr.btfDragon;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);
        if (!match) {
          throw Error("Expected btfDragon in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        var lhs = match[1];
        var rhs = match[2];

        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);

        var valueIdentifier = match[3] || match[1];
        var keyIdentifier = match[2];

        // pull out the template to re-use.
        // Improvised ng-transclude.
        var template = container.html();

        // wrap text nodes
        try {
          template = angular.element(template.trim());
          if (template.length === 0) {
            throw new Error('');
          }
        }
        catch (e) {
          template = angular.element('<span>' + template + '</span>');
        }
        var child = template.clone();
        child.attr('ng-repeat', expression);

        container.html('');
        container.append(child);

        var duplicate = container.attr('btf-double-dragon') !== undefined;

        return function (scope, elt, attr) {

          var accepts = scope.$eval(attr.btfDragonAccepts);

          if (accepts !== undefined && typeof accepts !== 'function') {
            throw Error('Expected btfDragonAccepts to be a function.');
          }

          var spawnFloaty = function () {
            scope.$apply(function () {
              floaty = template.clone();
              floaty.css('position', 'fixed');

              floaty.css('margin', '0px');
              floaty.css('z-index', '99999');
              floaty.addClass("btf-dragon-dragging");
              var floatyScope = scope.$new();
              floatyScope[valueIdentifier] = dragValue;
              if (keyIdentifier) {
                floatyScope[keyIdentifier] = dragKey;
              }
              $compile(floaty)(floatyScope);
              documentBody.append(floaty);
              $document.bind('touchmove mousemove', drag);
              disableSelect();
            });
          };

          var startDrag = function (ev) {
            if (dragValue) {
              return;
            }
            elt.unbind('touchmove mousemove', startDrag);
            
            if (!dragAwaitingMove) {
              return;
            }
            // find the right parent
            var originElement = angular.element(ev.target);
            var originScope = originElement.scope();

            while (originScope[valueIdentifier] === undefined) {
              originScope = originScope.$parent;
              if (!originScope) {
                return;
              }
            }

            while (!$(originElement).parent().is("[btf-dragon]")) {
              originElement = originElement.parent();
            }
            dragOriginElement = originElement;

            dragValue = originScope[valueIdentifier];
            dragKey = originScope[keyIdentifier];
            if (!dragValue) {
              return;
            }

            // get offset inside element to drag
            var offset = getElementOffset(ev.target);

            dragOrigin = scope.$eval(rhs);
            if (duplicate) {
              dragValue = angular.copy(dragValue);
            } 
            dragDuplicate = duplicate;

            offsetX = ((ev.pageX || ev.originalEvent.touches[0].pageX) - offset.left);
            offsetY = ((ev.pageY || ev.originalEvent.touches[0].pageY) - offset.top);

            spawnFloaty();
            drag(ev);
            if (!duplicate) {
              // hide the dragged element - we can't actually remove it because that would stop the touchmove events
              originElement.css("display", "none");
              originElement.addClass("btf-dragon-origin");
            }
          };

          elt.bind('touchstart mousedown', function (ev) {
            if (dragValue) {
              return;
            }
            dragAwaitingMove = true;
            elt.bind('touchmove mousemove', startDrag);

          });
        };
      }
    };
  });