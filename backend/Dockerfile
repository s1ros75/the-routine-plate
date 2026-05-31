FROM ruby:3.3-alpine

RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    yaml-dev \
    openssl-dev \
    linux-headers \
    tzdata \
    bash \
    git

WORKDIR /app

COPY Gemfile Gemfile.lock* ./
RUN bundle install --jobs 4 --retry 3

COPY . .

EXPOSE 3000
CMD ["bash", "entrypoint.sh"]
