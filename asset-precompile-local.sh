#!/bin/bash

if [ $(hostname) = 'bookwor' ]; then
  echo 'Do not execute on bookworms server.'
  exit 1
fi

scp bookworms:/home/mastodon/live/.env.production .
docker-compose build --force-rm && \
  docker-compose run --rm web rails assets:precompile && \
  scp -r -i $IDENTITTY_FOR_BW public/assets/ mastodon@bookworms:/home/mastodon/live/public/ && \
  scp -r -i $IDENTITTY_FOR_BW public/packs/ mastodon@bookworms:/home/mastodon/live/public/
