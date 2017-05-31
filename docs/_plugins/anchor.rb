require 'nokogiri'
require 'octicons'

module Jekyll
  module AnchorFilter
    def anchors(html)
      return html unless page['anchor']

      doc = Nokogiri::HTML::DocumentFragment.parse(html)
      doc.css('h1, h2, h3, h4, h5, h6').add_class('anchor').each do |node|
        name = node['name']
        id = node['id']
        node.delete('id')
        icon = ::Octicons::Octicon.new('link')
        node.children.last.after(%(<a id="#{name || id}" class="anchor-link" name="#{name || id}" href="##{name || id}" aria-hidden="true">#{icon.to_svg}</a>))
      end

      return doc.inner_html
    end

    private

    def page
      @context.registers[:page]
    end
  end
end

Liquid::Template.register_filter(Jekyll::AnchorFilter)
