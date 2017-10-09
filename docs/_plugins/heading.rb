require "nokogiri"

class HeadingGenerator < Jekyll::Generator
  def generate(site)
    parser = Jekyll::Converters::Markdown.new(site.config)

    site.pages.each do |page|
      if page.ext == ".md" && page['heading'] == true
        siteHash = {
          'data' => site.data
        }
        context = {
          'site' => siteHash.merge(site.config),
          'page' => page.data
          }
        context['site'][:data] = site.data
        doc = Nokogiri::HTML(parser.convert(Liquid::Template.parse(page['content']).render(context)))
        page.data["subnav"] = []
        doc.css('h1, h2, h3, h4, h5, h6').each do |heading|
          page.data["subnav"] << {
            "id" => heading['name'] || heading['id'],
            "depth" => heading.name.delete('h').to_i,
            "title" => heading.attr('data-menu-title') || heading.text,
            "class" => heading['class']
          }
        end
      end
    end
  end
end
