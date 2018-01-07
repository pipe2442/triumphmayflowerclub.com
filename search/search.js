const baseUrl = window.location.origin;

(function ($) {
    $.fn.search = function (options) {
        var set = $.extend({
            contextBuffer: 60,
            contextLength: 60,
            contextStart: 90,
            debug: false,
            descriptiveWords: 25,
            highlightTerms: true,
            liveContent: "*",
            liveDescription: "*",
            minimumLength: 3,
            newWindow: false,
            show: 9,
            showContext: true,
            showTime: true,
            showTitleCount: true,
            showURL: true,
            wholeWords: true
        }, options);

        return this.each(function () {
            $.ajaxSetup({ async: false });

            var tipuesearch_t_c = 0;
            var tipue_search_w = "";

            if (set.newWindow) {
                tipue_search_w = " target=\"_blank\"";
            }

            function getURLP(name) {
                var _locSearch = location.search;
                var _splitted = (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(_locSearch) || [, ""]);
                var searchString = _splitted[1].replace(/\+/g, "%20");

                try {
                    searchString = decodeURIComponent(searchString);
                } catch (e) {
                    searchString = unescape(searchString);
                }

                return searchString || null;
            }

            if (getURLP("query")) {
                $("#searchBox").val(getURLP("query"));
                getTipueSearch(0, true);
            }

            $(this).keyup(function (event) {
                if (event.keyCode == "13") {
                    getTipueSearch(0, true);
                }
            });

            function getTipueSearch(start, replace) {
                const searchBoxValue = $("#searchBox").val();

                var out = "";
                var show_replace = false;
                var show_stop = false;
                var standard = true;
                var c = 0;

                found = [];

                var d = searchBoxValue.toLowerCase().trim();

                if ((d.match("^\"") && d.match("\"$")) || (d.match("^'") && d.match("'$"))) {
                    standard = false;
                }

                var d_w = d.split(" ");

                if (standard) {
                    d = "";

                    for (var i = 0; i < d_w.length; i++) {
                        var a_w = true;

                        for (var f = 0; f < commonWords.length; f++) {
                            if (d_w[i] == commonWords[f]) {
                                a_w = false;
                                show_stop = true;
                            }
                        }

                        if (a_w) {
                            d = d + " " + d_w[i];
                        }
                    }

                    d = $.trim(d);
                    d_w = d.split(" ");
                } else {
                    d = d.substring(1, d.length - 1);
                }

                if (d.length >= set.minimumLength) {
                    if (standard) {
                        if (replace) {
                            var d_r = d;

                            for (var i = 0; i < d_w.length; i++) {
                                for (var f = 0; f < correctionSuggestions.length; f++) {
                                    if (d_w[i] == correctionSuggestions[f].word) {
                                        d = d.replace(d_w[i], correctionSuggestions[f].suggestion);
                                        show_replace = true;
                                    }
                                }
                            }

                            d_w = d.split(" ");
                        }

                        var d_t = d;

                        for (var i = 0; i < d_w.length; i++) {
                            for (var f = 0; f < synonyms.length; f++) {
                                if (d_w[i] == synonyms[f].word) {
                                    d_t = d_t + " " + synonyms[f].synonym;
                                }
                            }
                        }

                        d_w = d_t.split(" ");

                        for (var i = 0; i < pageIndex.length; i++) {
                            var weight = 0;
                            var s_t = pageIndex[i].text;

                            for (var f = 0; f < d_w.length; f++) {
                                if (set.wholeWords) {
                                    var pat = new RegExp("\\b" + d_w[f] + "\\b", "gi");
                                }

                                else {
                                    var pat = new RegExp(d_w[f], "gi");
                                }

                                if (pageIndex[i].title.search(pat) != -1) {
                                    var m_c = pageIndex[i].title.match(pat).length;
                                    weight += (20 * m_c);
                                }

                                if (pageIndex[i].text.search(pat) != -1) {
                                    var m_c = pageIndex[i].text.match(pat).length;
                                    weight += (20 * m_c);
                                }

                                if (pageIndex[i].tags.search(pat) != -1) {
                                    var m_c = pageIndex[i].tags.match(pat).length;
                                    weight += (10 * m_c);
                                }

                                if (pageIndex[i].url.search(pat) != -1) {
                                    weight += 20;
                                }

                                if (weight != 0) {
                                    for (var e = 0; e < weightings.length; e++) {
                                        if (pageIndex[i].url == weightings[e].url) {
                                            weight += weightings[e].weight;
                                        }
                                    }
                                }

                                if (d_w[f].match("^-")) {
                                    pat = new RegExp(d_w[f].substring(1), "i");
                                    if (pageIndex[i].title.search(pat) != -1 || pageIndex[i].text.search(pat) != -1 || pageIndex[i].tags.search(pat) != -1) {
                                        weight = 0;
                                    }
                                }
                            }

                            if (weight != 0) {
                                found.push({
                                    weight: weight,
                                    title: pageIndex[i].title,
                                    desc: s_t,
                                    url: pageIndex[i].url
                                });

                                c++;
                            }
                        }
                    } else {
                        for (var i = 0; i < pageIndex.length; i++) {
                            var weight = 0;
                            var s_t = pageIndex[i].text;
                            var pat = new RegExp(d, "gi");

                            if (pageIndex[i].title.search(pat) != -1) {
                                var m_c = pageIndex[i].title.match(pat).length;
                                weight += (20 * m_c);
                            }

                            if (pageIndex[i].text.search(pat) != -1) {
                                var m_c = pageIndex[i].text.match(pat).length;
                                weight += (20 * m_c);
                            }

                            if (pageIndex[i].tags.search(pat) != -1) {
                                var m_c = pageIndex[i].tags.match(pat).length;
                                weight += (10 * m_c);
                            }

                            if (pageIndex[i].url.search(pat) != -1) {
                                weight += 20;
                            }

                            if (weight != 0) {
                                for (var e = 0; e < weightings.length; e++) {
                                    if (pageIndex[i].url == weightings[e].url) {
                                        weight += weightings[e].weight;
                                    }
                                }
                            }

                            if (weight != 0) {
                                found.push(
                                    {
                                        weight: weight,
                                        title: pageIndex[i].title,
                                        desc: s_t,
                                        url: pageIndex[i].url
                                    });
                                c++;
                            }
                        }
                    }

                    if (c != 0) {
                        if (set.showTitleCount && tipuesearch_t_c == 0) {
                            var title = document.title;
                            document.title = "(" + c + ") " + title;
                            tipuesearch_t_c++;
                        }

                        if (show_replace) {
                            out += "<div id=\"tipue_search_warning\">Showing results for <i>" + d + "</i>. Search instead for <i><a id=\"tipue_search_replaced\">" + d_r + "</a></i>?</div>";
                        }

                        if (c == 1) {
                            out += "<div id=\"tipue_search_results_count\">1 result";
                        }

                        else {
                            c_c = c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            out += "<div id=\"tipue_search_results_count\">" + c_c + " results";
                        }

                        if (set.showTime) {
                            var endTime = new Date().getTime();
                            var time = (endTime - startTime) / 1000;

                            out += " (search took " + time.toFixed(2) + " seconds).";

                            set.showTime = false;
                        }

                        out += "</div>";

                        found.sort(function (a, b) { return b.weight - a.weight });

                        var l_o = 0;

                        for (var i = 0; i < found.length; i++) {
                            if (l_o >= start && l_o < set.show + start) {
                                out += "<div class=\"tipue_search_content_title\"><a href=\"" + found[i].url + "\"" + tipue_search_w + ">" + found[i].title + "</a></div>";

                                if (set.debug) {
                                    out += "<div class=\"tipue_search_content_debug\">Score: " + found[i].weight + "</div>";
                                }

                                if (set.showURL) {
                                    var s_u = found[i].url.toLowerCase();

                                    if (s_u.indexOf("http://") == 0) {
                                        s_u = s_u.slice(7);
                                    }

                                    out += "<div class=\"tipue_search_content_url\"><a href=\"" + found[i].url + "\"" + tipue_search_w + ">" + s_u + "</a></div>";
                                }

                                if (found[i].desc) {
                                    var t = found[i].desc;

                                    if (set.showContext) {
                                        d_w = d.split(" ");

                                        var s_1 = found[i].desc.toLowerCase().indexOf(d_w[0]);

                                        if (s_1 > set.contextStart) {
                                            var t_1 = t.substr(s_1 - set.contextBuffer);
                                            var s_2 = t_1.indexOf(" ");

                                            t_1 = t.substr(s_1 - set.contextBuffer + s_2);
                                            t_1 = $.trim(t_1);

                                            if (t_1.length > set.contextLength) {
                                                t = "... " + t_1;
                                            }
                                        }
                                    }

                                    if (standard) {
                                        d_w = d.split(" ");

                                        for (var f = 0; f < d_w.length; f++) {
                                            if (set.highlightTerms) {
                                                var patr = new RegExp("(" + d_w[f] + ")", "gi");
                                                t = t.replace(patr, "<h0011>$1<h0012>");
                                            }
                                        }
                                    }

                                    else if (set.highlightTerms) {
                                        var patr = new RegExp("(" + d + ")", "gi");
                                        t = t.replace(patr, "<span class=\"tipue_search_content_bold\">$1</span>");
                                    }

                                    var t_d = "";
                                    var t_w = t.split(" ");

                                    if (t_w.length < set.descriptiveWords) {
                                        t_d = t;
                                    }

                                    else {
                                        for (var f = 0; f < set.descriptiveWords; f++) {
                                            t_d += t_w[f] + " ";
                                        }
                                    }

                                    t_d = $.trim(t_d);

                                    if (t_d.charAt(t_d.length - 1) != ".") {
                                        t_d += " ...";
                                    }

                                    t_d = t_d.replace(/h0011/g, "span class=\"tipue_search_content_bold\"");
                                    t_d = t_d.replace(/h0012/g, "/span");

                                    out += "<div class=\"tipue_search_content_text\">" + t_d + "</div>";
                                }
                            }

                            l_o++;
                        }

                        if (c > set.show) {
                            var pages = Math.ceil(c / set.show);
                            var page = (start / set.show);
                            var paginationOpeningTags = "<footer><div id=\"tipue_search_foot\"><ul id=\"tipue_search_foot_boxes\">";
                            var paginationClosingTags = "</ul></div></footer>";

                            out += paginationOpeningTags;

                            if (start > 0) {
                                out += "<li role=\"navigation\"><a class=\"tipue_search_foot_box\" accesskey=\"b\" id=\"" + (start - set.show) + "_" + replace + "\">Back</a></li>";
                            }

                            if (page <= 2) {
                                var p_b = pages;

                                if (pages > 3) {
                                    p_b = 3;
                                }

                                for (var f = 0; f < p_b; f++) {
                                    if (f == page) {
                                        out += "<li class=\"current\" role=\"navigation\">" + (f + 1) + "</li>";
                                    }

                                    else {
                                        out += "<li role=\"navigation\"><a class=\"tipue_search_foot_box\" id=\"" + (f * set.show) + "_" + replace + "\">" + (f + 1) + "</a></li>";
                                    }
                                }
                            } else {
                                var p_b = page + 2;

                                if (p_b > pages) {
                                    p_b = pages;
                                }

                                for (var f = page - 1; f < p_b; f++) {
                                    if (f == page) {
                                        out += "<li class=\"current\" role=\"navigation\">" + (f + 1) + "</li>";
                                    } else {
                                        out += "<li role=\"navigation\"><a class=\"tipue_search_foot_box\" id=\"" + (f * set.show) + "_" + replace + "\">" + (f + 1) + "</a></li>";
                                    }
                                }
                            }

                            if (page + 1 != pages) {
                                out += "<li role=\"navigation\"><a class=\"tipue_search_foot_box\" accesskey=\"m\" id=\"" + (start + set.show) + "_" + replace + "\">Next</a></li>";
                            }

                            out += paginationClosingTags;
                        }
                    } else {
                        out += "<div id=\"tipue_search_warning\">No results.</div>";
                    }
                } else {
                    if (show_stop) {
                        out += "<div id=\"tipue_search_warning\">No results. Common words are ignored.</div>";
                    } else {
                        out += "<div id=\"tipue_search_warning\">Search term too short.</div>";

                        if (set.minimumLength == 1) {
                            out += "<div id=\"tipue_search_warning\">Should be one character or more.</div>";
                        } else {
                            out += "<div id=\"tipue_search_warning\">Should be " + set.minimumLength + " characters or more.</div>";
                        }
                    }
                }

                $("#searchResultsContainer").html(out);
                $("#relatedSearchesContainer").html(getRelatedSearchesHtml(d));

                $("#tipue_search_replaced").click(function () {
                    getTipueSearch(0, false);
                });

                $(".tipue_search_foot_box").click(function () {
                    var id_v = $(this).attr("id");
                    var id_a = id_v.split("_");

                    getTipueSearch(parseInt(id_a[0]), id_a[1]);
                });
            }
        });
    };
})(jQuery);

function getRelatedSearchesHtml(searchTerm) {
    let relatedSearches = relatedSearchesIndex.filter(r => searchTerm === r.search);

    if (relatedSearches.length === 0) return "<p><i>No related searches.</i></p>";

    return `
        <p>Searches related to <i>${searchTerm}</i>:</p>
        <ul>
            ${relatedSearches.map(({ related }) => `
                <li>
                    <a href="${baseUrl}/search${searchTermToQueryString(related)}">${related}</a>
                </li>
            `).join("")}
        </ul>
    `;
}

function searchTermToQueryString(searchTerm) {
    let serialisedSearchTerm = searchTerm
        .trim()
        .toLowerCase()
        .replace(" ", "+");
    
    return `?query=${serialisedSearchTerm}`;
}
