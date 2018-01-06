var tipuesearch_stop_words = [
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "by",
    "cannot",
    "can't",
    "could",
    "couldn't",
    "did",
    "didn't",
    "do",
    "does",
    "doesn't",
    "doing",
    "don't",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "hadn't",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "he'd",
    "he'll",
    "her",
    "here",
    "here's",
    "hers",
    "herself",
    "he's",
    "him",
    "himself",
    "his",
    "how",
    "how's",
    "i",
    "i'd",
    "if",
    "i'll",
    "i'm",
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "its",
    "it's",
    "itself",
    "i've",
    "let's",
    "me",
    "more",
    "most",
    "mustn't",
    "my",
    "myself",
    "no",
    "nor",
    "not",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "ought",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "shan't",
    "she",
    "she'd",
    "she'll",
    "she's",
    "should",
    "shouldn't",
    "so",
    "some",
    "such",
    "than",
    "that",
    "that's",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "there's",
    "these",
    "they",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this",
    "those",
    "through",
    "to",
    "too",
    "under",
    "until",
    "up",
    "very",
    "was",
    "wasn't",
    "we",
    "we'd",
    "we'll",
    "were",
    "we're",
    "weren't",
    "we've",
    "what",
    "what's",
    "when",
    "when's",
    "where",
    "where's",
    "which",
    "while",
    "who",
    "whom",
    "who's",
    "why",
    "why's",
    "with",
    "won't",
    "would",
    "wouldn't",
    "you",
    "you'd",
    "you'll",
    "your",
    "you're",
    "yours",
    "yourself",
    "yourselves",
    "you've"    
];

var tipuesearch_replace = {
    words: [
        {
            word: "tip",
            replace_with: "tipue"
        },
        {
            word: "javscript",
            replace_with: "javascript"
        },
        {
            word: "jqeury",
            replace_with: "jquery"
        }
    ]
};

var tipuesearch_weight = {
    weight: [
        {
            url: "http://www.tipue.com",
            score: 20
        },
        {
            url: "http://www.tipue.com/search",
            score: 30
        },
        {
            url: "http://www.tipue.com/is",
            score: 10
        }
    ]
};

var tipuesearch_stem = {
    words: [
        {
            word: "e-mail",
            stem: "email"
        },
        {
            word: "javascript",
            stem: "jquery"
        },
        {
            word: "javascript",
            stem: "js"
        }
    ]
};

var tipuesearch_related = {
    searches: [
        {
            search: "tipue",
            related: "Tipue Search"
        },
        {
            search: "tipue",
            before: "Tipue Search",
            related: "Getting Started"
        },
        {
            search: "tipue",
            before: "Tipue",
            related: "jQuery"
        },
        {
            search: "tipue",
            before: "Tipue",
            related: "Blog"
        }
    ]
};

var tipuesearch_string_1 = "No title";
var tipuesearch_string_2 = "Showing results for";
var tipuesearch_string_3 = "Search instead for";
var tipuesearch_string_4 = "1 result";
var tipuesearch_string_5 = "results";
var tipuesearch_string_6 = "Back";
var tipuesearch_string_7 = "More";
var tipuesearch_string_8 = "Nothing found.";
var tipuesearch_string_9 = "Common words are largely ignored.";
var tipuesearch_string_10 = "Search too short";
var tipuesearch_string_11 = "Should be one character or more.";
var tipuesearch_string_12 = "Should be";
var tipuesearch_string_13 = "characters or more.";
var tipuesearch_string_14 = "seconds";
var tipuesearch_string_15 = "Searches related to";

var startTimer = new Date().getTime();
