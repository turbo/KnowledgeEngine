# KnowledgeEngine

This is a very simple web app that attempts to classify and occasionally define unknown entities expressed as words or very short phrases. It does so in many languages.

### Process

Humans have to ability to come up with new words or phrases, leading to an infinite number of unclassified entities. These entities are used to express a smaller (maybe even finite) set of ideas. These ideas are mentioned, analyzed and discussed by a larger group of humans, because they describe many entities. Thus, the idea becomes a trend. As language changes, trends change. So it would be nice to have an even smaller, definitely finite set of categories to file and track these trends. This abstraction is performed by this app.

Say you want to abstract *machine learning*. Let's enter that into the engine and see what it comes up with: [English: *machine learning*](http://brain.turbo.run/?q=machine%20learning).

There is a maximum of five results, expressing the confidence level (0 to 5). For the **entity** *machine learning*, there are 5 identifiable **ideas**. The first one is:

> **Machine learning** ( Field of study )  
> Machine learning is a subfield of computer science that evolved from the study of pattern recognition and computational learning theory in artificial intelligence.

The results always follow this pattern:

```text
idea ( category )
definition
```

The engine abstracts the entity into an idea. For every idea the engine knows about, there is a respective category (which might be a sub-category of something else). This is the actual result. The definition is just a bit of fun. It is retrieved client-side, using the idea as a search term in a request to Wikipedia's search API.

A category defaults to "Topic" if the idea is *more* relevant as a conversation topic on the internet than it fits into any category.

### Internationalization

(What a word). The engine supports many languages. Of course the success of finding a definition is less likely for less common languages.

How about *machine learning* in "Chinese: *[机器学习](http://brain.turbo.run/?q=%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0&l=zh-CN)*" (at least I think that's the translation).

### Usage

If the engine stops working for a day that probably means the used resources are exhausted. Just wait a bit.

If you have a project that could benefit from this abstraction performed,
contact me (minxomat[at]gmail.com) and we can setup a dedicated API (probably).
