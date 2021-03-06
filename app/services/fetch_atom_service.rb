# frozen_string_literal: true

class FetchAtomService < BaseService
  def call(url)
    return if url.blank?

    response = Request.new(:head, url).perform

    Rails.logger.debug "Remote status HEAD request returned code #{response.code}"

    response = Request.new(:get, url).perform if response.code == 405

    Rails.logger.debug "Remote status GET request returned code #{response.code}"

    return nil if response.code != 200
    return [url, fetch(url)] if response.mime_type == 'application/atom+xml'
    return process_headers(url, response) if response['Link'].present?
    process_html(fetch(url))
  rescue OpenSSL::SSL::SSLError => e
    Rails.logger.debug "SSL error: #{e}"
    nil
  rescue HTTP::ConnectionError => e
    Rails.logger.debug "HTTP ConnectionError: #{e}"
    nil
  end

  private

  def process_html(body)
    Rails.logger.debug 'Processing HTML'

    page = Nokogiri::HTML(body)
    alternate_link = page.xpath('//link[@rel="alternate"]').find { |link| link['type'] == 'application/atom+xml' }

    return nil if alternate_link.nil?
    [alternate_link['href'], fetch(alternate_link['href'])]
  end

  def process_headers(url, response)
    Rails.logger.debug 'Processing link header'

    link_header    = LinkHeader.parse(response['Link'].is_a?(Array) ? response['Link'].first : response['Link'])
    alternate_link = link_header.find_link(%w(rel alternate), %w(type application/atom+xml))

    return process_html(fetch(url)) if alternate_link.nil?
    [alternate_link.href, fetch(alternate_link.href)]
  end

  def fetch(url)
    Request.new(:get, url).perform.to_s
  end
end
