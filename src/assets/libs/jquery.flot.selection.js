(function ($) {
    function init(plot) {
        var selection = {
            start: -1,
            end: -1,
            show: false
        };

        var savedhandlers = {};

        var mouseUpHandler = null;

        function isLeft(slider, posX) {
            return slider.left.x < posX && posX < (slider.left.x + slider.left.w * 2);
        }

        function isInner(slider, posX) {
            return slider.inner.x < posX && posX < (slider.inner.x + slider.inner.w);
        }

        function isRight(slider, posX) {
            return slider.right.x < posX && posX < (slider.right.x + slider.right.w * 2);
        }

        function getOffset(slider, posX, type) {
            return posX - slider[type].x;
        }

        function determineDragging(slider, posX) {
            if (isInner(slider, posX)) {
                selection.dragging = 'inner';
                selection.offsetLeft = getOffset(slider, posX, 'inner');
            }
            if (isLeft(slider, posX)) {
                selection.dragging = 'left';
                selection.offsetLeft = getOffset(slider, posX, 'left');
            }
            if (isRight(slider, posX)) {
                selection.dragging = 'right';
                selection.offsetLeft = getOffset(slider, posX, 'right');
            }
        }

        function onMouseMove(e) {
            if (selection.dragging) {
                if (e.originalEvent.touches && e.originalEvent.touches[0]) {
                    updateSelection(e.originalEvent.touches[0].pageX);
                } else {
                    updateSelection(e.pageX);
                }
            }
        }

        function onMouseDown(e) {
            // cancel out any text selections
            document.body.focus();

            // prevent text selection and drag in old-school browsers
            if (document.onselectstart !== undefined && savedhandlers.onselectstart === null) {
                savedhandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () {
                    return false;
                };
            }
            if (document.ondrag !== undefined && savedhandlers.ondrag === null) {
                savedhandlers.ondrag = document.ondrag;
                document.ondrag = function () {
                    return false;
                };
            }

            var mouseX = getPositionInPlot(e.pageX || e.originalEvent.touches[0].pageX);

            determineDragging(selection.slider, mouseX);

            mouseUpHandler = function (e) {
                onMouseUp(e);
            };

            $(document).one('mouseup touchend', mouseUpHandler);
        }

        function onMouseUp(e) {
            mouseUpHandler = null;

            // revert drag stuff for old-school browsers
            if (document.onselectstart !== undefined)
                document.onselectstart = savedhandlers.onselectstart;
            if (document.ondrag !== undefined)
                document.ondrag = savedhandlers.ondrag;

            selection.dragging = null;

            // no more dragging
            updateSelection(e);

            if (isSelectionValid())
                triggerSelectedEvent();
            else {
                // this counts as a clear
                plot.getPlaceholder().trigger('plotunselected', []);
                plot.getPlaceholder().trigger('plotselecting', [null]);
            }

            return false;
        }

        function getSelection() {
            if (!isSelectionValid())
                return null;

            if (!selection.show)
                return null;

            var r = {};
            $.each(plot.getXAxes(), function (name, axis) {
                if (axis.used) {
                    var p1 = axis.c2p(selection.start), p2 = axis.c2p(selection.end);
                    r.xaxis = { from: Math.min(p1, p2), to: Math.max(p1, p2) };
                }
            });
            return r;
        }

        function triggerSelectedEvent() {
            var r = getSelection();
            plot.getPlaceholder().trigger('plotselected', [r]);
        }

        function clamp(min, value, max) {
            return value < min ? min : (value > max ? max : value);
        }

        function getPositionInPlot(posX) {
            var offset = plot.getPlaceholder().offset();
            var plotOffset = plot.getPlotOffset();
            return clamp(0, posX - offset.left - plotOffset.left, plot.width());
        }

        function updateSelection(pageX) {
            if (pageX === null)
                return;

            if (selection.dragging === 'left') {
                selection.start = getPositionInPlot(pageX - selection.offsetLeft);
                if (!isSelectionValid())
                    selection.start = selection.end - plot.getOptions().selection.minSize;
            }

            if (selection.dragging === 'right') {
                selection.end = getPositionInPlot(pageX - selection.offsetLeft);
                if (!isSelectionValid())
                    selection.end = selection.start + plot.getOptions().selection.minSize;
            }

            if (selection.dragging === 'inner') {
                var width = selection.end - selection.start;
                selection.start = getPositionInPlot(pageX - selection.offsetLeft);
                selection.end = getPositionInPlot(pageX - selection.offsetLeft + width);
                if (selection.start <= 0) {
                    selection.start = 0;
                    selection.end = selection.start + width;
                }
                if (selection.end >= plot.width()) {
                    selection.end = plot.width();
                    selection.start = selection.end - width;
                }
            }

            if (isSelectionValid()) {
                plot.triggerRedrawOverlay();
            }
        }

        function clearSelection(preventEvent) {
            if (selection.show) {
                selection.show = false;
                plot.triggerRedrawOverlay();
                if (!preventEvent)
                    plot.getPlaceholder().trigger('plotunselected', []);
            }
        }

        // function taken from markings support in Flot
        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = plot.getAxes();

            for (var k in axes) {
                axis = axes[k];
                if (axis.direction == coord) {
                    key = coord + axis.n + 'axis';
                    if (!ranges[key] && axis.n == 1)
                        key = coord + 'axis'; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == 'x' ? plot.getXAxes()[0] : plot.getYAxes()[0];
                from = ranges[coord + '1'];
                to = ranges[coord + '2'];
            }

            // auto-reverse as an added bonus
            if (from !== null && to !== null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function setSelection(ranges, preventEvent) {
            var range, o = plot.getOptions();

            if (o.selection.mode == 'overview') {
                range = extractRange(ranges, 'x');
                selection.start = range.axis.p2c(range.from);
                selection.end = range.axis.p2c(range.to);
            }

            selection.show = true;
            plot.triggerRedrawOverlay();
            if (!preventEvent && isSelectionValid())
                triggerSelectedEvent();
        }

        function isSelectionValid() {
            var minSize = plot.getOptions().selection.minSize;
            return selection.end - selection.start >= minSize;
        }

        plot.clearSelection = clearSelection;
        plot.setSelection = setSelection;
        plot.getSelection = getSelection;

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            var o = plot.getOptions();
            if (o.selection.mode !== null) {
                eventHolder.bind('mousemove touchmove', onMouseMove);
                eventHolder.bind('mousedown touchstart', onMouseDown);
            }
        });

        plot.hooks.drawOverlay.push(function (plot, ctx) {
            if (selection.show) {
                var plotOffset = plot.getPlotOffset();
                var o = plot.getOptions();

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                var c = $.color.parse(o.selection.color);

                ctx.strokeStyle = c.scale('a', 0.8).toString();
                ctx.lineWidth = 6;
                ctx.lineJoin = o.selection.shape;
                ctx.fillStyle = c.scale('a', 0.4).toString();

                var x = selection.start;
                var y = Math.min(0, plot.height()) + 0.5;
                var w = selection.end - selection.start;
                var h = Math.abs(plot.height() - 0) - 1;
                var left = { x: x, y: y, w: 5, h: h },
                    right = { x: x + w - 5, y: y, w: 5, h: h },
                    inner = { x: x, y: y, w: w, h: h };
                selection.slider = {
                    left: left, right: right, inner: inner
                };
                ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
                ctx.strokeRect(left.x, left.y, left.w, left.h);
                ctx.strokeRect(right.x, right.y, right.w, right.h);
                ctx.restore();
            }
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind('mousemove', onMouseMove);
            eventHolder.unbind('mousedown', onMouseDown);
            if (mouseUpHandler)
                $(document).unbind('mouseup', mouseUpHandler);
        });

    }

    $.plot.plugins.push({
        init: init,
        options: {
            selection: {
                mode: null, // one of null, 'x', 'y' or 'xy'
                color: '#e8cfac',
                shape: 'round', // one of 'round', 'miter', or 'bevel'
                minSize: 5 // minimum number of pixels
            }
        },
        name: 'selection',
        version: '1.1'
    });
})(jQuery);