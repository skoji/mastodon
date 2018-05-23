#!/bin/bash

scp -r -i $IDENTITTY_FOR_BW public/assets/ mastodon@bookworms:/home/mastodon/live/public/ && \
scp -r -i $IDENTITTY_FOR_BW public/packs/ mastodon@bookworms:/home/mastodon/live/public/
