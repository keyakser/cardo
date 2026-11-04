# Submission texts (Meta Global AI Developer Hackathon)

Ready to paste into the form. Fill the placeholders marked TODO.

## Team name

Kurdolingo

## Track

Indie Developer

## Problem statement

Build for Your World

## X post link (Most Viral)

TODO: paste the link of the pinned X post

## Public GitHub repo

https://github.com/keyakser/cardo

(The repo must be switched to public before submitting.)

## Demo video (YouTube)

TODO: https://www.youtube.com/watch?v=...

## Project description

Cardo turns the world around you into Kurdish flashcards. Kurdish is spoken by tens of millions of people, but it has very few learning tools, and most language apps don't offer it at all. Many families, especially in the diaspora, have children who understand some Kurdish but can't name the things in their own home.

With Cardo, you take a photo of your kitchen table, your desk or your street. Muse Wonder recognises the objects and writes a card for each one: the Kurdish word, an example sentence about your photo, a translation and a short note. SAM 3.1 then cuts each object out of your own photo, so the card shows your cup, not a stock picture. For words without an object, Muse Image draws a risograph-style illustration. You can also type a topic or paste a song or story.

Cards can be studied, quizzed (meaning, picture, spelling), saved and exported as JPG, PDF or Anki-ready CSV. Cardo also has 300 illustrated ready-made words, a Kurdish alphabet page, a word of the day, and works in 14 interface languages, including right-to-left. It is free, by Kurdolingo, and live at https://cardokurdish.vercel.app.

## Describe your use of Meta products

Cardo uses three Meta models through the Meta Model API.

1. Muse Wonder (muse-wonder-1.0) is the core. We call it through the Messages-compatible endpoint with @anthropic-ai/sdk (baseURL api.meta.ai). Photos are resized in the browser and sent as image blocks; the model returns strict JSON cards (word, part of speech, meaning, example, translation, note). In photo mode it also returns a short English noun phrase per card naming the object. Setting effort to "low" cut a deck from about 42 s to about 10 s.

2. SAM 3.1 (sam-3.1) receives those noun phrases and the photo over the streaming Responses API, all cards in parallel (about 2.7 s for 8 cards). We parse masks with @meta-sam/parser, convert them to SVG paths, and the browser cuts each object out as a sticker.

3. Muse Image (muse-image-1.0) draws on-demand card illustrations in our riso palette via the image_generation tool (about 10–13 s each). It also made our sample photo.

## Why are Meta's models important to your solution?

Kurdish is a low-resource language: there is little learning material and few tools that handle it well. Muse Wonder can see a photo and write accurate, structured Kurdish cards with explanations in the learner's own language, returned as clean JSON that our app can study, quiz and export. That turns any room into a lesson without us building a dictionary for every object.

SAM 3.1 makes the learning personal: the picture on each card is the learner's own object, cut out of their own photo, which helps memory far more than stock images.

Muse Image covers what a photo can't: actions, feelings and abstract words get a drawn illustration in a consistent style. Together, one API key gives us vision, language, segmentation and image generation.

## X post (Most Viral)

Text (under 280 characters):

> Everything has a Kurdish name. 📸 Snap a photo, get Kurdish flashcards with your own objects cut out, built with Meta's Muse + SAM 3.1. Free: https://cardokurdish.vercel.app
>
> Comment any word 👇 and we'll reply with its Kurdish card!

Attach the 90-second video natively and pin the post.

## Partner feedback

(Optional. We used no partner tools.)
