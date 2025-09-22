class UnsplashService
  def self.get_image(subject)
    new.get_image(subject)
  end

  def get_image(subject)
    require 'net/http'
    require 'uri'
    require 'json'

    client_id = Rails.application.credentials.unsplash_access_key || ENV['UNSPLASH_ACCESS_KEY']    
    return nil unless client_id

    begin
      uri = URI("https://api.unsplash.com/search/photos")
      uri.query = URI.encode_www_form({
        page: 1,
        query: subject,
        per_page: 1
      })

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Get.new(uri)
      request['Content-Type'] = 'application/json'
      request['Accept'] = 'application/json'
      request['Accept-Version'] = 'v1'
      request['Authorization'] = "Client-ID #{client_id}"
      response = http.request(request)

      if response.code == '200'
        data = JSON.parse(response.body)
        return data.dig('results', 0, 'urls', 'small')
      else
        Rails.logger.error "Unsplash API error: #{response.code} - #{response.body}"
        return nil
      end

    rescue => e
      Rails.logger.error "Error fetching image from Unsplash: #{e.message}"
      return nil
    end
  end

  private

  def client_id
    Rails.application.credentials.unsplash_access_key || ENV['UNSPLASH_ACCESS_KEY']
  end
end