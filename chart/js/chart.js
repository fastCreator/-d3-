"use strict";
function Chart(option) {
    var that = this;
    var svg, opt, conf, arc, list = [], lines = [[], [], []], scaleX = 0.6, scaleY = 0.6, random, rootpos, numb2 = 0, numb3 = 0, detilG,detilG2, hideary = [], t = [], inter = [];
    /***********************导出方法*****************************/
    this.setClose = function (n) {
        hideary = [];
        if (n < 0 || n > 3) return false;
        n == 3 ? (hideary = []) : (DataUtils.setClosen(opt.json, n));
        setTimeout(function () {
            lines = [[], [], [], []];
            opt.json = opt.json;
            format(opt.json);
            DataUtils.addLine();
            draw();
        }, 0);
        return true;
    };
    this.update = function (data) {
        lines = [[], [], [], []];
        opt.json = data;
        format(opt.json);
        DataUtils.addLine();
        draw();
    };
    this.orientate = function () {
        rootpos = null;
        format(opt.json);
        draw();
    };
    this.add = function (data) {
        opt.json.children.push(data);
        format(opt.json);
        draw();
    };
    this.destroy = function () {
        for (var i in t) {
            clearTimeout(t[i]);
        }
        t = [];
        for (var i in inter) {
            clearInterval(inter[i]);
        }
        inter = [];
        var $e = d3.select("#" + option.parentId);
        $e.style('background', '');
        $e.select('svg').remove();
    }
    /************************初始化*****************************/
    function init(option) {
        setconf();
        var div = d3.select("#" + option.parentId);
        div.attr("class", 'chart_div')
            .style("background", "url(" + option.imgBaseUrl + "/back.png)")
            .style('overflow', 'hidden');

        opt = option;
        opt.json = opt.data;
        //opt.json.children[1].children[0].selected=true;//修复
        //var data = JSON.stringify(opt.json.children[2])
        //opt.json.children[4] = JSON.parse(data)
        //opt.json.children[5] = JSON.parse(data)
        //opt.json.children[6] = JSON.parse(data)
        //format(opt.json);
        DataUtils.addParent(opt.json);
        DataUtils.setClosen(opt.json, opt.close > 1 ? opt.close : 1);
        DataUtils.getR(opt.json);
        DataUtils.setpos(opt.json);
        console.log(list);
        DataUtils.addLine();
        draw();
        //  if (opt.isready)  fash();


        document.ondragstart = function () {
            return false;
        }
    }

    //function fash() {
    //    var tt = setTimeout(function () {
    //        Ajax.getJson(opt.url, function (json) {
    //            if (json.data) {
    //                opt.json = json.data;
    //                format(opt.json);
    //                draw();
    //            }
    //            fash();
    //        });
    //    }, opt.delayTime);
    //    t.push(tt);
    //}

    /***********************配置参数*****************************/
    function setconf() {
        var level_size_3 = 30
        conf = {
            level_size_0: 184,
            level_size_1: 100,
            level_size_2: 62,
            level_size_3: level_size_3,
            line_width: 2,
            speed: 800,
            getdelaytime: function () {
                return random ? 0 : 300;
            },
            ringr: 18,
            ringR: 27,
            ringw: 110
        };
        arc = d3.svg.arc()
            .innerRadius(18)
            .outerRadius(27);
    }

    /************************画图*****************************/
    function draw(isUpdate) {
        drawSVG();
        for (var i = 0; i < lines.length; i++) {
            drawLine(i);
        }
        draw_one_level();
        draw_tow_level();
        draw_three_level();
        draw_four_level();

        function drawSVG() {
            var json = opt.json;
            if (!svg) {
                var $e = d3.select("#" + opt.parentId)
                var mouseDown = false, clientX, clientY, x, y;
                var height = ($e.style('height').slice(0, -2) - opt.json.R * 2) / 2;
                var width = ($e.style('width').slice(0, -2) - opt.json.R * 2) / 2;
                svg = $e.selectAll("#" + opt.parentId + ' svg')
                    .data([json])
                    .enter()
                    .append("svg")
                    .attr("width", "100%").attr("height", "100%")
                    .append('g')
                    .style('transform', 'scale(' + scaleX + ', ' + scaleY + ')')
                //.style('transform-origin', '50% 50%')
                //.attr('transform-origin', '50% 50%');

                svg.append('g').attr('class', 'lineG')
                var div = $e.selectAll("#" + opt.parentId + ' svg')
                div.on('mousedown', function () {
                    var event = d3.event;
                    mouseDown = true;
                    clientX = event.clientX;
                    clientY = event.clientY;
                    x = rootpos[0]
                    y = rootpos[1]
                });

                div.on('mousemove', function () {
                    var event = d3.event;
                    if (mouseDown) {
                        var width = event.clientX - clientX, height = event.clientY - clientY;
                        random = true;
                        rootpos = [x + width / scaleX, y + height / scaleX];
                        opt.json.pos = [x + width / scaleX, y + height / scaleX];
                        DataUtils.setpos(opt.json);
                        draw();
                        //svg.selectAll('.detilG').remove();
                        detilG && detilG.move();
                        detilG2 && detilG2.move();
                    }
                });
                d3.select('body').on('mouseup', function () {
                    random = false;
                    mouseDown = false;
                    return false;
                });
                div.on('mousewheel', wheel);
                div.on('DOMMouseScroll', wheel);
                svg.transition().duration(conf.getdelaytime())
                    .attr("transform", function (d) {
                        return 'translate(' + 0 + ' ' + 0 + ')';
                    });
            }


        }


        function wheel() {
            var scn = 0.9, max = 2.5, min = 0.2;//缩放系数
            var event = d3.event;
            var oscale = scaleX;
            ((event.wheelDelta || event.detail) < 0) ? (scaleX *= (scaleX < min) ? 1 : scn, scaleY *= (scaleX < min) ? 1 : scn) : ((scaleX /= (scaleX > max) ? 1 : scn, scaleY *= scaleX /= (scaleX > max) ? 1 : scn));
            var nscale = scaleX;
            svg.attr('transform', 'scale(' + scaleX + ', ' + scaleX + ')');
            svg.style('transform', 'scale(' + scaleX + ', ' + scaleX + ')');
            //移动到当前位置
            if (nscale != oscale) {
                var x = event.offsetX / nscale - event.offsetX / oscale, y = event.offsetY / nscale - event.offsetY / oscale;
                rootpos = [rootpos[0] + x, rootpos[1] + y];
                opt.json.pos = rootpos;
                DataUtils.setpos(opt.json);
                random = true;
                draw();
                random = false;
            }
            detilG && detilG.move();
            detilG2 && detilG2.move();

        }

        function draw_one_level() {
            var center = svg.selectAll('.one_level')
                .data(list[0]);
            var enter = center.enter()
                .append('g')
                .attr('class', 'one_level');
            center.exit().remove();
            enter.append('image')
                .attr('class', 'bk1')
                .attr("x", -conf.level_size_0 / 2)
                .attr("y", -conf.level_size_0 / 2)
                .attr("width", conf.level_size_0)
                .attr("height", conf.level_size_0)
                .style("transform", 'rotate(0deg)')
                .attr("xlink:href", option.imgBaseUrl + '/root1.png')
            enter.append('image')
                .attr('class', 'bk2')
                .attr("x", -conf.level_size_0 / 2)
                .attr("y", -conf.level_size_0 / 2)
                .attr("width", conf.level_size_0)
                .attr("height", conf.level_size_0)
                .style("transform", 'rotate(0deg)')
                .attr("xlink:href", option.imgBaseUrl + '/root2.png')
            enter.append('image')
                .attr('class', 'bk3')
                .attr("x", -conf.level_size_0 / 2)
                .attr("y", -conf.level_size_0 / 2)
                .attr("width", conf.level_size_0)
                .attr("height", conf.level_size_0)
                .style("transform", 'rotate(0deg)')
                .attr("xlink:href", option.imgBaseUrl + '/root3.png')

            enter.append('text')
                .attr("x", 0)
                .attr("y", -10)
                .attr("text-anchor", 'middle')
                .attr("class", 'value')
                .attr("font-size", '24')
                .style("font-weight", "bold")
                .style("fill", "url(#" + Draw.setlinearGradient('alln', 'y', ['#fed054', '#faa92a', '#f68301']) + ")")

            enter.append('text')
                .attr("x", 0)
                .attr("y", 30)
                .attr("text-anchor", 'middle')
                .attr("font-size", '12')
                .style("fill", '#528BA9')
                .text('渠道访问量');

            center.transition().duration(conf.getdelaytime())
                .attr("transform", function (d) {
                    return 'translate(' + d.pos[0] + ' ' + d.pos[1] + ')';
                });
            center.select('.value').text(list[0][0].value);

            //root2
            var root2 = enter.select('.bk2')
                .filter(function () {
                    var $e = d3.select(this);
                    inter.push(setInterval(function () {
                        var len = lines[2].length + lines[1].length + lines[0].length;
                        numb2 -= (1 + len * 0.7) > 8 ? 8 : (1 + len * 0.7);
                        numb2 = numb2 ? numb2 : 0;
                        if (len) {
                            $e.style("transform", 'rotate(' + numb2 + 'deg)');
                        }
                    }, 40));
                });


            //root3
            var root3 = enter.select('.bk3')
                .filter(function () {
                    var $e = d3.select(this);
                    inter.push(setInterval(function () {
                        var len = lines[2].length;
                        numb3 += (1 + len * 0.7) > 8 ? 8 : (1 + len * 0.7);
                        numb3 = numb3 ? numb3 : 0;
                        if (len) {
                            $e.style("transform", 'rotate(' + numb3 + 'deg)');
                        }
                    }, 40));
                });
        }

        function draw_tow_level() {
            var center = svg.selectAll('.tow_level')
                .data(list[1]);
            center.exit().remove();
            var enter = center.enter()
                .append('g')
                .attr('class', 'tow_level')


            enter.append('circle')
                .attr('class', 'circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('fill', 'rgba(0,0,0,0)')
                .attr('stroke-width', '1');


            enter.append('image')
                .attr("class", 'bk')
                .attr("x", -conf.level_size_1 / 2)
                .attr("y", -conf.level_size_1 / 2)
                .attr("width", conf.level_size_1)
                .attr("height", conf.level_size_1);

            enter.append('text')
                .attr('class', 'name')
                .attr("text-anchor", 'middle')
                .attr("x", 0)
                .attr("y", 20)
                .attr("font-size", '12')
                .style("font-weight", "bold")
                .style("fill", "#fff")
                .text(function (d) {
                    return d.name;
                });

            enter.append('image')
                .attr("xlink:href", function (d) {
                    return d.ligting_icon;
                })
                .attr("x", -10)
                .attr("y", -20)
                .attr("width", 20)
                .attr("height", 20);

            center.transition().duration(conf.getdelaytime()).attr("transform", function (d) {
                return 'translate(' + d.pos[0] + ' ' + d.pos[1] + ')';
            });

            center.select('.name').text(function (d) {
                return d.name;
            });
            center.select('.circle').transition().duration(conf.getdelaytime()).attr('r', function (d) {
                return d.r;
            }).attr('stroke', function (d) {
                return d.type % 2 ? 'rgba(4,100,205,0.6)' : 'rgba(220, 26, 81,0.6)';
            });
            center.select('.bk').attr("xlink:href", function (d) {
                var i = d.type % 2 ? 0 : 2;
                if (baseUtils.arryhasVal(lines[0], d)) {
                    i++;
                }

                return option.imgBaseUrl + '/tow_level_' + i + '.png';
            })
            //center.style('opacity', function (d) {
            //    return setH(d);
            //});

            //画事件
            enter.append('circle')
                .attr('class', 'circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', conf.level_size_1 / 2)
                .attr('fill', 'rgba(0,0,0,0)')
                .attr('stroke-width', '1')
                .style('cursor', 'pointer')
                .on('click', function () {
                    var d = this.parentNode.__data__;
                    baseUtils.hasVal(d.id) ? baseUtils.removearry(hideary, d.id) : hideary.push(d.id);
                    if (d.children)
                        for (var i = 0; i < d.children.length; i++) {
                            var id = d.children[i].id;
                            if (!baseUtils.hasVal(id)) hideary.push(id);
                        }
                    moveOrigin(this.parentNode.__data__);
                    draw();
                    d3.selectAll('.hover').remove();
                })
                .on('mouseover', function (d, i) {
                    if(opt.isready && d.children) Draw.drawDetil3(2, i,this);
                })
                .on('mouseout', function (d, i) {
                    if(opt.isready && d.children) {
                        d3.selectAll('.hover').remove();
                    }
                });
        }

        function draw_three_level() {
            var center = svg.selectAll('.three_level')
                .data(list[2]);
            center.exit().remove();
            var enter = center.enter()
                .append('g')
                .attr('class', 'three_level')
                .on('mouseover', function (d) {
                    if (!opt.isready && !d.children) {
                        if (d3.select(this).select('.text').empty()) {
                            d3.select(this).append('text')
                                .attr('class', 'text')
                                .attr("x", 0)
                                .attr("y", -18)
                                .attr("text-anchor", 'middle')
                                .attr("font-size", 8)
                                .style("fill", function(d){
                                    return '#fff';
                                })
                                .text(function (d) {
                                    return d.name;
                                });
                        }
                    }
                })
                .on('mouseout', function (d) {
                    if (!opt.isready && !d.children) {
                        d3.select('.text').remove();
                    }
                });

            enter.filter(function (d) {
                    return !!d.children
                })
                .append('circle')
                .attr('class', 'circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('fill', 'rgba(0,0,0,0)')
                .attr('stroke-width', 1);

            enter.append('image')
                .filter(function (d) {
                    return !!d.children
                })
                .attr("class", 'bk')
                .attr("x", function (d) {
                    if (!d.children && opt.isready) {
                        return -conf.level_size_3 / 2
                    }
                    return -conf.level_size_2 / 2
                })
                .attr("y", function (d) {
                    if (!d.children && opt.isready) {
                        return -conf.level_size_3 / 2
                    }
                    return -conf.level_size_2 / 2
                })
                .attr("width", conf.level_size_2)
                .attr("height", conf.level_size_2);

            var node = enter.append('image')
                .attr("class", 'icon')
                .attr("x", -15)
                .attr("y", -15)
                .attr("width", 30)
                .attr("height", 30);

            enter.filter(function (d) {
                    return !!d.children
                })
                .append('text')
                .attr('class', 'name')
                .attr("text-anchor", 'middle')
                .attr("x", 0)
                .attr("y", 16)
                .attr("font-size", '10')
                .text(function (d) {
                    if (!d.children && opt.isready) {
                        return '';
                    }
                    return d.name;
                });

            //画事件
            enter.append('circle')
                .attr('class', 'circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', function (d) {
                    if (!d.children) {
                        return conf.level_size_3 / 2
                    }
                    return conf.level_size_2 / 2
                })
                .attr('fill', 'rgba(0,0,0,0)')
                .attr('stroke-width', '1')
                .style('cursor', 'pointer')
                .on('click', function () {
                    d3.select('.hover2').remove();
                    var d = this.parentNode.__data__;
                    if (d.children) {
                        baseUtils.hasVal(d.id) ? baseUtils.removearry(hideary, d.id) : hideary.push(d.id);
                        d3.select('.detilG').remove();
                        moveOrigin(d);
                        draw();
                    } else {
                        if (opt.isready) return false;
                        d.selected = !d.selected;
                        if (d.selected) {
                            lines[1].push(d);
                            if (!baseUtils.arryhasVal(lines[0], d.parent)) lines[0].push(d.parent);
                            opt.clickcb.call(this, d, d.selected, scaleX, node, d3.event);
                        } else {
                            d.selected = !d.selected;
                            //baseUtils.removearryByid(lines[1], d);
                            //if (!baseUtils.arryhasarryVal(d.parent.children, lines[1])) baseUtils.removearryByid(lines[0], d.parent);
                        }
                        draw();
                    }
                })
                .on('mouseover', function (d, i) {
                    if (opt.isready && d.selected && !d.children)  Draw.drawDetil(2, i);
                    if(opt.isready && d.children) Draw.drawDetil2(2, i,this);
                })
                .on('mouseout', function (d, i) {
                    if(opt.isready && d.children) {
                        d3.select('.hover').remove();
                    }
                });


            center.transition().duration(conf.getdelaytime()).attr("transform", function (d) {
                if (!baseUtils.hasVal(d.parent.id)) d3.select(this).style('display', 'inherit');
                return 'translate(' + d.pos[0] + ' ' + d.pos[1] + ')';
            }).each('end', function (d) {
                d3.select(this).style('display', baseUtils.hasVal(d.parent.id) ? 'none' : 'inherit')
            });

            center.select('.name').text(function (d) {
                return d.name;
            }).style('display', scaleX < 0.9 ? 'none' : 'inherit')
                .style('fill', function (d) {
                    if (baseUtils.arryhasVal(lines[1], d)) return '#fff';
                    if (d.type % 2)   return '#0029a2';
                    return '#9e1438';

                });
            center.select('.circle').transition().duration(conf.getdelaytime()).attr('r', function (d) {
                return d.r;
            }).attr('stroke', function (d) {
                if (d.children) return d.type % 2 ? 'rgba(4,100,205,0.6)' : 'rgba(220, 26, 81,0.6)';
            });
            center.select('.bk').attr("xlink:href", function (d) {
                var i = d.type % 2 ? 0 : 1;
                if (baseUtils.arryhasVal(lines[1], d)) {
                    i += '_active';
                }
                return option.imgBaseUrl + '/three_level_' + i + '.png';
            });

            center.select('.icon').attr("xlink:href", function (d) {
                    if (baseUtils.arryhasVal(lines[1], d)) return d.ligting_icon;
                    return d.ligtingoff_icon;
                    // return 'img/root.png';//待修复
                })
                .filter(function (d) {
                    return !!d.children
                })
                .attr("x", scaleX < 0.9 ? -17 : -12)
                .attr("y", scaleX < 0.9 ? -17 : -22)
                .attr("width", scaleX < 0.9 ? 34 : 24)
                .attr("height", scaleX < 0.9 ? 34 : 24);

            //center.style('opacity', function (d) {
            //    return setH(d);
            //});
        }

        function draw_four_level() {
            var center = svg.selectAll('.four_level')
                .data(list[3]);
            center.exit().remove();
            var enter = center.enter()
                .append('g')
                .attr('class', 'four_level')
                .on('mouseover', function () {
                    if (!opt.isready) {
                        if (d3.select(this).select('.text').empty()) {
                            d3.select(this).append('text')
                                .attr('class', 'text')
                                .attr("x", 0)
                                .attr("y", -18)
                                .attr("text-anchor", 'middle')
                                .attr("font-size", 8)
                                .style("fill", function(d){
                                    return d.parent.parent.index%2?'#01cbfe':'#dc0459';
                                })
                                .text(function (d) {
                                    return d.name;
                                });
                        }
                    }
                })
                .on('mouseout', function () {
                    if (!opt.isready) {
                        d3.select('.text').remove();
                    }
                });

            var node = enter.append('circle')
                .attr('x', 0)
                .attr('y', 0)
                .attr('r', conf.level_size_3 / 2)
                .attr('class', 'four_img')
                .style('cursor', 'pointer');

            center.select('.four_img')
                .attr('fill', function (d) {
                    if (d.selected) return 'url(#' + Draw.buildcircleimg(d.ligting_icon) + ')';
                    return 'url(#' + Draw.buildcircleimg(d.ligtingoff_icon) + ')';
                })
                .on('click', function (d) {
                    if (opt.isready) return false;
                    d.selected = !d.selected;
                    if (d.selected) {
                        lines[2].push(d);
                        if (!baseUtils.arryhasVal(lines[1], d.parent)) lines[1].push(d.parent);
                        if (!baseUtils.arryhasVal(lines[0], d.parent.parent)) lines[0].push(d.parent.parent);
                        draw();
                        opt.clickcb.call(this, d, d.selected, scaleX, node, d3.event);
                    } else {
                        d.selected = !d.selected;
                        //baseUtils.removearryByid(lines[2], d);
                        //if (!baseUtils.arryhasarryVal(d.parent.children, lines[2])) baseUtils.removearryByid(lines[1], d.parent);
                        //if (!baseUtils.arryhasarryVal(d.parent.parent.children, lines[1])) baseUtils.removearryByid(lines[0], d.parent.parent);
                    }
                })
                .on('mouseover', function (d, i) {
                    if (opt.isready && d.selected) {
                        Draw.drawDetil(3, i)
                    }
                });

            center.transition().duration(conf.getdelaytime())
                .attr("transform", function (d) {
                    if (!baseUtils.hasVal(d.parent.id)) d3.select(this).style('display', 'inherit');
                    return 'translate(' + d.pos[0] + ' ' + d.pos[1] + ')';
                }).each('end', function (d) {
                d3.select(this).style('display', baseUtils.hasVal(d.parent.id) ? 'none' : 'inherit')
            });
        }

        function drawLine(index) {
            var width = conf.line_width;
            var all = d3.select('.lineG').selectAll('.lines' + index)
                .data(lines[index]);
            all.exit().remove();
            var enter = all.enter()
                .append('g')
                .attr('class', 'lines' + index)

            all.exit().remove();

            enter.append('line')
                .attr('class', 'line')
                .style('stroke-width', function () {
                    return conf.line_width;
                })
                .attr('x1', function (d) {
                    return conf['level_size_' + d.deep] - 24;
                });

            enter.append('rect')
                .attr('class', 'line_write')
                .attr('x', function (d) {
                    return conf['level_size_' + d.deep] - 24;
                })
                .attr('y', -8)
                .attr('width', 100)
                .attr('height', 16);

            all.selectAll('.line_write').style('opacity', function (d) {
                    var all = 1218749;
                    //return 0.5;
                    return 0.3 + d.value / all;
                })
                .attr('fill', function (d, i) {
                    var color = this.parentNode.__data__.type % 2 ? '80,149,240' : '203,85,126';
                    return "url(#" + Draw.setlinearGradient(this.parentNode.__data__.type % 2 ? 'lineblue' : 'linered', 'y', ['rgba(' + color + ',0.1)', 'rgba(' + color + ',0.3)', 'rgba(255,255,255,0.2)', 'rgba(' + color + ',0.3)', 'rgba(' + color + ',0.1)']) + ")"
                });
            all.select('.line')
                .transition().duration(conf.getdelaytime())
                .attr('x2', function (d) {
                    if (baseUtils.hasVal(d.parent.id)) return d3.select(this).attr('x1');
                    return baseUtils.getLen(d.parent.pos, d.pos) - (d.deep == 1 ? 26 : 0);
                })
                .style('stroke', function (d) {
                    return d.type % 2 ? '#2546ed' : '#dc1a51';
                })

            all.select('.line_write')
                .transition().duration(conf.getdelaytime())
                .attr('width', function (d) {
                    if (baseUtils.hasVal(d.parent.id))
                        return 0;
                    return baseUtils.getLen(d.parent.pos, d.pos) - (d.deep == 1 ? 36 : 10);
                });

            all
            // .transition().duration(conf.getdelaytime())
                .attr("transform", function (d) {
                    if (!baseUtils.hasVal(d.parent.id)) {
                        var rotate = baseUtils.getAngle(d)
                        return 'translate(' + d.parent.pos[0] + ' ' + d.parent.pos[1] + ') rotate(' + (rotate ? rotate : 0) + ')';
                    } else {
                        var transform = d3.select(this).attr('transform')
                        return transform ? transform : 'translate(' + d.parent.pos[0] + ' ' + d.parent.pos[1] + ') ';
                    }
                });

            //画流动
            if (opt.isready) {
                var time = 2000;

                var flow = enter.append('g')
                    .data(lines[index])
                    .attr('class', 'flow');

                all.selectAll('.flow').style('opacity', function () {
                    if (baseUtils.hasVal(this.parentNode.__data__.parent.id)) return 0
                    return 1;
                });

                flow.each(function (D, i) {
                    var d = lines[index][i];
                    var size = [30, 20, 10][d.deep - 1];
                    var that = this;
                    if (d.deep == 3)
                        addImage(d3.select(that), size, d);

                    if (d.deep == 2) {
                        addImage(d3.select(that), size, d);
                        var tt = setTimeout(function () {
                            addImage(d3.select(that), size, d);
                        }, time / 2);
                        t.push(tt);
                    }

                    if (d.deep == 1) {
                        addImage(d3.select(that), size, d);
                        var tt1 = setTimeout(function () {
                            addImage(d3.select(that), size, d);
                        }, time / 3);
                        var tt2 = setTimeout(function () {
                            addImage(d3.select(that), size, d);
                        }, time / 3 * 2);
                        t.push(tt1);
                        t.push(tt2);
                    }
                });

                all.selectAll('.imagesC')
                    .attr('xlink:href', function (d) {
                        var type = this.parentNode.parentNode.__data__.type % 2 ? 'blue' : 'red';
                        return option.imgBaseUrl + '/line_' + type + '.png';
                    })


            }

            function addImage($e, size, d) {
                $e.append('image')
                    .attr('x', function () {
                        return baseUtils.getLen(d.parent.pos, d.pos) - 20;
                    })
                    .attr('class', 'imagesC')
                    .attr('y', -size)
                    .attr('width', function () {
                        return size * 2
                    })
                    .attr('height', function () {
                        return size * 2
                    })

                    .transition()
                    .duration(time)
                    .attr('x', 0)
                    .each('end', function () {
                        goflow(this, d);
                    });
            }

            function goflow(that, D) {
                d3.select(that)
                    .attr('x', function () {
                        return baseUtils.getLen(this.parentNode.parentNode.__data__.parent.pos, this.parentNode.parentNode.__data__.pos) - 20;
                    })
                    .transition()
                    .ease("linear")
                    .duration(2000)
                    .attr('x', 0)
                    .each('end', function () {
                        goflow(that, D);
                    });
            };
        }
    }

    /************************常用函数*****************************/
    //初入数据处理
    function format(root) {
        DataUtils.addParent(root);
        DataUtils.getR(root);
        DataUtils.setpos(root);
    }

    /************************通用类*****************************/
    //明度变化
    function setH(d) {
        return 0.6 + d.value / d.parent.value
    }

    //点击点为原点移动
    function moveOrigin(d) {
        var opos = [d.pos[0], d.pos[1]]
        DataUtils.getR(opt.json);
        DataUtils.setpos(opt.json);
        var pos = baseUtils.getObjById(opt.json, d.id).pos;
        var lenx = opos[0] - pos[0];
        var leny = opos[1] - pos[1];
        rootpos = [rootpos[0] + lenx, rootpos[1] + leny];
        DataUtils.setpos(opt.json);
    }

    /***********************工具类*****************************/
    var baseUtils = {
        //id是否存在
        hasVal: function (id) {
            return ~hideary.indexOf(id);
        },


        //移除数组指定值
        removearry: function (ary, val) {
            var a = ary.indexOf(val)
            if (~a) {
                ary.splice(a, 1);
                return true;
            }
            else {
                return false;
            }
        },
        //id是否存在
        arryhasVal: function (ary, d) {
            for (var i = 0; i < ary.length; i++) {
                if (ary[i].id == d.id) {
                    return true;
                }
            }
            return false;
        },
        //id是否存在
        arryhasarryVal: function (ary1, ary2) {
            for (var i = 0; i < ary1.length; i++) {
                for (var j = 0; j < ary2.length; j++)
                    if (ary1[i].id == ary2[j].id) {
                        return true;
                    }
            }
            return false;
        },
        //移除数组指id
        removearryByid: function (ary, d) {
            for (var i = 0; i < ary.length; i++) {
                if (ary[i].id == d.id) {
                    ary.splice(i, 1);
                    return true;
                }
            }
            return false;
        },
        //josn找对象根据id
        getObjById: function (root, id) {
            if (!root.children) return false;
            for (var i = 0; i < root.children.length; i++) {
                if (root.children[i].id == id) {
                    return root.children[i];
                } else {
                    var value = baseUtils.getObjById(root.children[i], id);
                    if (value) {
                        return value;
                    }
                }
            }
            return false;
        },

        //获取角度
        getAngle: function (d) {
            var pos1 = d.parent.pos, pos2 = d.pos;
            if (pos1[0] <= pos2[0] && pos1[1] <= pos2[1])
                return Math.asin((pos2[1] - pos1[1]) / this.getLen(pos1, pos2)) * 180 / Math.PI;
            if (pos1[0] >= pos2[0] && pos1[1] <= pos2[1])
                return 180 - Math.asin((pos2[1] - pos1[1]) / this.getLen(pos1, pos2)) * 180 / Math.PI;
            if (pos1[0] >= pos2[0] && pos1[1] >= pos2[1])
                return 180 + Math.asin((pos1[1] - pos2[1]) / this.getLen(pos1, pos2)) * 180 / Math.PI;
            if (pos1[0] <= pos2[0] && pos1[1] >= pos2[1])
                return 360 - Math.asin((pos1[1] - pos2[1]) / this.getLen(pos1, pos2)) * 180 / Math.PI;
        },

        //获取长度
        getLen: function (pos1, pos2) {
            return Math.sqrt((pos1[0] - pos2[0]) * (pos1[0] - pos2[0]) + (pos1[1] - pos2[1]) * (pos1[1] - pos2[1]));
        },
        //获取外界面宽高
        getWH: function ($e) {
            return [$e.style('width').slice('-2'), $e.style('height').slice('-2')]
        }
    }


    /***********************网络请求工具*****************************/
    var Ajax = {
        //获取数据
        getJson: function (url, cb) {
            d3.json(url, function (err, data) {
                if (err) console.log(err);
                cb && cb(data);
            });
        }
    }

    /***********************画图工具*****************************/
    var Draw = {
        //画一个详情
        drawDetil: function (j, i) {
            var d = list[j][i];
            var color_blue = ['#0470e1', 'rgba(4,112,225,0.46)', 'rgba(3,53,136,0.6)', 'rgba(4,112,225,0.63)'], color_red = ['#dc0459', 'rgba(221,4,89,0.46)', 'rgba(130,10,57,0.5)', 'rgba(221,4,89,0.63)'];
            var pie = d3.layout.pie();
            svg.selectAll('.detilG').remove();
            var G = svg.append("g").attr('class', 'detilG')
                .style('cursor', 'pointer');
            // .attr("transform", 'translate(' + d.pos[0] + ',' + d.pos[1] + ')');
            var x = 40;
            var name, pre;
            G.on('click', function () {
                opt.clickcb.call(this, d, d.selected, scaleX, null, d3.event);
            });

            G.move = function () {
                var d = list[j][i];
                G.attr("transform", 'translate(' + d.pos[0] + ',' + d.pos[1] + ')');
                var ishow = scaleX < 0.55 ? 'none' : 'inherit';
                name && name.style('display', ishow)
                pre && pre.style('display', ishow)
                //if (scaleX < 0.55) {
                //    react && react.attr('width', 100 / scaleX)
                //}
            };
            G.remove = function () {
                //detilG.remove();
                svg.selectAll('.detilG').remove();
                detilG = null;
            };
            G.move();
            detilG = G;
            //middle
            //画信息
            var react = G.append('rect')
                .attr('x', 0)
                .attr('y', -conf.ringR)
                .attr('width', 0)
                .transition().duration(conf.getdelaytime())
                .attr('width', function () {
                    var min = 120, max = d.name.length * 10 + 60;
                    return min < max ? max : min;
                })
                .attr('height', conf.ringR * 2)
                .attr("fill", function () {
                    return d.type % 2 ? color_blue[2] : color_red[2];
                })
                .each('end', function () {
                    var ishow = scaleX < 0.55 ? 'none' : 'inherit';
                    name = G.append('text')
                        .attr("x", x)
                        .attr("y", -10)
                        .attr("text-anchor", 'left')
                        .attr("class", 'chart_number')
                        .attr("font-size", 12)
                        .style("fill", "#f78807")
                        .style('display', ishow)
                        .text(d.name);
                    G.append('text')
                        .attr("x", x)
                        .attr("y", 6)
                        .attr("text-anchor", 'left')
                        .attr("class", 'chart_number')
                        .attr("font-size", 12)
                        .style("fill", "#f78807")
                        .text("流量:" + d.value);

                    pre = G.append('text')
                        .attr("x", x)
                        .attr("y", 22)
                        .attr("text-anchor", 'left')
                        .attr("class", 'chart_number')
                        .attr("font-size", 12)
                        .style("fill", "#f78807")
                        .style('display', ishow)
                        .text("占比:" + ((d.value / opt.json.value * 100) || 0).toFixed(1) + '%');
                });


            //画圆
            var arcs = G.selectAll(".detil")
                .data(pie([d.value, (d.parent.value - d.value) || 1]))
                .enter()
                .append("g")

            arcs.append("path")
                .attr("fill", function (D, i) {
                    return d.type % 2 ? color_blue[i] : color_red[i];
                })
                .attr('stroke', function () {
                    return d.type % 2 ? color_blue[3] : color_red[3];
                })
                .attr("d", function (d) {
                    return arc(d);
                })
                //.style('opacity',0)
                //.transition().duration(conf.getdelaytime())
                .style('opacity', 1)
            //.transition().duration(conf.getdelaytime())
            //.attr("d", function (d) {
            //    return arc(d);
            //})

            //画图
            G.append('circle')
                .attr('x', 0)
                .attr('y', 0)
                .attr('r', conf.level_size_3 / 2)
                .attr('fill', function () {
                    if (d.selected) return 'url(#' + Draw.buildcircleimg(d.ligting_icon) + ')';
                    return 'url(#' + Draw.buildcircleimg(d.ligtingoff_icon) + ')';

                })

            G.on('mouseout', function (d) {
                G.remove();
            });
        },
        //画一个2详情
        drawDetil2: function (j, i,that) {
            detilG && detilG.remove();
            detilG2 =that;
            var d = that.parentNode.__data__;
            var G = svg.append("g").attr('class', 'hover');
            G.append('text')
                .attr("x", 0)
                .attr("y", -48)
                .attr("text-anchor", 'left')
                .attr("class", 'chart_number')
                .attr("font-size", 12)
                .style("fill", "#f78807")
                .text('流量:'+d.value);
            G.append('text')
                .attr("x", 0)
                .attr("y",-30)
                .attr("text-anchor", 'left')
                .attr("class", 'chart_number')
                .attr("font-size", 12)
                .style("fill", "#f78807")
                .text("占比:" + ((d.value / opt.json.value * 100) || 0).toFixed(1) + '%');
            that.move=function(){
                G.attr("transform", 'translate(' + d.pos[0] + ',' + d.pos[1] + ')');
            }
            that.move();
        },
        //画一个3详情
        drawDetil3: function (j, i,that) {
            detilG2 =that;
            var d = that.parentNode.__data__;
            var G = svg.append("g").attr('class', 'hover');
            G.append('text')
                .attr("x", 0)
                .attr("y", -62)
                .attr("text-anchor", 'left')
                .attr("class", 'chart_number')
                .attr("font-size", 12)
                .style("fill", "#f78807")
                .text('流量:'+d.value);
            G.append('text')
                .attr("x", 0)
                .attr("y",-44)
                .attr("text-anchor", 'left')
                .attr("class", 'chart_number')
                .attr("font-size", 12)
                .style("fill", "#f78807")
                .text("占比:" + ((d.value / opt.json.value * 100) || 0).toFixed(1) + '%');

            that.move=function(){
                G.attr("transform", 'translate(' + d.pos[0] + ',' + d.pos[1] + ')');
            }
            that.move();
        },
        //设置渐变
        setlinearGradient: function (id, d, colors) {
            if (!svg.select('#' + id).empty()) return id;
            var defs = svg.append("defs");
            var linearGradient = defs.append("linearGradient")
                .attr("id", id);
            if (d == 'x') {
                linearGradient.attr("x1", "0%")
                    .attr("y1", "0%")
                    .attr("x2", "100%")
                    .attr("y2", "0%")
            } else {
                linearGradient.attr("x1", "0%")
                    .attr("y1", "0%")
                    .attr("x2", "0%")
                    .attr("y2", "100%")
            }
            var len = colors.length;
            for (var i = 0; i < len; i++) {
                linearGradient.append("stop")
                    .attr("offset", (i / (len - 1) * 100).toFixed(0) + '%')
                    .style("stop-color", colors[i]);
            }
            return id;
        },
        //生成圆角图片
        buildcircleimg: function (url) {
            var size = conf.level_size_3;
            var id = url.replace(/:|\/|\./g, '');
            if (!svg.select('#' + id).empty()) return id;
            var defs = svg.append("defs");
            var pattern = defs.append("pattern")
                .attr("id", id)
                .attr("patternUnits", "userSpaceOnUse")
                .attr('width', size)
                .attr('height', size)
                .attr('x', -size / 2)
                .attr('y', -size / 2);
            //加白色背景
            //pattern.append('rect')
            //    .attr('x', 0)
            //    .attr('y', 0)
            //    .attr('width', size)
            //    .attr('height', size)
            //    .attr('fill', '#fff');
            pattern.append('image')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', size)
                .attr('height', size)
                .attr('xlink:href', url);
            return id;
        }
    }
    /***********************数据控制工具*****************************/
    var DataUtils = {
        //给数据添加关闭层级
        setClosen: function (root, n) {
            var i;
            (root.deep >= n) ? hideary.push(root.id) : baseUtils.removearry(hideary, root.id);
            for (i in root.children) {
                this.setClosen(root.children[i], n);
            }
        },
        //遍历添加父元素，层级，类型，index,list
        addParent: function (root, type) {
            var i, item, deep = this.getdeep(root);
            root.deep = deep;
            if (!deep) list = [[root]];
            for (i in root.children) {
                item = root.children[i];
                item.parent = root;
                item.index = i;
                item.type = type || i;
                list[deep + 1] ? list[deep + 1].push(item) : list[deep + 1] = [item];
                this.addParent(item, item.type);
            }
        },
        addLine: function () {
            var item;
            var ary = list[3];
            console.log(ary);
            //一直连接第一级
            for(var i=0;i<list[1].length;i++){
                lines[0].push(list[1][i]);
            }

            for (var i = 0; i < ary.length; i++) {
                item = ary[i];
                if (item.selected) {
                    lines[2].push(item);
                    if (!baseUtils.arryhasVal(lines[1], item.parent)) lines[1].push(item.parent);
                    if (!baseUtils.arryhasVal(lines[0], item.parent.parent)) lines[0].push(item.parent.parent);
                }
            }
            var ary2 = list[2]
            for (var i = 0; i < ary2.length; i++) {
                item = ary2[i];
                if (item.selected) {
                    if (!baseUtils.arryhasVal(lines[1], item)) lines[1].push(item);
                    if (!baseUtils.arryhasVal(lines[0], item.parent)) lines[0].push(item.parent);
                }
            }
        },
        getdeep: function (obj) {
            var deep = 0;
            deepCB(obj);
            return deep;
            function deepCB(obj) {
                if (obj.parent) {
                    deep++;
                    deepCB(obj.parent);
                }
            }
        },
        getR: function (root) {
            var nodeSize = conf['level_size_' + root.deep];
            if (!root.children || !root.children.length) {
                nodeSize = conf['level_size_' + 3];
                root.r = nodeSize / 2;
                root.R = nodeSize / 2 + 5;
                return [nodeSize / 2, nodeSize / 2 + 5];
            }
            var arry = root.children;
            var s = 0, r, R;
            var maxR = 0;
            for (var i = 0; i < arry.length; i++) {
                var Rn = DataUtils.getR(arry[i])[1];
                if (maxR < Rn) {
                    maxR = Rn;
                }
                s += (2.2 * Rn);
                arry[i].si = s;
            }
            var s1 = s / 2 / Math.PI, s2 = maxR + nodeSize;
            if (s1 > s2) {
                r = s1;
                root.pj = false;
            } else {
                root.pj = true;
                r = s2;
            }
            R = r + maxR + 4;

            if (baseUtils.hasVal(root.id)) {
                root.r = nodeSize / 2;
                root.R = nodeSize;
                root.s = 2 * Math.PI * nodeSize;
                return [nodeSize, 1.4 * nodeSize];
            } else {
                root.r = r;
                root.R = R;
                root.s = s;
                return [r, R];
            }
        },
        setpos: function (root) {
            var $e = d3.select('#' + opt.parentId);
            if (root.children) {
                if (!root.parent) {
                    if (!rootpos) {
                        root.pos = [$e.style('width').slice(0, -2) / 2 / scaleX, $e.style('height').slice(0, -2) / 2 / scaleX];
                        rootpos = [$e.style('width').slice(0, -2) / 2 / scaleX, $e.style('height').slice(0, -2) / 2 / scaleX];
                    } else {
                        root.pos = rootpos;
                    }
                }
                var items = root.children;
                var n = root.children.length;
                var pos = root.pos;
                var r = root.r;
                for (var i = 0; i < n; i++) {
                    var PI = Math.PI, x, y, angle;
                    var item = items[i];
                    if (root.pj) {
                        angle = 2 * PI * i / n;
                    } else {
                        angle = 2 * PI * item.si / root.s;
                    }

                    if (root.deep == 0) {
                        angle += Math.PI / 4;
                    }
                    x = pos[0] + r * Math.cos(angle);
                    y = pos[1] + r * Math.sin(angle);
                    if (baseUtils.hasVal(root.id)) {
                        item.pos = root.pos;
                    } else {
                        item.pos = [Math.round(x), Math.round(y)];
                    }
                    this.setpos(item)
                }
            }
        }
    }

    init(option);
}